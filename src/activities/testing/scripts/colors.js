var colors = function() {
    this.load = function(slot) {
        var contentNode = slot.domNode.querySelector('.content');
        contentNode.addEventListener('click', this.toggleColor);
    }

    this.toggleColor = function() {
        var idx = parseInt(this.getAttribute('data-color'));
        2 > idx ? idx++ : idx = 0;
        switch (idx) {
            case 0:
                this.setAttribute('data-color', '0');
                break;
            case 1:
                this.setAttribute('data-color', '1');
                break;
            case 2:
                this.setAttribute('data-color', '2');
                break;
        }
    }
}

am.constructors.colors = colors;