(function () {
    const wrapper = document.body.querySelector('.image-wrapper');


    const transVal = document.body.querySelector('.trans span');


    const zoomVal = document.body.querySelector('.zoom span');


    const brightVal = document.body.querySelector('.brightness span');

    let touch = null;

    function rotation(event) {
        const posX = parseInt(wrapper.style.backgroundPositionX, 10) || 0;


        let slideLength = 0;

        wrapper.style.backgroundPositionX = posX || '1px';
        slideLength = touch.startX < event.clientX
            ? (posX + event.clientX / 20)
            : (posX - event.clientX / 20);
        wrapper.style.backgroundPositionX = Math.abs(parseInt(slideLength, 10)) > wrapper.width
            ? `${wrapper.width}px`
            : `${slideLength}px`;

        transVal.innerText = `${Math.abs(posX) > 360 ? 360 : posX}deg`;
    }

    function zoom(event) {
        const posX = parseInt(wrapper.style.backgroundSize, 10) || 0;
        if (posX) {
            wrapper.style.backgroundSize = `${posX + (event.clientX / 10)}px ${posX + (event.clientX / 10)}px`;
        } else {
            wrapper.style.backgroundSize = '1px';
        }
        zoomVal.innerText = `${posX / 100}%`;
    }

    function brightness(event) {
        let bright = (Math.atan(event.clientY / event.clientX) * 180 / Math.PI) / 100;
        const minBright = 0.2;
        const maxBright = 2;
        bright = bright < minBright ? minBright : (bright > maxBright ? maxBright : bright);
        wrapper.style.filter = `brightness(${bright})`;
        brightVal.innerText = `${parseInt(bright * 100, 10)}%`;
    }

    if (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0 || navigator.maxTouchPoints > 0)) {
        let pointers = [];

        wrapper.addEventListener('pointerdown', (event) => {
            wrapper.setPointerCapture(event.pointerId);
            pointers.push(event);
            touch = {
                startX: event.x,
                prevX: event.x,
            };
        });

        wrapper.addEventListener('pointerup', () => {
            pointers = [];
            touch = null;
        });

        wrapper.addEventListener('pointermove', (event) => {
            if (pointers.length === 2) {
                brightness(event);
            } else if (pointers.length === 1) {
                rotation(event);
            } else if (pointers.length > 2) {
                zoom(event);
            }
        });
    }
}());
