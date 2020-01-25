var p_units = function() {
    this.str_newUnit = 'Nueva Unidad';
    this.str_editUnit = 'Editando ';

    this.load = function(slot) {
        this.domNode = slot.domNode;
        this.setEvs();
        this.updateUnitList();
    }

    this.setEvs = function() {
        var self = this,
            mainNode = this.domNode.querySelector('#main'),
            btnBack = mainNode.querySelector('[role="region"] header > button:first-child'),
            btnAdd = mainNode.querySelector('[role="region"] header menu a'),
            actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]'),
            btnDefault = actionNode.querySelector('#btn-default'),
            btnRemove = actionNode.querySelector('#btn-remove'),
            btnEdit = actionNode.querySelector('#btn-edit'),
            btnCancel = actionNode.querySelector('#btn-cancel'),
            newNode = this.domNode.querySelector('#new-unit'),
            nnBack = newNode.querySelector('[role="region"] header > button:first-child'),
            nnForm = newNode.querySelector('form');

        btnAdd.addEventListener('click', function() {
            self.closeActionMenu(true);
            self.openNewUnit('add');
        });

        btnEdit.addEventListener('click', function() {
            self.openNewUnit('edit', parseInt(actionNode.selectedIndex));
            self.closeActionMenu(true);
        });

        btnBack.addEventListener('click', function() { self.close() });
        nnBack.addEventListener('click', function() { self.closeNewUnit() });
        nnForm.addEventListener('submit', function(ev) { self.submitUnit(ev) });
        btnCancel.addEventListener('click', function() { self.closeActionMenu() });
        btnDefault.addEventListener('click', function() { self.setDefaultUnit() });
        btnRemove.addEventListener('click', function() { self.removeUnit() });
    }

    this.updateUnitList = function() {
        var self = this,
            prefs = app.prefs.get('units'),
            units = app.units.catalog,
            listNode = this.domNode.querySelector('#main [role="region"] ul'),
            checkTpl = ['<aside class="pack-end default">', '<span class="fa fa-check fa-lg"></span>', '</aside>'].join('');

        listNode.innerHTML = null;
        units.forEach(function(item, idx) {
            var liNode = document.createElement('li'),
                tpl = ['<a href="#">', '<p>' + item.alias + '</p>', '<p>' + item.description + '</p>', '</a>'];

            if (idx == prefs.default) {
                tpl.splice(1, 0, checkTpl);
                liNode.setAttribute('data-default', true);
            }

            liNode.innerHTML = tpl.join('');
            liNode.setAttribute('data-id', idx);
            liNode.addEventListener('click', function() { self.openActionMenu(this) });
            listNode.appendChild(liNode);
        });
    }

    this.close = function() {
        am.startActivity(am.catalog.get('preferences', 'p_main'), {
            animation: ['left-current', 'current-right']
        });
    }

    this.openNewUnit = function(role, id) {
        var unit,
            fconv,
            mNode = this.domNode.querySelector('#main'),
            nuNode = this.domNode.querySelector('#new-unit'),
            h1 = nuNode.querySelector('section[role="region"] header h1'),
            aliasNode = nuNode.querySelector('form #alias'),
            descNode = nuNode.querySelector('form #desc'),
            fconvNode = nuNode.querySelector('form #fconv');

        if ('string' != typeof role) throw new TypeError('role no es una cadena.');

        if ('edit' == role) {
            if ('number' != typeof id)
                throw new TypeError('id no es un numero.');

            unit = app.units.catalog[id];
            fconv = parseFloat(unit.fconv);
            h1.innerHTML = this.str_editUnit + unit.alias;
            aliasNode.value = unit.alias;
            descNode.value = unit.description;
            fconvNode.value = fconv.toFixed(3);
            aliasNode.disabled = true;
        } else {
            h1.innerHTML = this.str_newUnit;
            aliasNode.disabled = false;
        }

        mNode.classList.remove('current');
        nuNode.classList.add('current');
    }

    this.closeNewUnit = function() {
        var mNode = this.domNode.querySelector('#main'),
            nuNode = this.domNode.querySelector('#new-unit'),
            form = nuNode.querySelector('form');

        nuNode.classList.remove('current');
        mNode.classList.add('current');
        form.reset();
    }

    this.submitUnit = function(ev) {
        var alias, desc, fconv, unit, self = this,
            node = ev.target;
        if (!node) throw new ReferenceError('e no es un evento.');

        if (node.querySelectorAll('input:invalid').length !== 0) {
            return false;
        }

        alias = node.querySelector('#alias').value;
        desc = node.querySelector('#desc').value;
        fconv = node.querySelector('#fconv').value;

        unit = new Unit(alias, desc, fconv);

        app.units.add(unit).then(function() {
            self.updateUnitList();
            self.closeNewUnit();
        });
    }

    this.openActionMenu = function(node) {
        var actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]'),
            header = actionNode.querySelector('header'),
            btnDefault = actionNode.querySelector('#btn-default'),
            btnRemove = actionNode.querySelector('#btn-remove'),
            id = node.getAttribute('data-id'),
            unit = app.units.catalog[id],
            isDefault = node.getAttribute('data-default'),
            uniqueUnit = app.units.catalog.length == 1;

        btnDefault.disabled = !!isDefault;
        btnRemove.disabled = !!uniqueUnit;
        header.innerHTML = 'Unidad seleccionada: ' + unit.alias;
        actionNode.selectedIndex = id;
        utils.setTransition(actionNode, 'bottom-current');
    }

    this.closeActionMenu = function(opening) {
        var className = opening ? null : 'current-bottom',
            actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]');

        actionNode.selectedIndex = null;
        utils.setTransition(actionNode, className);
    }

    this.setDefaultUnit = function() {
        var self = this,
            actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]'),
            idx = parseInt(actionNode.selectedIndex) || 0,
            payload = { default: idx };

        app.units.setPrefs(payload).then(function() {
            self.updateUnitList();
            self.closeActionMenu();
        });
    }

    this.removeUnit = function() {
        var self = this,
            actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]'),
            idx = parseInt(actionNode.selectedIndex) || 0,
            retval = confirm('¿Esta seguro que desea eliminar la unidad ' + app.units.catalog[idx].alias + '?');

        if (retval) {
            app.units.remove(idx).then(function() { self.updateUnitList() });
            self.closeActionMenu();
        }
    }

    this.editUnit = function() {
        var self = this,
            actionNode = this.domNode.querySelector('#main [role="region"] [role="dialog"][data-type="action"]'),
            idx = parseInt(actionNode.selectedIndex) || 0,
            payload = { default: idx };

        app.units.setPrefs(payload).then(function() {
            self.updateUnitList();
            self.closeActionMenu();
        });
    }
}

am.constructors.p_units = p_units;