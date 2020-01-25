var p_main = function() {
    this.load = function(slot) {
        var btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child'),
            gps = slot.domNode.querySelector('#btn-gps'),
            notify = slot.domNode.querySelector('#btn-notify'),
            units = slot.domNode.querySelector('#btn-units');

        btnBack.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'main'), {
                animation: ['left-current', 'current-right']
            }).then(function() {
                app.gauge.show();
            });
        });

        gps.addEventListener('click', function() {
            am.startActivity(am.catalog.get('preferences', 'p_gps'), {
                animation: ['right-current', 'current-left']
            });
        });

        notify.addEventListener('click', function() {
            am.startActivity(am.catalog.get('preferences', 'p_notify'), {
                animation: ['right-current', 'current-left']
            });
        });

        units.addEventListener('click', function() {
            am.startActivity(am.catalog.get('preferences', 'p_units'), {
                animation: ['right-current', 'current-left']
            });
        });
    }
}

am.constructors.p_main = p_main;