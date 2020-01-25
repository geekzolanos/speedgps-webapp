var donate = function() {
    this.load = function(slot) {
        var btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child');

        btnBack.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'main'), {
                animation: [null, 'current-bottom']
            }).then(function() {
                app.gauge.show();
            });
        });
    }
}

am.constructors.donate = donate;