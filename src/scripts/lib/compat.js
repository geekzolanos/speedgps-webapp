(function() {
    window.compat = {
        name: 'Compat',
        catalog: [],
        idxCatalog: 0,

        checkBrowser: function() {
            var agent, ver, retval = false;
            if (!navigator.sayswho) return false;

            agent = navigator.sayswho();
            agent = agent.split(' ');
            ver = parseInt(agent[1]);

            switch (agent[0]) {
                case 'Firefox':
                    ver >= 28 && (retval = true);
                    break;
                case 'Chrome':
                    ver >= 32 && (retval = true);
                    break;
            }

            return true;
        },

        setPolyfill: function(filename, callback) {
            if ('string' != typeof filename) throw new TypeError('filename no es una cadena.');
            var curPath = document.location.pathname,
                basePath = curPath.slice(0, curPath.lastIndexOf('/') + 1),
                scriptNode = document.createElement('script');

            scriptNode.src = basePath + 'scripts/thirdparty/polyfills/' + filename;
            scriptNode.async = false;

            document.head.appendChild(scriptNode);

            if ('function' == typeof callback) {
                if ('addEventListener' in scriptNode) {
                    scriptNode.addEventListener('load', callback);
                } else {
                    scriptNode.onload = scriptNode.onreadystatechange = function() {
                        if (!(this.readyState && 'loaded' !== this.readyState && 'complete' !== this.readyState))
                            callback();
                    }
                }
            }
        },

        sendSuccess: function() {
            var ev = new CustomEvent('compatpass');
            window.dispatchEvent(ev);
        },

        evaluate: function(onFailure) {
            var browserSupported = this.checkBrowser();
            if (!browserSupported || !Modernizr) {
                onFailure();
            } else {
                this.checkModules(onFailure);
            }
        },

        checkModules: function(onFailure) {
            var self = this,
                idx = this.idxCatalog;

            if (idx < this.catalog.length) {
                Modernizr.on(this.catalog[idx].module, (result) => {
                    if (result) {
                        self.idxCatalog++;
                        this.checkModules(onFailure);
                    } else {
                        if (this.catalog[idx].polyfill) {
                            this.setPolyfill(this.catalog[idx].polyfill, function() {
                                self.idxCatalog++;
                                self.checkModules(onFailure);
                            });
                        } else {
                            onFailure();
                        }
                    }
                });
            } else {
                this.sendSuccess();
            }
        },

        register: function(name, polyfill) {
            if ('string' != typeof name) throw new TypeError('name no es una cadena.');
            this.catalog.push({ module: name, polyfill: polyfill });
        }
    }

    navigator.sayswho = function() {
        var a, b, c = navigator.userAgent;
        return b = c.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [], /trident/i.test(b[1]) ? (a = /\brv[ :]+(\d+)/g.exec(c) || [], 'IE ' + (a[1] || '')) : 'Chrome' === b[1] && (a = c.match(/\b(OPR|Edge)\/(\d+)/), null !== a) ? a.slice(1).join(' ').replace('OPR', 'Opera') : (b = b[2] ? [b[1], b[2]] : [navigator.appName, navigator.appVersion, '-?'], null !== (a = c.match(/version\/(\d+)/i)) && b.splice(1, 1, a[1]), b.join(' '))
    }
})();