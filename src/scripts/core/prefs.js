app.prefs = {
    name: 'Prefs',
    catalog: {},

    startModule: function() {
        var self = this;

        return new Promise(function(resolve) {
            app.idb.getObjects('prefs').then(function(prefs) {
                prefs.forEach(function(pref) {
                    self.catalog[pref.name] = pref
                });

                resolve();
            })
        })
    },

    createIDBStruct: function(a) {
        var b = a.target.result,
            tr = a.target.transaction;

        return new Promise(function(resolve) {
            b.createObjectStore('prefs', {
                keyPath: 'name'
            });
            var store = tr.objectStore('prefs');
            for (var i = app.DEFAULT_PREFS.length - 1; i >= 0; i--) {
                store.add(app.DEFAULT_PREFS[i]);
            }
            resolve();
        });
    },

    set: function(obj) {
        var self = this;
        if (!obj) throw new ReferenceError('Obj no esta definido.');
        if (!('name' in obj)) throw new ReferenceError('Obj.name no esta definido.');

        return new Promise(function(resolve, reject) {
            var req;
            if (self.includes(obj.name)) {
                self.catalog[obj.name] = obj;
                req = app.idb.putObject('prefs', obj);
            } else {
                req = app.idb.addObject('prefs', obj)
            }

            req.then(resolve, reject);
        });
    },

    get: function(name) {
        if ('string' != typeof name) throw new TypeError('name no es una cadena.');
        return this.catalog[name] || false;
    },

    includes: function(name) {
        if ('string' != typeof name) throw new TypeError('name no es una cadena.');
        return !!this.catalog[name];
    }
}