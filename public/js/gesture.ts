(() => {
    const wrapper: HTMLImageElement | null = document.body.querySelector(".image-wrapper");

    const transVal: HTMLElement | null = document.body.querySelector(".trans span");

    const zoomVal: HTMLElement | null = document.body.querySelector(".zoom span");

    const brightVal: HTMLElement | null = document.body.querySelector(".brightness span");

    let touch: {[startX: string]: number} | null = null;

    function rotation(event: MouseEvent) {
        if (wrapper) {
            let posX;
            !wrapper.style.backgroundPositionX ? wrapper.style.backgroundPositionX = "0px" : "";
            if (wrapper.style.backgroundPositionX) {
                posX = parseInt(wrapper.style.backgroundPositionX.toString(), 10) || 0;
                let slideLength = 0;
                wrapper.style.backgroundPositionX = posX.toString() || "1px";
                if (touch) {
                    slideLength = touch.startX < event.clientX
                        ? (posX + event.clientX / 20)
                        : (posX - event.clientX / 20);
                    wrapper.style.backgroundPositionX = Math.abs(parseInt(slideLength.toString(), 10)) > wrapper.width
                        ? `${wrapper.width}px`
                        : `${slideLength}px`;
                }
                if (transVal) {
                    transVal.innerText = `${Math.abs(posX) > 360 ? 360 : posX}deg`;
                }
            }

        }
    }

    function zoom(event: MouseEvent) {
        if (wrapper && wrapper.style.backgroundSize) {
            const posX = parseInt(wrapper.style.backgroundSize.toString(), 10) || 0;
            if (posX) {
                wrapper.style.backgroundSize = `${posX + (event.clientX / 10)}px ${posX + (event.clientX / 10)}px`;
            } else {
                wrapper.style.backgroundSize = "1px";
            }
            if (zoomVal) {
                zoomVal.innerText = `${posX / 100}%`;
            }
        }
    }

    function brightness(event: MouseEvent) {
        let bright = (Math.atan(event.clientY / event.clientX) * 180 / Math.PI) / 100;
        const minBright = 0.2;
        const maxBright = 2;
        bright = bright < minBright ? minBright : (bright > maxBright ? maxBright : bright);
        if (wrapper) {
            wrapper.style.filter = `brightness(${bright})`;
        }
        if (brightVal) {
            brightVal.innerText = `${parseInt((bright * 100).toString(), 10)}%`;
        }

    }
    if (("ontouchstart" in window) || (navigator.msMaxTouchPoints > 0 || navigator.maxTouchPoints > 0 || true)) {
        let pointers: Event[] = [];
        if (wrapper) {
            wrapper.addEventListener("pointerdown", (event: PointerEvent) => {
                wrapper.setPointerCapture(event.pointerId);
                pointers.push(event);
                touch = {
                    prevX: event.x,
                    startX: event.x,
                };
            });

            wrapper.addEventListener("pointerup", () => {
                pointers = [];
                touch = null;
            });

            wrapper.addEventListener("pointermove", (event) => {
                if (pointers.length === 2) {
                    brightness(event);
                } else if (pointers.length === 1) {
                    rotation(event);
                } else if (pointers.length > 2) {
                    zoom(event);
                }
            });
        }

    }
})();
