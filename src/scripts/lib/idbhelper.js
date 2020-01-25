(function() {
    if (!window.indexedDB) {
        window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    }

    window.IDBHelper = function() {
        var idbName = '';
        var connection = null;
        this.createStructure = null;

        this.connect = function(name, version) {
            var self = this;
            if ('string' != typeof name) throw new TypeError('name no es una cadena.');

            if ('number' != typeof version)
                version = 1;

            return new Promise(function(resolve, reject) {
                var db = window.indexedDB.open(name, version);

                db.onerror = reject;
                db.onsuccess = function(ev) {
                    connection = ev.target.result;
                    idbName = name;
                    resolve();
                }

                if ('function' == typeof self.createStructure)
                    db.onupgradeneeded = self.createStructure;
            });
        }

        var _getObjectStore = function(osName, readwrite) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');
            var state = readwrite ? 'readwrite' : 'readonly';

            if (connection) {
                return connection.transaction([osName], state)
                    .objectStore(osName);
            }

            return false;
        }

        var _addObject = function(osName, obj) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');
            if (!obj) throw new ReferenceError('obj no esta definido.');

            return new Promise(function(resolve, reject) {
                var os = _getObjectStore(osName, true),
                    tr = os.add(obj);

                tr.onsuccess = resolve;
                tr.onerror = reject;
            });
        }

        var _putObject = function(osName, obj) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');
            if (!obj) throw new ReferenceError('obj no esta definido.');

            return new Promise(function(resolve, reject) {
                var os = _getObjectStore(osName, true),
                    tr = os.put(obj);

                tr.onsuccess = resolve;
                tr.onerror = reject;
            });
        }

        var _getObject = function(osName, key, idx) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');
            if (key) throw new ReferenceError('key no esta definido.');

            return new Promise(function(resolve, reject) {
                var os = _getObjectStore(osName),
                    tr = idx ? os.index(idx).get(key) : os.get(key);

                tr.onsuccess = resolve;
                tr.onerror = reject;
            });
        }

        var _getObjects = function(osName, idx, cursors) {
            var retArr = [];
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');

            return new Promise(function(resolve, reject) {
                var os = _getObjectStore(osName);
                idx && (os = os.index(idx));
                var tr = cursors ? os.openCursor(cursors[0], cursors[1]) : os.openCursor();

                tr.onsuccess = function(ev) {
                    var it = ev.target.result;
                    if (it) {
                        retArr.push(it.value);
                        it.continue();
                    } else {
                        resolve(retArr);
                    }
                }

                tr.onerror = reject;
            });
        }

        var _removeObject = function(osName, key, idx) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');
            if (!key) throw new ReferenceError('key no esta definido.');

            return new Promise(function(resolve) {
                var os = _getObjectStore(osName, true),
                    tr = idx ? os.index(idx).delete(key) : os.delete(key);

                tr.onsuccess = resolve;
            });
        }

        var _removeObjects = function(osName, idx, cursors) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');

            return new Promise(function(resolve, reject) {
                var tr = _getObjects(osName, idx, cursors),
                    retArr = [];

                tr.then(function(res) {
                    res.forEach(function(it) {
                        retArr.push(_removeObject(osName, it.keyPath));
                    });

                    Promise.all(retArr).then(resolve, reject);
                });
            });
        }

        var _clearObjectStore = function(osName) {
            if ('string' != typeof osName) throw new TypeError('osName no es una cadena.');

            var os = _getObjectStore(osName, true);
            return new Promise(function(resolve) {
                var tr = os.clear();
                tr.onsuccess = resolve;
            });
        }

        this.getObjectStore = _getObjectStore;
        this.addObject = _addObject;
        this.putObject = _putObject;
        this.getObject = _getObject;
        this.getObjects = _getObjects;
        this.removeObject = _removeObject;
        this.removeObjects = _removeObjects;
        this.clearObjectStore = _clearObjectStore;
    }
})();