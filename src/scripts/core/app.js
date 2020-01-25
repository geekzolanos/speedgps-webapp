(document.hidden != undefined) || (document.hidden = document.hidden || document.mozHidden || document.msHidden || document.webkitHidden);
window.Notification || (window.Notification = window.Notification || navigator.mozNotification || navigator.webkitNotification);

var app = {
    appName: 'SpeedGPS',
    appVer: '2.2.1',
    appIcon: '/res/logo128.png',
    isBrowser: false,
    rootPath: utils.getRootPath(),
    bootStatus: 2,
    IS_APP_STARTING: true,
    DEFAULT_SLOT_GAUGE_PARAMS: {
        id: 'gauge',
        size: new Size('15rem'),
        position: Positions.CENTER,
        locked: true
    },
    DEFAULT_UNITS: [new Unit('m/s', 'Metros por segundo', 1), new Unit('Km/h', 'Kilómetros por hora', 3.6), new Unit('MPH', 'Millas por hora', 2.24)],
    DEFAULT_PREFS: [{
            name: 'wp_prefs',
            enableHighAccuracy: true,
            timeout: 600000,
            maximumAge: 120000
        },
        {
            name: 'units',
            default: 2
        },
        {
            name: 'data',
            notify: Modernizr.notification,
            vibration: {
                enabled: Modernizr.vibrate,
                duration: 1000
            },
            audio: {
                enabled: Modernizr.audio,
                src: 'res/chime.mp3'
            }
        }
    ],
    setCompatModules: function() {
        compat.register('geolocation');
        compat.register('indexeddb');
        compat.register('promises', 'promise.min.js');
        compat.register('fetch', 'fetch.js');
        compat.register('es6array', 'es6array.js');
    }
};

window.addEventListener('compatpass', function() {
    app.idb.connect('idb_speedgps').then(function() {
        app.boot.start()
    })
});

document.addEventListener('deviceready', function() {
    app.setCompatModules();
    compat.evaluate(function() {
        document.body.innerHTML = 'Su explorador es incompatible con esta aplicacion. Le recomendamos que actualize su navegador.', document.body.style.color = '#ffffff'
    });

    app.isBrowser = device.platform == 'browser'; // TODO: Bajo que plataforma es reconocido FFOS?

    if ((device.platform == 'browser') && ('serviceWorker' in navigator)) {
        navigator.serviceWorker.register('sw.js');
    }
}, false);

window.onerror = function(a, b, c) {
    console.error(app.appName + ' -> Error Grave, App Detenida. Mensaje de Error: ' + a + ' Ubicacion de error: ' + b + ' , ' + c)
}