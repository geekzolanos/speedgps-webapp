var about = function() {
    this.load = function(slot) {
        var btnBack = slot.domNode.querySelector('section[role="region"] > header > button:first-child'),
            btnThird = slot.domNode.querySelector('a#third-party'),
            headerNode = slot.domNode.querySelector('h1'),
            versionNode = slot.domNode.querySelector('p#version'),
            descNode = slot.domNode.querySelector('p#description'),
            websiteNode = slot.domNode.querySelector('a#website'),
            copyrightNode = slot.domNode.querySelector('p#copyright');

        btnBack.addEventListener('click', function() {
            am.startActivity(am.catalog.get('views', 'main'), {
                animation: ['left-current', 'current-right']
            }).then(function() { app.gauge.show() });
        });

        btnThird.addEventListener('click', function() {
            am.startActivity(am.catalog.get('extras', 'thirdParty'), {
                animation: ['bottom-current']
            });
        });

        headerNode.innerHTML = 'SpeedGPS';
        versionNode.innerHTML = 'Version ' + app.appVer;
        descNode.innerHTML = 'Una aplicación diseñada para calcular la velocidad a la que se desplaza el usuario por medio del uso de técnicas varias de Geolocalización.';
        websiteNode.href = 'http://geekzolanos.wordpress.com';

        var year = (new Date).getFullYear(),
            curText = copyrightNode.innerHTML;
        copyrightNode.innerHTML = curText.replace('©', '©' + year);
    }
}

am.constructors.about = about;