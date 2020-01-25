app.notify = {
    name: 'Notifications',

    requestPermission: function() {
        if (app.isBrowser && 'Notification' in window) {
            Notification.requestPermission();
        }
    },

    send: function(options) {
        var notification;
        if (!options) throw new ReferenceError('options no esta definida.');
        options.icon = navigator.mozApps ? 'app://gk.speedgps.com' + app.appIcon : app.appIcon;

        if (app.isBrowser && 'granted' == Notification.permission) {
            notification = new Notification(app.appName, options);
            notification.addEventListener('click', this.clicked);
            'show' in notification && notification.show();
        }
    },

    clicked: function(e) {
        if (!e) throw new ReferenceError('e no esta definida.');

        if ('mozApps' in navigator) {
            navigator.mozApps.getSelf().onsuccess = function(a) {
                var b = a.target.result;
                b.launch();
            };
        }

        e.target && e.target.close();
    }
}