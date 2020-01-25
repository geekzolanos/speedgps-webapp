app.units = {
    name: 'Units',
    catalog: [],
    selectedID: null,

    prepare: function() {
        var self = this;
        this.catalog.forEach(function(item, idx) {
            item.constructor != Unit && self.catalog.splice(idx, 1)
        });
        return this.catalog.length > 0;
    },

    setNode: function(domNode, tag) {
        var _tag = tag || 'option';

        if (!domNode) throw new ReferenceError('domNode no esta definido.');
        if (!('parentNode' in domNode)) throw new TypeError('domNode no es un nodo DOM valido');

        this.catalog.forEach(function(item, idx) {
            var node = document.createElement(_tag);
            node.innerHTML = item.description + ' (' + item.alias + ')';
            node.value = idx;
            domNode.appendChild(node);
        });

        domNode.value = this.selectedID;
    },

    getSelUni: function() {
        return this.catalog[this.selectedID] || false;
    },

    setSelUni: function(val, b) {
        if (val = parseInt(val), isNaN(val)) throw new TypeError('val no es un numero.');

        if (this.selectedID != val && this.catalog[val]) {
            this.selectedID = val;
            if (!b) am.events.dispatchAll(new Event('unitchanged'));
        }
    },

    startModule: function() {
        var self = this,
            units = app.prefs.get('units');

        return new Promise(function(resolve, reject) {
            app.idb.getObjects('units').then(function(d) {
                d.forEach(function(item) {
                    self.catalog.push(new Unit(item.alias, item.description, item.fconv));
                });

                self.prepare();

                try {
                    self.setSelUni(units.default, true)
                } catch (err) {}

                resolve();
            });
        });
    },

    createIDBStruct: function(a) {
        var b = a.target.result,
            c = a.target.transaction;

        return new Promise(function(resolve) {
            b.createObjectStore('units', { keyPath: 'alias' });
            var store = c.objectStore('units')

            for (var i = app.DEFAULT_UNITS.length - 1; i >= 0; i--) {
                store.add(app.DEFAULT_UNITS[i]);
            }

            resolve();
        });
    },

    setPrefs: function(obj) {
        var b = false,
            units = app.prefs.get('units');

        if (!obj) throw new ReferenceError('obj no esta definido.');

        if ('number' == typeof obj.default && obj.default != units.default) {
            units.default = obj.default;
            b = true;
        }

        return new Promise(function(resolve, reject) {
            !!b ? app.prefs.set(units).then(resolve, reject) : resolve();
        })
    },

    remove: function(idx) {
        if ('number' != typeof idx) throw new TypeError('idx no es un numero.');

        var self = this,
            item = this.catalog[idx],
            units = app.prefs.get('units');
        islast = this.catalog.length - 1 == idx,
            isSelected = this.selectedID == idx,
            isDefault = units.default == idx;

        if ('object' != typeof item) throw new ReferenceError('El indice no corresponde a ninguna unidad del catalogo.');

        return Promise(function(resolve, reject) {
            if (this.catalog.length <= 1) return reject();

            app.idb.removeObject('units', item.alias).then(function() {
                self.catalog.splice(idx, 1);

                if (islast && isSelected)
                    self.setSelUni(idx - 1);

                if (islast && isDefault)
                    self.setPrefs({ default: idx - 1 }).then(resolve);

                resolve();
            }, reject);
        });
    },

    add: function(unit) {
        var self = this;

        if (unit.constructor != Unit) throw new TypeError('unit no es una Unidad.');

        return new Promise(function(resolve, reject) {
            var unitId = self.getID(unit.alias),
                op = unitId ? app.idb.putObject : app.idb.addObject;

            op('units', unit).then(function() {
                unitId ? (self.catalog[unitId] = unit) : self.catalog.push(unit);
                resolve();
            }, reject);
        });
    },

    getID: function(alias) {
        if ('string' != typeof alias) throw new TypeError('alias no es una cadena.');

        alias = alias.toLowerCase();

        for (var i = 0; i < this.catalog.length; i++)
            if (alias == this.catalog[i].alias.toLowerCase()) return i;

        return false;
    }
}