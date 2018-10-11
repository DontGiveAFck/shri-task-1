(function() {
    var wrapper = document.body.querySelector('.image-wrapper'),
        transVal = document.body.querySelector('.trans span'),
        zoomVal = document.body.querySelector('.zoom span'),
        brightVal = document.body.querySelector('.brightness span');
    if (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0 || navigator.maxTouchPoints > 0)) {
            var touch = null,
            pointers = [];

        wrapper.addEventListener('pointerdown', (event) => {
            wrapper.setPointerCapture(event.pointerId);
            pointers.push(event);
            touch = {
                startX: event.x,
                prevX: event.x
            }
        });

        wrapper.addEventListener('pointerup', () => {
            pointers = [];
            touch = null;
        });

        wrapper.addEventListener('pointermove', (event) => {
            if (pointers.length == 2) {
                brightness(event);
            } else if (pointers.length == 1) {
                rotation(event);
            } else if (pointers.length > 2) {
                zoom(event);
            }
        });
    }

    function rotation(event) {
        var posX = parseInt(wrapper.style.backgroundPositionX) || 0,
            slideLength = 0;

        wrapper.style.backgroundPositionX = posX ? posX : '1px';
        slideLength = touch.startX < event.clientX ?
            (posX + event.clientX / 20):
            (posX - event.clientX / 20);
        wrapper.style.backgroundPositionX =
            Math.abs(parseInt(slideLength)) > wrapper.width ?
            `${wrapper.width}px` :
            `${slideLength}px`;

        transVal.innerText = `${ Math.abs(posX) > 360 ? 360 : posX }deg`;
    }

    function zoom(event) {
        var posX = parseInt(wrapper.style.backgroundSize) || 0;
        if (posX) {
            wrapper.style.backgroundSize = `${posX + (event.clientX / 10)}px ${posX + (event.clientX / 10)}px`;
        } else {
            wrapper.style.backgroundSize = '1px'
        }
        zoomVal.innerText = `${ posX / 100 }%`;
    }

    function brightness(event) {
        var bright = (Math.atan(event.clientY / event.clientX) * 180 / Math.PI) / 100;
        var minBright = 0.2;
        var maxBright = 2;
        bright = bright < minBright ? minBright : (bright > maxBright ? maxBright : bright);
        wrapper.style.filter = `brightness(${ bright })`;
        brightVal.innerText = `${ parseInt(bright * 100) }%`;
    }
})();