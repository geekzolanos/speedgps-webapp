var main = function() {
    this.load = function(slot) {
        var unitSelNode = slot.domNode.querySelector('#speed #unit select'),
            detailsNode = slot.domNode.querySelector('#details-main');

        if (app.IS_APP_STARTING) {
            utils.setTransition(detailsNode, 'bottom-current');
            app.IS_APP_STARTING = false;
        }

        document.body.style.background = '#f4f4f4';
        app.units.setNode(unitSelNode);
        this.setEvs(slot.domNode);
        this.setDataReceiver(slot);
        this.updateUnitSelector(slot.domNode);
    }

    this.setEvs = function(node) {
        var menuBtn = node.querySelector('section[role="region"] header > button'),
            lockNode = node.querySelector('section[role="region"] #drawer-lock'),
            btnAbout = node.querySelector('section[role="region"] header menu #about'),
            btnMore = node.querySelector('section[role="region"] .footer #btn-more'),
            btnDonate = node.querySelector('[role="drawer"] [data-type="list"] #donate'),
            btnPrefs = node.querySelector('[role="drawer"] [role="toolbar"] #prefs'),
            unitSelNode = node.querySelector('#speed #unit select');

        menuBtn.addEventListener('click', function() {
            node.querySelector('section[role="region"]').classList.toggle('draweropen');
        });

        lockNode.addEventListener('click', function() {
            node.querySelector('section[role="region"]').classList.remove('draweropen');
        });

        btnDonate.addEventListener('click', function() {
            am.startActivity(am.catalog.get('extras', 'donate'), {
                animation: ['bottom-current']
            }).then(function() { app.gauge.hide(true) });
        });

        btnPrefs.addEventListener('click', function() {
            am.startActivity(am.catalog.get('preferences', 'p_main'), {
                animation: ['right-current', 'current-left']
            }).then(function() { app.gauge.hide(true) });
        });

        btnAbout.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'about'), {
                animation: ['right-current', 'current-left']
            }).then(function() { app.gauge.hide(true) });
        });

        btnMore.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'moreInfo'), {
                animation: ['right-current', 'current-left']
            }).then(function() { app.gauge.hide(true) });
        });

        unitSelNode.addEventListener('change', function() {
            app.units.setSelUni(this.value);
        });
    }

    this.setDataReceiver = function(slot) {
        const node = slot.domNode;

        am.events.suscribe(slot, 'newdata');
        node.addEventListener('newdata', ev => this.setNodeData(ev, node));

        am.events.suscribe(slot, 'newspeed');
        node.addEventListener('newspeed', this.updateSpeed);

        am.events.suscribe(slot, 'unitchanged');
        node.addEventListener('unitchanged', () => this.updateUnitSelector(node));
    }

    this.setNodeData = function(ev, node) {
        var latNode = node.querySelector('#data #latitude .value'),
            longNode = node.querySelector('#data #longitude .value'),
            altNode = node.querySelector('#data #altitude .value'),
            accNode = node.querySelector('.footer #details #accuracy .value'),
            powerNode = node.querySelector('.footer #details #power .value'),
            tsNode = node.querySelector('.footer #lastReceived'),
            coords = ev.detail.coords,
            accuracy = Math.round(coords.accuracy);

        accNode.innerHTML = accuracy + ' m';
        altNode.innerHTML = Math.round(coords.altitude || 0) + ' Mts';
        this.updateLatLong(latNode, longNode, coords);
        this.setTimeReceiver(tsNode, ev.detail.timestamp);
        this.updatePowerNode(powerNode, accuracy);
    }

    this.updateLatLong = function(longNode, latNode, coords) {
        var geopoint = new GeoPoint(coords.latitude, coords.longitude);
        longNode.innerHTML = geopoint.getLonDeg();
        latNode.innerHTML = geopoint.getLatDeg();
    }

    this.updateSpeed = function(ev) {
        var speedNode = this.querySelector('#speed #speedValue'),
            unitNode = this.querySelector('#speed #unit p'),
            curSpeed = parseInt(speedNode.innerHTML),
            newSpeed = ev.detail.finalValue;

        var cb = function() {
            if (newSpeed > curSpeed) {
                speedNode.innerHTML = curSpeed += 1
            } else {
                speedNode.innerHTML = curSpeed -= 1;

                if (speedNode.innerHTML.length < 3) {
                    speedNode.style.fontSize = null;
                    unitNode.style.display = 'block';
                } else if (speedNode.innerHTML.length == 3) {
                    speedNode.style.fontSize = '3.2rem';
                    unitNode.style.display = 'block';
                } else {
                    speedNode.style.fontSize = '3.2rem';
                    unitNode.style.display = 'none';
                }
            }
        }

        var ret = setInterval(function() {
            newSpeed != curSpeed ? cb() : clearInterval(ret);
        }, 20);
    }

    this.updatePowerNode = function(node, val) {
        switch (true) {
            case val < 33:
                node.innerHTML = 'Alta';
                node.style.color = '#0e0';
                break;

            case val < 66:
                node.innerHTML = 'Media';
                node.style.color = '#ee0';
                break;

            case val < 100 || val >= 100:
                node.innerHTML = 'Baja';
                node.style.color = '#e00';
                break;
        }
    }

    this.updateUnitSelector = function(node) {
        var uniSelNode = node.querySelector('#speed #unitSelected'),
            curUnit = app.units.getSelUni();

        utils.opacityTransition(uniSelNode, curUnit.alias);
    }

    this.setTimeReceiver = function(node, timestamp) {
        var date = new Date(timestamp);
        node.innerHTML = 'Ultima información recibida: ' + date.toLocaleString();
    }

    this.unload = function(slot) {
        slot.domNode.removeEventListener('newdata', ev => this.setNodeData(ev, node));
        slot.domNode.removeEventListener('newspeed', this.updateSpeed);
    }
};

am.constructors.main = main;