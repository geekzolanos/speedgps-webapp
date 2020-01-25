app.speed = {
    name: 'Speed',
    lastRawValue: 0,

    update: function(a) {
        'number' == typeof a && (this.lastRawValue = a);
        var ev = new CustomEvent('newspeed', { detail: this.calculate() })
        am.events.dispatchAll(ev);
    },

    calculate: function() {
        var selUni = app.units.getSelUni();
        var lastRaw = this.lastRawValue * selUni.fconv;

        return { rawValue: this.lastRawValue, finalValue: lastRaw.toFixed() }
    }
}