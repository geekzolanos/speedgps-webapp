const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const fs = require('fs');
const mkdirp = require('mkdirp');
const Modernizr = require('modernizr');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const merge = require('merge-stream');
const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;

const isProd = process.env.NODE_ENV === 'production';

function styles() {
    return styleBase('src/styles/*.scss')
        .pipe(dest('.tmp/styles'))
        .pipe(server.reload({ stream: true }));
};

function actStyles() {
    return styleBase('src/activities/**/style/*.css')
        .pipe(dest('www/activities'));
}

function vendorRes() {
    return src([
            'src/styles/vendor/**/*.{eot,ttf,woff,woff2}',
            '!src/styles/vendor/gaia/**',
            'src/styles/vendor/gaia/**/*.{eot,svg,ttf,woff,woff2,png,svg}'
        ])
        .pipe(dest('www/styles'));
}

function styleBase(files) {
    return src(files)
        .pipe($.plumber())
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.if(/\.scss$/, $.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        }).on('error', $.sass.logError)))
        .pipe($.if(!!isProd,
            $.postcss([autoprefixer(), cssnano()]),
            $.postcss([autoprefixer()])
        ))
        .pipe($.if(!isProd, $.sourcemaps.write()))
}

function scripts() {
    return scriptsBase('src/scripts/**/*.js')
        .pipe(dest('.tmp/scripts'))
        .pipe(server.reload({ stream: true }));
};

function actScripts() {
    return scriptsBase('src/activities/**/scripts/*.js')
        .pipe(dest('www/activities'))
        .pipe(server.reload({ stream: true }));
}

function scriptsBase(files) {
    return src(files)
        .pipe($.plumber())
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.babel())
        .pipe($.if(!!isProd, $.uglify({ compress: { drop_console: isProd } })))
        .pipe($.if(!isProd, $.sourcemaps.write('.')));
}

async function modernizr() {
    const readConfig = () => new Promise((resolve, reject) => {
        fs.readFile(`${__dirname}/modernizr.json`, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(JSON.parse(data));
        })
    })
    const createDir = () => new Promise((resolve, reject) => {
        mkdirp(`${__dirname}/.tmp/scripts`, err => {
            if (err) reject(err);
            resolve();
        })
    });
    const generateScript = config => new Promise((resolve, reject) => {
        Modernizr.build(config, content => {
            fs.writeFile(`${__dirname}/.tmp/scripts/modernizr.js`, content, err => {
                if (err) reject(err);
                resolve(content);
            });
        })
    });

    const [config] = await Promise.all([
        readConfig(),
        createDir()
    ]);
    await generateScript(config);
}

const lintBase = files => {
    return src(files)
        .pipe($.eslint({ fix: true }))
        .pipe(server.reload({ stream: true, once: true }))
        .pipe($.eslint.format())
        .pipe($.if(!server.active, $.eslint.failAfterError()));
}

function lint() {
    return lintBase(['src/scripts/**/*.js', 'src/activities/**/scripts/*.js']);
};

const globalHtmlMinOpts = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: { compress: { drop_console: true } },
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
}

function html() {
    return src('src/*.html')
        .pipe($.useref({ searchPath: ['.tmp', 'src', '.'] }))
        .pipe($.if(/\.html$/, $.htmlmin(globalHtmlMinOpts)))
        .pipe(dest('www'));
}

function actHtml() {
    return src('src/activities/**/*.html')
        .pipe($.htmlmin(globalHtmlMinOpts))
        .pipe(dest('www/activities'))
        .pipe(server.reload({ stream: true }));
}

function actExtras() {
    return src('src/activities/activities.json')
        .pipe(dest('www/activities'))
        .pipe(src(['src/activities/**/res/*'], { dot: true }))
        .pipe(dest('www/activities'));
};

function extras() {
    const res = src('src/res/*')
        .pipe($.imagemin())
        .pipe(dest('www/res'));

    const root = src(['src/*', '!src/*.html'], { dot: true })
        .pipe(dest('www'));

    return merge(res, root);
};

function clean() {
    return del(['.tmp', 'www']);
}

function measureSize() {
    return src('www/**/*')
        .pipe($.size({ title: 'build', gzip: true }));
}

const build = series(
    clean,
    parallel(
        lint,
        series(
            parallel(styles, vendorRes, scripts, modernizr),
            html,
            parallel(actHtml, actScripts, actStyles, actExtras)),
        extras
    ),
    measureSize
);

const dev = series(
    clean,
    parallel(
        lint,
        series(parallel(styles, modernizr))
    )
);

function startAppServer() {
    server.init({
        https: true,
        notify: false,
        port,
        server: {
            baseDir: ['.tmp', 'app'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });

    watch([
        'src/*.html',
        'src/res/**/*',
        'src/scripts/**/*.js',
        'src/activities/**/*.html',
        'src/activities/**/style/*.css',
        'src/activities/**/scripts/*.js'
    ]).on('change', server.reload);

    watch('src/styles/**/*.scss', styles);
    watch('modernizr.json', modernizr);
}

function startwwwServer() {
    server.init({
        https: true,
        notify: false,
        port,
        server: {
            baseDir: 'www',
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
}

let serve;
if (isProd) {
    serve = series(build, startwwwServer);
} else {
    serve = series(dev, startAppServer);
}

exports.serve = serve;
exports.build = build;
exports.clean = series(clean);
exports.default = build;