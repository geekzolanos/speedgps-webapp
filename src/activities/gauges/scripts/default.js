var defaultGauge = function() {
    this.components = {}

    this.load = function(slot) {
        var node = slot.domNode;

        this.components = {
            pin: node.querySelector('#pin-gauge'),
            fakePin: node.querySelector('#fake-pin-gauge'),
            waves: node.querySelector('#waves')
        }

        am.events.suscribe(slot, 'newspeed');
        node.addEventListener('newspeed', ev => this.trackSpeed(ev));
    }

    this.trackSpeed = function(ev) {
        var val = ev.detail.rawValue
        switch (true) {
            case 0 === val:
                this.setPinAngle(90);
                break;
            case 6 >= val:
                this.setPinAngle(105);
                break;
            case 12 >= val:
                this.setPinAngle(120);
                break;
            case 18 >= val:
                this.setPinAngle(135);
                break;
            case 24 >= val:
                this.setPinAngle(150);
                break;
            case 30 >= val:
                this.setPinAngle(165);
                break;
            case 36 >= val:
                this.setPinAngle(180);
                break;
            case 42 >= val:
                this.setPinAngle(195);
                break;
            case 48 >= val:
                this.setPinAngle(210);
                break;
            case 54 >= val:
                this.setPinAngle(230);
                break;
            case 60 >= val:
                this.setPinAngle(260);
                break;
            case val > 64:
                this.setPinAngle(270)
        }
    }

    this.setPhaseOne = function(cb) {
        var self = this;
        setTimeout(function() {
            self.components.waves.classList.add('anim-waveInfinity');
            cb && cb();
        }, 450);
    }

    this.setPhaseTwo = function(cb) {
        var self = this;
        this.components.fakePin.style.transform = 'translate(-50%, -50%) rotate(80deg)';
        this.components.waves.classList.remove('anim-waveInfinity');
        this.components.waves.classList.add('anim-waveStatic');

        setTimeout(function() {
            self.components.fakePin.classList.add('animLogoTick');
            cb && cb();
        }, 500);
    }

    this.setPhaseThree = function(cb) {
        this.components.fakePin.classList.remove('animLogoTick');
        this.components.waves.classList.remove('anim-waveInfinity');
        this.components.waves.classList.remove('anim-waveStatic');

        utils.setTransition(app.gauge.domNode, null);
        this.setPinAngle(90);
        app.gauge.domNode.style.opacity = 0;

        setTimeout(function() {
            cb && cb();
            app.gauge.domNode.style.opacity = 1
        }, 1000);
    }

    this.setPinAngle = function(val) {
        this.components.pin.style.transform = 'translate(-50%, -50%) rotate(' + val + 'deg)';
    }

    this.stopAnimations = function() {
        var self = this;

        this.components.fakePin.classList.remove('animLogoTick');
        this.components.waves.classList.remove('anim-waveInfinity');
        this.components.waves.classList.add('anim-waveStatic');
        utils.setTransition(app.gauge.domNode, null);

        setTimeout(function() {
            self.components.waves.classList.remove('anim-waveInfinity')
        }, 500);
    }

    this.unload = function(slot) {
        slot.domNode.removeEventListener('newspeed', ev => this.trackSpeed(ev));
    }
};

am.constructors.defaultGauge = defaultGauge;