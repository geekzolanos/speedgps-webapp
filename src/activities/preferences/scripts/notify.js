var p_notify = function() {
    this.prefs = {};

    this.load = function(slot) {
        var self = this,
            prefs = app.prefs.get('data'),
            btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child'),
            audioNode = slot.domNode.querySelector('#audio-enabled'),
            audioCheck = audioNode.querySelector('input[type="checkbox"]'),
            vibrationNode = slot.domNode.querySelector('#vibration-enabled'),
            vibrationCheck = vibrationNode.querySelector('input[type="checkbox"]'),
            vibrationTimeNode = slot.domNode.querySelector('#vibration-duration input[type="range"]'),
            backgroundNode = slot.domNode.querySelector('#notify-background'),
            backgroundCheck = backgroundNode.querySelector('input[type="checkbox"]');

        audioCheck.checked = prefs.audio.enabled;
        vibrationCheck.checked = prefs.vibration.enabled;
        vibrationTimeNode.value = parseInt(prefs.vibration.duration) / 1000;
        backgroundCheck.checked = prefs.notify;

        btnBack.addEventListener('click', function() { self.close() });

        audioNode.addEventListener('click', function() {
            audioCheck.checked = !audioCheck.checked;
        });

        vibrationNode.addEventListener('click', function() {
            vibrationCheck.checked = !vibrationCheck.checked;
        });

        audioCheck.addEventListener('change', function() {
            if (!self.prefs.audio) {
                self.prefs.audio = {}
            }

            self.prefs.audio.enabled = this.checked;
        });

        vibrationCheck.addEventListener('change', function() {
            if (!self.prefs.vibration) {
                self.prefs.vibration = {}
            }

            this.checked ? vibrationTimeNode.disabled = false : vibrationTimeNode.disabled = !0;
            self.prefs.vibration.enabled = this.checked;
        });

        vibrationTimeNode.addEventListener('change', function() {
            if (!self.prefs.vibration) {
                self.prefs.vibration = {}
            }

            self.prefs.vibration.duration = 1000 * this.value;
        });

        backgroundNode.addEventListener('click', function() {
            backgroundCheck.checked = !backgroundCheck.checked;
        });

        backgroundCheck.addEventListener('change', function() {
            self.prefs.notify = this.checked;
        })
    }

    this.updatePrefs = function() {
        var self = this;
        return new Promise(function(resolve) {
            var prefs = app.data.setPrefs(self.prefs);
            prefs.then(resolve);
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

am.constructors.p_notify = p_notify;