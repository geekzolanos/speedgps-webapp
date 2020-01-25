var thirdParty = function() {
    this.load = function(slot) {
        var btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child'),
            ref = utils.fetch(app.rootPath + 'THIRDPARTY');

        btnBack.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'about'), {
                animation: [null, 'current-bottom']
            });
        });

        ref.then(function(res) {
            return res.text()
        }).then(function(text) {
            slot.domNode.querySelector('#main textarea').value = text
        });
    }
};
am.constructors.thirdParty = thirdParty;