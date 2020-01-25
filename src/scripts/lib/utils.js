(function() {
    'use strict';

    window.utils = {
        name: 'Utils',

        setTransition: function(node, b) {
            if (!('parentNode' in node)) throw new TypeError('domNode no es un nodo DOM valido');
            b ? node.setAttribute('data-transition', b) : node.removeAttribute('data-transition');
        },

        getRootPath: function() {
            var path = document.location.pathname,
                idx = path.lastIndexOf('/') + 1;

            return path.slice(0, idx);
        },

        getTouchEvents: function() {
            var isTouch = 'ontouchstart' in document.createElement('div'),
                startName = isTouch ? 'touchstart' : 'mousedown',
                moveName = isTouch ? 'touchmove' : 'mousemove',
                endName = isTouch ? 'touchend' : 'mouseup';

            return {
                isTouch: isTouch,
                start: startName,
                move: moveName,
                end: endName
            }
        },

        setSize: function(domNode, size) {
            if (!('parentNode' in domNode)) throw new TypeError('domNode no es un nodo DOM valido');
            if (size.constructor != Size) throw new TypeError('size no es una instancia de Size');

            domNode.style.width = size.width;
            domNode.style.height = size.height;
        },

        setAbsolutePos: function(domNode, position) {
            var prop, trVal, txVal, tyVal, txStart, txEnd, tyStart, tyEnd, trStart, trEnd, measure = {};

            if (!('parentNode' in domNode)) throw new TypeError('domNode no es un nodo DOM valido');
            if (position.constructor != Position) throw new TypeError('position no es una instancia de Position');

            prop = domNode.style.transform;

            if (prop) {
                txStart = prop.indexOf('translateX');
                tyStart = prop.indexOf('translateY');

                if (txStart != -1) {
                    txEnd = prop.indexOf(')', txStart);
                    txVal = prop.slice(txStart + 11, txEnd);
                    prop = prop.replace(prop.slice(txStart, txEnd + 1), '');
                }

                if (tyStart != -1) {
                    tyEnd = prop.indexOf(')', tyStart);
                    tyVal = prop.slice(tyStart + 11, tyEnd);
                    prop = prop.replace(prop.slice(tyStart, tyEnd + 1), '');
                }

                if (!txVal && !tyVal) {
                    trStart = prop.indexOf('translate');
                    if (trStart != -1) {
                        trEnd = prop.indexOf(')', trStart);
                        trVal = prop.slice(trStart + 10, trEnd);
                        prop = prop.replace(prop.slice(trStart, trEnd + 1), '');
                        trVal = trVal.split(',');

                        for (var i = trVal.length - 1; i >= 0; i--) trVal[i].trim();
                    }
                }

                if (trVal) {
                    measure.x = trVal[0];
                    if (trVal[1])
                        measure.y = trVal[1];
                } else {
                    if (txVal)
                        measure.x = txVal;
                    if (tyVal)
                        measure.y = tyVal;
                }

                prop.trim();
            }

            if (position.translateX)
                measure.x = position.translateX;
            if (position.translateY)
                measure.y = position.translateY;
            if (!measure.x)
                measure.x = 0;
            if (!measure.y)
                measure.y = 0;

            if (prop) {
                domNode.style.transform = prop + ' translate(' + measure.x + ',' + measure.y + ')';
            } else {
                domNode.style.transform = 'translate(' + measure.x + ',' + measure.y + ')';
                if (position.top)
                    domNode.style.top = position.top;
                if (position.left)
                    domNode.style.left = position.left;
                if (position.right)
                    domNode.style.right = position.right;
                if (position.bottom)
                    domNode.style.bottom = position.bottom;
            }
        },

        opacityTransition: function(domNode, content, speed) {
            var curSpeed = 350;
            if (!('parentNode' in domNode)) throw new TypeError('domNode no es un nodo DOM valido');

            if ('number' == typeof speed) {
                curSpeed = speed
            }

            domNode.style.opacity = 0;

            return new Promise(function(resolve) {
                setTimeout(function() {
                    domNode.innerHTML = content;
                    domNode.style.opacity = 1;
                    resolve();
                }, curSpeed);
            });
        },

        isValidUnitVal: function(val) {
            var units = ['px', 'rem', '%'],
                unitIdx = 0;

            if ('string' != typeof val) return false;

            for (var i = 0; i < units.length; i++) {
                unitIdx = val.indexOf(units[i])

                if (unitIdx != -1)
                    return !isNaN(parseInt(val.substring(0, unitIdx)));
            }

            return false;
        },

        toggleCheckbox: function() {
            var node;
            if ('querySelector' in this) {
                node = this.querySelector('input[type=\'checkbox\']');
                if (node) {
                    node.checked = !node.checked;
                }
            }

            return false;
        },

        fetch(url) {
            return app.isBrowser ? fetch(url) : fetchLocal(url);
        }
    }

    window.Size = function(width, height) {
        var defaultVal = 'auto';

        this.width = utils.isValidUnitVal(width) ? width : defaultVal;
        this.height = utils.isValidUnitVal(height) ? height : defaultVal;
    }

    window.Position = function(obj) {
        if ('object' != typeof obj) throw new TypeError('obj no es un objeto.');

        if (obj.top)
            this.top = utils.isValidUnitVal(obj.top) ? obj.top : 'unset';
        if (obj.left)
            this.left = utils.isValidUnitVal(obj.left) ? obj.left : 'unset';
        if (obj.right)
            this.right = utils.isValidUnitVal(obj.right) ? obj.right : 'unset';
        if (obj.bottom)
            this.bottom = utils.isValidUnitVal(obj.bottom) ? obj.bottom : 'unset';
        if (obj.translateX)
            this.translateX = utils.isValidUnitVal(obj.translateX) ? obj.translateX : null;
        if (obj.translateY)
            this.translateY = utils.isValidUnitVal(obj.translateY) ? obj.translateY : null;
    }

    window.fetchLocal = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(new Response(xhr.responseText, { status: xhr.status }));
            }
            xhr.onerror = function() {
                reject(new TypeError('Local request failed'));
            }
            xhr.open('GET', url);
            xhr.send(null);
        });
    }

    window.Positions = {
        TOP: new Position({
            top: '0px',
            bottom: 'unset',
            translateY: null
        }),
        LEFT: new Position({
            left: '0px',
            right: 'unset',
            translateX: null
        }),
        RIGHT: new Position({
            left: 'unset',
            right: '0px',
            translateX: null
        }),
        BOTTOM: new Position({
            top: 'unset',
            bottom: '0px',
            translateY: null
        }),
        CENTER: new Position({
            top: '50%',
            left: '50%',
            right: 'unset',
            bottom: 'unset',
            translateX: '-50%',
            translateY: '-50%'
        }),
        ZERO: new Position({
            top: '0px',
            left: '0px',
            right: 'unset',
            bottom: 'unset',
            translateX: '0px',
            translateY: '0px'
        })
    }
})();