(() => {
    const image: HTMLElement | null = document.querySelector(".image-wrapper") as HTMLElement;
    const currentPointerEvents: {[num: number]: PointerEvent} = {};
    const imageState = {
        leftMin: -1000,
        left: 0,
        leftMax: 1000,
        zoomMin: 100,
        zoom: 100,
        zoomMax: 300,
        brightnessMin: .2,
        brightness: 1,
        brightnessMax: 4,
    };

    // Описание текущего жеста
    let gesture: {
        type: string | null,
        startZoom: number | null | undefined,
        startDistance: number | undefined,
        startAngle: number | undefined,
        startBrightness: number | undefined,
        angleDiff: number,
    } | null = null;

    // Запрещает таскать картинку мышкой

    image.addEventListener("dragstart", (event) => { event.preventDefault(); });

    image.addEventListener("pointerdown", (event) => {
        console.log("down");
        currentPointerEvents[event.pointerId] = event;
        if (!gesture) {
            gesture = {
                type: "move",
                startZoom: undefined,
                startDistance: undefined,
                startAngle: undefined,
                startBrightness: undefined,
                angleDiff: 0,
            };
        }
    });

    const getDistance = (e1: {clientX: number, clientY: number}, e2: {clientX: number, clientY: number}) => {
        const {clientX: x1, clientY: y1} = e1;
        const {clientX: x2, clientY: y2} = e2;
        return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    };

    const getAngle = (e1: {clientX: number, clientY: number}, e2: {clientX: number, clientY: number}) => {
        const {clientX: x1, clientY: y1} = e1;
        const {clientX: x2, clientY: y2} = e2;
        const r = Math.atan2(x2 - x1, y2 - y1);
        return 360 - (180 + Math.round(r * 180 / Math.PI));
    };

    const feedbackNodes: {
            [left: string]: HTMLElement | null,
            zoom: HTMLElement | null,
            brightness: HTMLElement | null,
        } | null = {
        brightness: document.body.querySelector<HTMLElement>(".brightness span"),
        left: document.body.querySelector<HTMLElement>(".trans span"),
        zoom: document.body.querySelector<HTMLElement>(".zoom span"),
    };

    const setFeedback = (name: string, value: number) => {
        if (feedbackNodes && feedbackNodes[name]) {
            const node = feedbackNodes[name];
            if (node) {
                node.innerText = (Math.round(value * 100) / 100).toString();
            }
        }
    };

    const setLeft = (dx: number) => {
        const {leftMin, leftMax} = imageState;

        imageState.left += dx;
        if (imageState.left < leftMin) {
            imageState.left = leftMin;
        } else if (imageState.left > leftMax) {
            imageState.left = leftMax;
        }
        image.style.backgroundPositionX = `${imageState.left}px`;

        setFeedback("left", -imageState.left);
    };

    if (image) {
        image.addEventListener("pointermove", (event) => {
            const pointersCount = Object.keys(currentPointerEvents).length;

            if (pointersCount === 0 || !gesture) {
                return;
            }

            if (pointersCount === 1 && gesture.type === "move") {
                const previousEvent: PointerEvent = currentPointerEvents[event.pointerId];
                const dx = event.clientX - previousEvent.clientX;
                setLeft(dx);
                currentPointerEvents[event.pointerId] = event;
            } else if (pointersCount === 2) {

                currentPointerEvents[event.pointerId] = event;
                const events: PointerEvent[] = Object.values(currentPointerEvents);
                const distance = getDistance(events[0], events[1]);
                const angle = getAngle(events[0], events[1]);

                if (!gesture.startDistance) {
                    gesture.startZoom = imageState.zoom;
                    gesture.startDistance = distance;

                    gesture.startBrightness = imageState.brightness;
                    gesture.startAngle = angle;
                    gesture.angleDiff = 0;
                    gesture.type = null;
                }

                const diff = distance - gesture.startDistance;
                let angleDiff: number | null = null;
                if (gesture && gesture.startAngle) {
                     angleDiff = angle - gesture.startAngle;
                }

                if (!gesture.type) {
                    if (angleDiff) {
                        if (Math.abs(diff) < 32 && Math.abs(angleDiff) < 8) {
                            return;
                        } else if (Math.abs(diff) > 32) {
                            gesture.type = "zoom";
                        } else {
                            gesture.type = "rotate";
                        }
                    }

                }

                if (gesture.type === "zoom") {
                    if (gesture && gesture.startZoom) {
                        const {zoomMin, zoomMax} = imageState;
                        let zoom = gesture.startZoom + diff;
                        if (diff < 0) {
                            zoom = Math.max(zoom, zoomMin);
                        } else {
                            zoom = Math.min(zoom, zoomMax);
                        }

                        imageState.zoom = zoom;
                        image.style.backgroundSize = `${zoom}%`;
                        setFeedback("zoom", zoom);
                    }
                }

                if (gesture.type === "rotate") {
                    if (gesture && angleDiff && gesture.startBrightness) {
                        const {brightnessMin, brightnessMax} = imageState;

                        if (Math.abs(angleDiff - gesture.angleDiff) > 300) {
                            gesture.startBrightness = imageState.brightness;
                            gesture.startAngle = angle;
                            gesture.angleDiff = 0;
                            return;
                        }

                        gesture.angleDiff = angleDiff;

                        let brightness = gesture.startBrightness + angleDiff / 50;
                        if (angleDiff < 0) {
                            brightness = Math.max(brightness, brightnessMin);
                        } else {
                            brightness = Math.min(brightness, brightnessMax);
                        }

                        imageState.brightness = brightness;
                        image.style.filter = `brightness(${brightness})`;
                        setFeedback("brightness", brightness);
                    }
                }
            }
        });
    }

    const onPointerUp = (event: PointerEvent) => {
        gesture = null;
        delete currentPointerEvents[event.pointerId];
    };

    image.addEventListener("pointerup", onPointerUp);
    image.addEventListener("pointercancel", onPointerUp);
    image.addEventListener("pointerleave", onPointerUp);
})();
