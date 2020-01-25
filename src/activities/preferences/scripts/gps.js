var p_gps = function() {
    this.prefs = {}

    this.load = function(slot) {
        var self = this,
            prefs = app.prefs.get('wp_prefs'),
            btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child'),
            timeout = slot.domNode.querySelector('#main ul #timeout select'),
            maximumAge = slot.domNode.querySelector('#main ul #maximumAge select');

        timeout.selectedIndex = timeout.querySelector('option[value="' + prefs.timeout.toString() + '"]').index;
        this.updateFakeSel(timeout);
        maximumAge.selectedIndex = maximumAge.querySelector('option[value="' + prefs.maximumAge.toString() + '"]').index;
        this.updateFakeSel(maximumAge);

        timeout.addEventListener('change', function() {
            self.updateFakeSel(this);
            self.prefs.timeout = parseInt(this.value);
        });

        maximumAge.addEventListener('change', function() {
            self.updateFakeSel(this);
            self.prefs.maximumAge = parseInt(this.value);
        });

        btnBack.addEventListener('click', function() { self.close() });
    }

    this.updateFakeSel = function(node) {
        var legend = node.parentNode.querySelector('fieldset > legend');
        legend.innerHTML = node.selectedOptions[0].innerHTML;
    }

    this.updatePrefs = function() {
        var self = this;
        return new Promise(function(resolve) {
            var ret = app.wp.setPrefs(self.prefs);
            ret.then(resolve);
        });
    }

    this.close = function() {
        this.updatePrefs().then(function() {
            am.startActivity(am.catalog.get('preferences', 'p_main'), {
                animation: ['left-current', 'current-right']
            });
        });
    }
}

am.constructors.p_gps = p_gps;