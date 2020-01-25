var boot = function() {
    this.name = 'Boot';
    this.phases = [];
    this.domNode = null;

    this.checkBoot = function() {
        var self = this;

        var ref = setInterval(function() {
            switch (app.bootStatus) {
                case 1:
                    if (!self.phases[app.bootStatus]) {
                        clearInterval(ref);
                        self.phaseTwo();
                    }
                    break;

                case 0:
                    if (!self.phases[app.bootStatus]) {
                        clearInterval(ref);
                        self.phaseThree();
                    }
                    break;
            }
        }, 10);
    }

    this.load = function(slot) {
        this.domNode = slot.domNode;
        am.events.suscribe(slot, 'apperror');
        this.domNode.addEventListener('apperror', this.cancelBoot);
        this.phaseOne();
    }

    this.phaseOne = function() {
        var self = this,
            dnode = this.domNode.querySelector('#details'),
            dbNode = this.domNode.querySelector('#details-boot');

        document.body.style.background = '#FF9100';
        dbNode.classList.add('visible');
        app.events.set();
        app.wp.setActive(true);
        utils.opacityTransition(dnode, 'Buscando señal de GPS...');

        app.gauge.activity.js.setPhaseOne(function() {
            self.phases[2] = true;
            self.checkBoot();
        });
    }

    this.phaseTwo = function() {
        var self = this,
            dNode = this.domNode.querySelector('#details');

        utils.opacityTransition(dNode, 'Mejorando Precisión');

        app.gauge.activity.js.setPhaseTwo(function() {
            self.phases[1] = true;
            self.checkBoot();
        });
    }

    this.phaseThree = function() {
        var dbNode = this.domNode.querySelector('#details-boot');

        dbNode.classList.remove('visible');

        app.gauge.activity.js.setPhaseThree(function() {
            app.gauge.domNode.classList.add('bootSuccess');
        });

        setTimeout(function() {
            am.startActivity(am.catalog.get('views', 'main'));
        }, 700);
    }

    this.cancelBoot = function(ev) {
        var detail = ev.detail,
            dNode = this.querySelector('#details');

        utils.opacityTransition(dNode, detail);
        this.querySelector('#details-boot').classList.add('ice');
        document.body.style.background = '#e2443a';
        app.gauge.activity.js.stopAnimations();
        utils.setTransition(app.gauge.domNode, 'far-current');
    }

    this.unload = function(slot) {
        slot.domNode.removeEventListener('apperror', this.cancelBoot);
    }
};

am.constructors.boot = boot;