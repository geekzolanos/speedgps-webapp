app.wp = {
    name: 'WatchPosition',

    idxWatchPos: null,

    setActive: function(value) {
        var prefs = app.prefs.get('wp_prefs');

        if ('boolean' != typeof value) throw new TypeError('value no es booleano.');

        if (value === true) {
            this.idxWatchPos = navigator.geolocation.watchPosition(function(data) {
                app.data.receive(data);
            }, function(err) {
                debug.errPos(err);
            }, prefs);
        } else {
            if (isNaN(this.idxWatchPos)) return;
            navigator.geolocation.clearWatch(this.idxWatchPos);
        }
    },

    setPrefs: function(obj) {
        var needsUpdate = false,
            prefs = app.prefs.get('wp_prefs');

        if (!obj) throw new ReferenceError('obj no esta definido.');

        if ('boolean' == typeof obj.enableHighAccuracy && obj.enableHighAccuracy != prefs.enableHighAccuracy) {
            prefs.enableHighAccuracy = obj.enableHighAccuracy;
            needsUpdate = true;
        }

        if ('number' == typeof obj.timeout && obj.timeout != prefs.timeout) {
            prefs.timeout = obj.timeout;
            needsUpdate = true;
        }

        if ('number' == typeof obj.maximumAge && obj.maximumAge != prefs.maximumAge) {
            prefs.maximumAge = obj.maximumAge;
            needsUpdate = true;
        }

        return new Promise(function(resolve, reject) {
            needsUpdate === true ? app.prefs.set(prefs).then(resolve, reject) : resolve();
        });
    }
};