/**
 * Data core
 */
app.data = {
    name: 'Data',

    receive: function(data) {
        if (!data) throw new ReferenceError('data no esta definido.');

        switch (app.bootStatus) {
            case 2:
                app.bootStatus = 1;
                break;
            case 1:
                if (!isNaN(data.coords.speed) && data.coords.accuracy <= 100) {
                    this.playSuccess();
                    app.bootStatus = 0;
                }
                break;
            case 0:
                if (data.coords.accuracy <= 100)
                    am.events.dispatchAll(new CustomEvent('newdata', { detail: data }));
                break;
        }
    },

    playSuccess: function() {
        var prefs = app.prefs.get('data');

        if (document.hidden && prefs.notify) {
            app.notify.send({
                body: 'Se ha logrado una conexion exitosa con el sistema GPS.',
                sound: prefs.audio.enabled ? (app.rootPath + prefs.audio.src) : null,
                vibrate: prefs.vibration.enabled ? prefs.vibration.duration : null
            });
        } else {
            if (prefs.audio.enabled) {
                var node = document.querySelector('#audioSuccess');
                if (!node) {
                    node = document.createElement('audio');
                    node.id = 'audioSuccess';
                    node.src = app.rootPath + prefs.audio.src;
                    document.body.appendChild(node);
                }
                node.play();
            }

            prefs.vibration.enabled &&
                navigator.vibrate && navigator.vibrate(prefs.vibration.duration);
        }
    },

    setPrefs: function(obj) {
        var requiresUpdate = false,
            prefs = app.prefs.get('data');

        if (!obj) throw new ReferenceError('obj no esta definido.');

        if (obj.vibration) {
            if ('boolean' == typeof obj.vibration.enabled && obj.vibration.enabled != prefs.vibration.enabled)
                (prefs.vibration.enabled = obj.vibration.enabled, requiresUpdate = true)

            if ('number' == typeof obj.vibration.duration && obj.vibration.duration != prefs.vibration.duration)
                (prefs.vibration.duration = obj.vibration.duration, requiresUpdate = true)
        }

        if (obj.audio) {
            if ('boolean' == typeof obj.audio.enabled && obj.audio.enabled != prefs.audio.enabled)
                (prefs.audio.enabled = obj.audio.enabled, requiresUpdate = true);
        }

        if ('boolean' == typeof obj.notify && obj.notify != prefs.notify)
            (prefs.notify = obj.notify, requiresUpdate = true);

        return new Promise(function(resolve, reject) {
            if (requiresUpdate === true)
                app.prefs.set(prefs).then(resolve, reject);
            else {
                resolve();
            }
        })
    }
};

/**
 * Events
 */
app.events = {
    name: 'Events',

    set: function() {
        am.events.suscribe(window, 'newdata');
        am.events.suscribe(window, 'unitchanged');

        window.addEventListener('newdata', function(ev) {
            app.speed.update(ev.detail.coords.speed);
        });

        window.addEventListener('unitchanged', function() {
            app.speed.update();
        });
    }
}

/**
 * IDB Initializacion
 */
app.idb = new IDBHelper()
app.idb.name = 'IDBHelper'
app.idb.createStructure = function(a) {
    var b = [app.prefs.createIDBStruct(a), app.units.createIDBStruct(a)];
    Promise.all(b).then(function() {})
}