var moreInfo = function() {
    this.load = function(slot) {
        this.setEvs(slot.domNode);
        this.setDataReceiver(slot);
    }

    this.setEvs = function(domNode) {
        domNode.querySelector('section[role="region"] > header > button:first-child').addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'main'), {
                animation: ['left-current', 'current-right']
            }).then(function() { app.gauge.show() });
        });
    }

    this.setDataReceiver = function(slot) {
        am.events.suscribe(slot, 'newdata');
        slot.domNode.addEventListener('newdata', this.printData);
    }

    this.printData = function(ev) {
        var decimals = 5,
            lrNode = this.querySelector('#lastReceived'),
            latNode = this.querySelector('#latitude .value'),
            longNode = this.querySelector('#longitude .value'),
            altNode = this.querySelector('#altitude .value'),
            accNode = this.querySelector('#accuracy .value'),
            altAccNode = this.querySelector('#alt-accuracy .value'),
            speedNode = this.querySelector('#speed .value'),
            coords = ev.detail.coords,
            timestamp = new Date(ev.detail.timestamp);

        lrNode.innerHTML = 'Últimos datos recibidos el: ' + timestamp;
        latNode.innerHTML = (coords.latitude || 0).toFixed(decimals);
        longNode.innerHTML = (coords.longitude || 0).toFixed(decimals);
        accNode.innerHTML = (coords.accuracy || 0).toFixed(2) + ' Mts';
        speedNode.innerHTML = (coords.speed || 0).toFixed() + ' m/s';
        altNode.innerHTML = (coords.altitude || 0).toFixed() + ' Mts';
        altAccNode.innerHTML = (coords.altitudeAccuracy || 0).toFixed() + ' Mts';
    }

    this.unload = function(slot) {
        slot.domNode.removeEventListener('newdata', this.printData);
    }
};

am.constructors.moreInfo = moreInfo;