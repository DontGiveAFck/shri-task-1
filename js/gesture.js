var wrapper = document.body.querySelector('.image-wrapper'),
    transVal = document.body.querySelector('.trans span'),
    zoomVal = document.body.querySelector('.zoom span'),
    brightVal = document.body.querySelector('.brightness span'),
    imageDiagonal = 0,
    zoomValue = 100,
    start = null,
    isFree = false,
    pointers = [],
    rotate = {
        posX: 0,
        posY: 0
    },
    bright = {
        value: 100,
        rotate: 0
    };
wrapper.addEventListener('pointerdown', onPointerDown);

function rotation(x, y) {
    wrapper.style.backgroundPosition = wrapper.style.backgroundPosition.split(' ').map((e, i) => {
            var position;
            if (i === 0) {
                var limit = 3600;

                position = parseFloat(rotate.posX);
                position += parseFloat(x - pointers[0].x);

                if (position > limit) {
                    position = limit;
                }
                if (position < -limit) {
                    position = -limit;
                }

                transVal.innerText = `${parseInt(position)}deg`;

                return `${position}px`;
            } else if (i == 1) {
                var maxY = 100;

                position = parseFloat(rotate.posY);
                position += -1 * parseFloat(y - pointers[0].y);

                if (position < 0) position = 0;
                if (position > maxY) position = 100;

                return `${position}%`;
            }
            return '';
        })
        .join(' ');
}

function increasement (nextPointer, idx) {

    var a = Math.abs(pointers[idx].x - nextPointer.clientX),
        b = Math.abs(pointers[idx].y - nextPointer.clientY),
        maxZoom = 400,
        minZoom = 100;
    var currentDiagonal = Math.sqrt(a * a + b * b);

    if (start === null) {
        start = {
            r: currentDiagonal,
            x: nextPointer.clientX,
            y: nextPointer.clientY
        };
    }

    if (imageDiagonal == 0) {
        zoomValue = 100;
        imageDiagonal = currentDiagonal;
    } else {
        imageDiagonal = currentDiagonal;
        let newZoom = +imageDiagonal;
        newZoom += zoomValue / 10;
        if (newZoom < minZoom) {
            newZoom = minZoom;
        }
        if (newZoom > maxZoom) {
            newZoom = maxZoom;
        }
        zoomValue = newZoom;
    }

       zoomVal.innerText = `${parseInt(zoomValue)}%`;
    wrapper.style.backgroundSize = `${zoomValue}% ${zoomValue}%`;

}

function brightness() {
    if (start === null) return;

    var newBrite = (bright.rotate + Math.atan(event.clientY / event.clientX) * 180 / Math.PI) / 1.5;

    var minBright = 40;
    var maxBright = 180;

    if (newBrite < minBright) newBrite = minBright;
    if (newBrite > maxBright) newBrite = maxBright;

    brightVal.innerText = `${parseInt(newBrite)}%`;
    wrapper.style.filter = `brightness(${newBrite}%)`;
    bright.rotate = newBrite;
}

function doubleTouch(event) {
    var idx = pointers.findIndex(obj => obj.id === event.pointerId);
    increasement(event, idx === 0 ? 1 : 0);
    brightness();
}

function onPointerUp(event) {
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointermove', function (event) {
        rotation(event.clientX, event.clientY);
    });
    pointers = pointers.filter(pointer => pointer.id !== event.pointerId);
    const pos = wrapper.style.backgroundPosition.split(' ').map(e => e.slice(0, e.length - 2));
    rotate.posX = pos[0];
    rotate.posY = pos[1];
    zoomValue = wrapper.style.backgroundSize.split(' ')[0];
    start = null;
}

function onPointerDown(event) {
    pointers.push({
        x: isFree ? 0 : event.clientX,
        y: isFree ? 0 : event.clientY,
        id: event.pointerId
    });

    if (pointers.length > 1) {
        document.removeEventListener('pointermove', function (event) {
            rotation(event.clientX, event.clientY);
        });
        document.addEventListener('pointermove', doubleTouch);
    } else {
        document.addEventListener('pointermove', function (event) {
            rotation(event.clientX, event.clientY);
        });
        document.removeEventListener('pointermove', doubleTouch);
    }
    document.addEventListener('pointerup', onPointerUp);
}