app.boot = {
    name: 'Boot',

    start: function() {
        var self = this;
        this.startModules().then(function() {
            app.notify.requestPermission();
            am.catalog.populate().then(self.setActivities);
        })
    },

    startModules: function() {
        return new Promise(function(resolve, reject) {
            app.prefs.startModule().then(function() {
                var c = [app.units.startModule()];
                Promise.all(c).then(resolve, reject);
            })
        })
    },

    setActivities: function() {
        app.boot; //TODO

        am.createSlots(2);
        app.gauge = am.slot.create(app.DEFAULT_SLOT_GAUGE_PARAMS);
        app.gauge.loadActivity(am.catalog.get('gauges', 'defaultGauge'));

        setTimeout(function() {
            utils.setTransition(app.gauge.domNode, 'current-far')
        }, 1000), setTimeout(function() {
            am.startActivity(am.catalog.get('base', 'boot'))
        }, 1300)
    }
}