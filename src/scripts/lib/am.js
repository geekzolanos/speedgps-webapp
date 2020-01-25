function Activity(category, activity) {
    var nodeCat, nodeAct;
    if (!category) throw new TypeError('La categoria no esta definida.');
    if (!activity) throw new TypeError('a actividad no esta definida.');

    try {
        nodeCat = am.catalog.parsedTree[category]
        nodeAct = nodeCat.activities[activity]
        if (!nodeAct) throw new Error('NO_ACT');
    } catch (_e) {
        throw new ReferenceError('La actividad "' + category + '/' + activity + '" no existe.');
    }

    this.name = activity;
    this.title = nodeAct.title;
    this.path = app.rootPath + 'activities/' + category + '/';
    this.filename = activity + '.html';
}

function Slot(opts) {
    opts = am.slot.checkOptions(opts);

    this.id = am.slot.assignID(opts.id);
    this.locked = opts.locked;
    this.size = opts.size;
    this.position = opts.position;
    this.lazyLoaded = false;
    this.activity = null;

    this.updateConfig = function() {
        var self = this,
            node = self.domNode;

        node.setAttribute('data-id', self.id);
        self.locked ? node.setAttribute('am-lock', 'true') : node.removeAttribute('am-lock');
        self.size && utils.setSize(node, self.size);
        self.position && utils.setAbsolutePos(node, self.position);
    }

    this.loadActivity = function(activity, opts) {
        var self = this,
            node = this.domNode;

        opts || (opts = {});
        if (!(activity instanceof Activity)) throw new TypeError('El objeto no es una actividad.');

        return new Promise(function(resolve, reject) {
            self.clear();
            am.lazyLoader.load(activity, self, opts.args).then(function() {
                node.setAttribute('am-busy', true);
                opts.animation ? utils.setTransition(node, opts.animation) : utils.setTransition(node);
                resolve();
            });
        })
    }

    this.clear = function(opts) {
        var node = this.domNode,
            self = this;
        opts || (opts = {});
        if (this.lazyLoaded) {
            opts.animation ? utils.setTransition(node, opts.animation) : utils.setTransition(node);
            return setTimeout(function() {
                am.lazyLoader.unload(self);
                node.removeAttribute('am-busy');
            }, 500);
        }

        return false;
    }

    this.remove = function() {
        var node = this.domNode;
        this.clear();
        node.parentNode.removeChild(node);
    }

    this.hide = function(vs) {
        var node = this.domNode;
        vs && (node.style.visibility = 'hidden');
        node.style.opacity = 0;
    }

    this.show = function() {
        var node = this.domNode;

        if ('hidden' == node.style.visibility)
            node.style.visibility = null;

        node.style.opacity = null;
    }
}

window.AM_TLOCK = !1;

var am = {
    constructors: {},

    createSlots: function(val) {
        if (isNaN(val) || 0 >= val) throw new TypeError('El valor no es un numero.');

        for (var i = 0; val > i; i++)
            am.slot.create({});
    },

    startActivity: function(activity, opts) {
        if (!(activity instanceof Activity)) throw new TypeError('El objeto no es una Actividad.');
        if (AM_TLOCK === !0) return void console.warn('AM -> Se ha llamado muchas veces consecutivas a cambio de actividad. Ignorando.');

        AM_TLOCK = !0;

        var self = this,
            busyUnlockedSel = 'div.slot[am-busy]:not([am-lock])',
            availableSel = 'div.slot:not([am-busy]):not([am-lock])';

        opts || (opts = {});

        return new Promise(function(resolve, reject) {
            var busyUnlockedSlot = document.querySelector(busyUnlockedSel);
            var availableSlot = document.querySelector(availableSel);
            busyUnlockedSlot && (busyUnlockedSlot = self.slot.getByNode(busyUnlockedSlot));
            availableSlot && (availableSlot = self.slot.getByNode(availableSlot));

            if (!availableSlot) {
                AM_TLOCK = !1;
                reject('No hay slots disponibles para dibujar la actividad.');
            }

            var op = availableSlot.loadActivity(activity, {
                animation: opts.animation ? opts.animation[0] : null,
                args: opts.arguments ? opts.arguments : null
            });

            if (busyUnlockedSlot) {
                op.then(function() {
                    busyUnlockedSlot.clear({
                        animation: opts.animation ? opts.animation[1] : null
                    });
                    AM_TLOCK = !1;
                    return resolve();
                });
            }
            AM_TLOCK = !1;
            resolve();
        });
    }
};

am.catalog = {
    parsedTree: {},

    populate: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
            var catPath = app.rootPath + 'activities/activities.json';

            utils.fetch(catPath)
                .then(function(res) {
                    return res.json();
                }, reject)
                .then(function(data) {
                    self.parsedTree = data;
                    self.parsedTree.isParsed = true;
                    resolve();
                }, reject);
        });
    },

    get: function(category, activity) {
        if (!category) throw new TypeError('La categoria no esta definida.');
        if (!activity) throw new TypeError('a actividad no esta definida.');
        if (!this.parsedTree.isParsed) throw new Error('No se han leido los datos del catalogo.');
        return new Activity(category, activity);
    }
}

am.events = {
    catalog: {},

    suscribe: function(slot, ev) {
        if (!ev) throw new TypeError('Event no esta definido.');

        this.catalog[ev] || (this.catalog[ev] = []);

        if (!(slot instanceof Window)) {
            if (!slot.activity) throw new ReferenceError('El Slot no esta asociado a ninguna actividad.');
            slot.activity.events || (slot.activity.events = []);
            slot.activity.events.push(ev);
        }

        if (!this.catalog[ev].includes(slot))
            this.catalog[ev].push(slot);
    },

    dispatchAll: function(ev) {
        if (!(ev instanceof Event || ev instanceof CustomEvent)) throw new TypeError('El objeto no es un Evento.');

        if (this.catalog[ev.type]) this.makeHygiene(ev.type);

        this.catalog[ev.type].forEach(function(b) {
            (b == window) ? window.dispatchEvent(ev): b.domNode.dispatchEvent(ev);
        });
    },

    makeHygiene: function(ev) {
        if (!ev) throw new TypeError('Event no esta definido.');

        var catEv = this.catalog[ev],
            ret = true;

        catEv.forEach(function(item, idx) {
            if (!(item instanceof Window)) {
                var ret = item.activity && item.activity.events && item.activity.events.includes(ev);
                if (!ret) catEv.splice(idx, 1);
            }
        });
    }
}

am.lazyLoader = {
    load: function(activity, slot, c) {
        var path, self = this;
        var node = slot.domNode;

        if (!(activity instanceof Activity)) throw new TypeError('El objeto no es una Actividad');
        if (!('innerHTML' in node)) throw new TypeError('El nodo DOM no es correcto.');

        return new Promise(function(resolve, reject) {
            slot.lazyLoaded === true && reject();
            path = activity.path + activity.filename;

            utils.fetch(path)
                .then(function(res) {
                    return res.text();
                }, reject)
                .then(function(data) {
                    node.innerHTML = data;
                    slot.activity = activity;
                    self.loadResources(slot).then(function() {
                        self.lazyRunner(slot, c);
                        resolve();
                    });
                });
        })
    },

    loadResources: function(slot) {
        return Promise.all([this.loadJS(slot), this.loadCSS(slot)]);
    },

    waitForScript: function(scriptNode) {
        if (!(scriptNode instanceof HTMLScriptElement)) throw new TypeError('El objeto no representa un Script');
        return new Promise(function(resolve) {
            scriptNode.addEventListener('load', resolve);
        });
    },

    loadJS: function(slot) {
        var node = slot.domNode;

        if (!('innerHTML' in node)) throw new TypeError('El nodo DOM no es correcto.');
        var self = this;

        return new Promise(function(resolve) {
            var stack = [],
                path = slot.activity.path + 'scripts/',
                meta = node.querySelectorAll('meta[name=\'activityScript\']');

            for (var i = meta.length - 1; i >= 0; i--) {
                var filename = meta[i],
                    scriptNode = document.createElement('script');

                scriptNode.setAttribute('slot-id', slot.id);
                scriptNode.src = path + filename.content;
                scriptNode.async = false;
                stack.push(self.waitForScript(scriptNode));
                document.head.appendChild(scriptNode);
                filename.parentNode.removeChild(filename);
            }

            Promise.all(stack).then(resolve);
        });
    },

    loadCSS: function(slot) {
        var node = slot.domNode;
        if (!('innerHTML' in node)) throw new TypeError('El nodo DOM no es correcto.');

        return new Promise(function(resolve) {
            var path = slot.activity.path + 'style/',
                meta = node.querySelectorAll('meta[name=\'activityStyle\']');

            for (var i = meta.length - 1; i >= 0; i--) {
                var filename = meta[i],
                    styleNode = document.createElement('link');

                styleNode.setAttribute('slot-id', slot.id);
                styleNode.rel = 'stylesheet';
                styleNode.type = 'text/css';
                styleNode.href = path + filename.content;
                document.head.appendChild(styleNode);
                filename.parentNode.removeChild(filename);
            }

            resolve();
        })
    },

    lazyRunner: function(slot, params) {
        var node = slot.domNode;
        if (!('innerHTML' in node)) throw new TypeError('El nodo DOM no es correcto.');

        var activity = slot.activity,
            factory = am.constructors[activity.name];

        node.setAttribute('data-activity', activity.name);

        if ('function' == typeof factory) {
            activity.js = new factory();

            if ('load' in activity.js) {
                params || (params = []);
                params.splice(0, 0, slot);
                activity.js.load.apply(activity.js, params);
            }
        }

        slot.lazyLoaded = true;
    },

    unload: function(slot, args) {
        var node = slot.domNode;
        if (!('innerHTML' in node)) throw new TypeError('El nodo DOM no es correcto.');

        var scriptNodes, styleNodes, activity = slot.activity;
        if (slot.lazyLoaded) {
            if ('unload' in activity.js) {
                Array.isArray(args) || (args = []);
                args.splice(0, 1, slot);
                activity.js.unload.apply(activity.js, args);
            }

            slot.activity = null;
            slot.lazyLoaded = false;
            node.removeAttribute('data-activity');
            node.innerHTML = '';

            scriptNodes = document.head.querySelectorAll('script[slot-id="' + slot.id + '"]');
            styleNodes = document.head.querySelectorAll('link[slot-id="' + slot.id + '"]');

            Array.prototype.forEach.call(scriptNodes, function(i) {
                document.head.removeChild(i);
            }), void Array.prototype.forEach.call(styleNodes, function(i) {
                document.head.removeChild(i);
            });
        }

        return false;
    }

}

am.slot = {
    lastID: -1,
    catalog: [],

    create: function(params) {
        var slot = new Slot(params),
            node = this.setNode(slot);

        document.body.appendChild(node);
        slot.updateConfig();

        return slot;
    },

    getByNode: function(node) {
        return this.catalog[node.dataset.id];
    },

    setNode: function(data) {
        if (!(data instanceof Slot)) throw new TypeError('El objeto Data no es "Slot"');

        var node = document.createElement('div');
        node.classList.add('slot');
        node.setAttribute('data-id', data.id);

        data.domNode = node;
        this.catalog[data.id] = data;
        return node;
    },

    checkOptions: function(data) {
        'boolean' != typeof data.locked && (data.locked = false);
        data.size && (data.size instanceof Size || (data.size = null));
        data.position && (data.position instanceof Position || (data.position = null));

        return data;
    },

    assignID: function(id) {
        var node = null;

        if (id && !isNaN(id)) {
            node = document.querySelector('div.slot[data-id="' + id + '"]');
        }

        return node ? id : ++this.lastID;
    }
};