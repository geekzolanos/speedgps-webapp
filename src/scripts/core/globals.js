function Unit(alias, desc, fconv) {
    if ('string' != typeof alias) throw new TypeError('alias no es una cadena.');

    if (isNaN(fconv)) {
        fconv = 0;
    }

    this.alias = alias.toString();
    this.description = desc;
    this.fconv = fconv;
}

window.errStop = function(msg) {
    if (app.bootStatus != 0) {
        app.bootStatus = -1;
        app.wp.setActive(false);
        am.events.dispatchAll(new CustomEvent('apperror', { detail: msg }));
    }
}

var debug = {
    name: 'Debug',

    errMsgs: {
        watchPos: [
            'null',
            'Debes permitir el uso de los servicios de geolocalización para continuar. Habilítalos e intenta nuevamente.',
            'No se ha logrado obtener la ubicación del dispositivo. Intenta nuevamente en un espacio despejado.',
            'Se ha agotado el tiempo de espera para la respuesta. Intenta nuevamente en un espacio despejado.',
            'Esta aplicación no es compatible con su dispositivo. Para más información consulte en "http://geekzolanos.wordpress.com"'
        ],
        unidades: ['No hay unidades de conversión establecidas en la app. Para más información consulte en "http://geekzolanos.wordpress.com"']
    },

    gtBoot: function() {
        document.body.style.background = app.BACKGROUND_DEFAULT_COLOR;

        app.gauge.activity.js.setPhaseThree(function() {
            utils.setTransition(app.gauge.domNode, null);
            app.gauge.domNode.classList.add('bootSuccess');
        });

        am.startActivity(am.catalog.get('views', 'main'))
    },

    errPos: function(a) {
        errStop(this.errMsgs.watchPos[a.code]);
    }
};