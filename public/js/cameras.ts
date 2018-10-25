(() => {
    const videos: NodeListOf<HTMLVideoElement> = document.body.querySelectorAll(".video");

    const bg = document.body.querySelector(".bg");

    const btnAllCameras = document.querySelector(".btn-all-cameras");

    const brightnessRange: HTMLInputElement | null = document.querySelector(".brightness input");

    const contrastRange: HTMLInputElement | null = document.querySelector(".contrast input");

    const brightnessLabel: HTMLElement | null = document.querySelector(".brightness span");

    const contrastLabel: HTMLElement | null = document.querySelector(".contrast span");

    const controlsPanel = document.querySelector(".controls-panel");

    const canvases: NodeListOf<HTMLCanvasElement> = document.querySelectorAll(".sound-diagram");

    const btnAnalyzator: HTMLElement | null = document.querySelector(".btn-analyzator");

    const lightingLevel: HTMLElement | null = document.querySelector(".lighting");

    const sourceFlags: HTMLVideoElement[] = [];

    const sourceInstances: Map<object, MediaElementAudioSourceNode> = new Map();

    const analyzeInstances: HTMLVideoElement[] = [];

    let mediaElementSource;
    let stopLighting: number;
    let videoOpened: boolean = false;
    let openedCanvas: number = 0;

    // check audio context
    const Audio = AudioContext /*|| window.webkitAudioContext */;
    if (!Audio) {
        alert("Браузер не поддерживает Web Audio API!");
    }

    const context = new Audio();

    // full screen video
    function videoScreenFit(video: HTMLVideoElement) {
        video.classList.add("video-opened");
        video.style.transform = `translateX(${-video.offsetLeft}px) translateY(${-video.offsetTop}px)`;
        if (controlsPanel) {
            controlsPanel.classList.add("controls-panel-opened");
        }
        if (bg) {
            bg.classList.add("bg-opened");
        }
        window.location.href = "#";
        document.body.classList.toggle("body-no-scroll");
    }

    // draw diagram on the canvas
    function draw(data: Uint8Array, ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, canvases[openedCanvas].width, canvases[openedCanvas].height);
        data.forEach((soundValue, i) => {
            ctx.fillStyle = `rgb(${soundValue + i / data.length}, ${(i / data.length)}, ${100})`;
            ctx.fillRect(
                ((i * canvases[openedCanvas].width) / data.length) * 2,
                canvases[openedCanvas].height - soundValue / 4,
                (canvases[openedCanvas].width / data.length) * 2,
                soundValue,
            );
        });
    }

    function getLightingLevel(video: HTMLVideoElement) {
        const lightningCanvas = document.createElement("canvas");
        const ctx = lightningCanvas.getContext("2d");

        lightningCanvas.width = 1;
        lightningCanvas.height = 1;
        let imageData;
        if (ctx) {
            ctx.drawImage(video, 0, 0, 1, 1);
            imageData = ctx.getImageData(0, 0, 1, 1).data;
            const grayScale = (imageData[0] + imageData[1] + imageData[2]) / 3;
            const percentage = parseInt(((grayScale * 100) / 255).toString(), 10);
            if (lightingLevel) {
                lightingLevel.innerText = `Освещенность: ${percentage}%`;
            }
        }
    }

    // video
    function analyzer(video: HTMLVideoElement) {
        // context creation
        const node = context.createScriptProcessor(2048, 1, 1);
        if (!sourceFlags.includes(video)) {
            mediaElementSource = context.createMediaElementSource(video);
            sourceFlags.push(video);
            sourceInstances.set(video, mediaElementSource);
        } else {
            mediaElementSource = sourceInstances.get(video);
        }

        // analyzer creation
        const analyze = context.createAnalyser();
        analyze.smoothingTimeConstant = 0.3;
        analyze.fftSize = 512;

        // array for volume values
        const bands = new Uint8Array(analyze.frequencyBinCount);

        // create audio source
        if (mediaElementSource) {
            mediaElementSource.connect(analyze);
            mediaElementSource.connect(context.destination);
        }
        analyze.connect(node);
        node.connect(context.destination);

        const ctx = canvases[openedCanvas].getContext("2d");

        // listen for audio process
        node.onaudioprocess = () => {
            if (videoOpened) {
                analyze.getByteFrequencyData(bands);
                if (ctx) {
                    setTimeout(() => draw(bands, ctx), 400);
                }

            }
        };
    }

    // add event listener for each video
    videos.forEach((video, i) => {
        video.addEventListener("click", () => {
            if (!video.classList.contains("video-opened")) {
                video.muted = false;
                videoScreenFit(video);
                openedCanvas = i;
                if (!analyzeInstances.includes(video)) {
                    analyzer(video);
                    analyzeInstances.push(video);
                }
                stopLighting = setInterval(getLightingLevel.bind(null, video), 1000);
                videoOpened = true;
            }
        });
    });

    // close opened video
    if (btnAllCameras) {
        btnAllCameras.addEventListener("click", () => {
            const opened: HTMLVideoElement | null = document.body.querySelector(".video-opened");
            if (opened) {
                opened.classList.remove("video-opened");
                opened.muted = true;
                opened.style.transform = "unset";
            }
            if (bg) {
                bg.classList.toggle("bg-opened");
            }
            if (controlsPanel) {
                controlsPanel.classList.remove("controls-panel-opened");
            }
            canvases[openedCanvas].classList.remove("sound-diagram-opened");
            document.body.classList.toggle("body-no-scroll");
            clearInterval(stopLighting);
            videoOpened = false;
        });
    }
    // add listeners for video controls
    if (brightnessRange) {
        brightnessRange.addEventListener("input", function() {
            const openedVideo: HTMLVideoElement | null = document.body.querySelector(".video-opened");
            if (brightnessLabel) {
                brightnessLabel.innerText = this.value;
            }
            if (openedVideo) {
                openedVideo.style.filter = `brightness(${
                    this.value
                    }%)`;
            }
        });
    }

    if (contrastRange) {
        contrastRange.addEventListener("input", function() {
            const openedVideo: HTMLVideoElement | null = document.body.querySelector(".video-opened");
            if (contrastLabel) {
                contrastLabel.innerText = this.value;
            }
            if (openedVideo) {
                openedVideo.style.filter = `contrast(${
                    this.value
                    }%)`;
            }
        });
    }

    // show analyzer
    if (btnAnalyzator) {
        btnAnalyzator.addEventListener("click", () => {
            canvases[openedCanvas].classList.toggle("sound-diagram-opened");
        });
    }

    // hamburger menu
    const menu: HTMLElement | null =  document.body.querySelector(".menu");
    const iconMenu: HTMLElement | null = document.body.querySelector(".icon-menu");
    if (iconMenu) {
        iconMenu.addEventListener("click", () => {
            if (menu) {
                menu.classList.toggle("menu-active");
            }
            iconMenu.classList.toggle("icon-menu-open");
            iconMenu.classList.toggle("icon-menu-close");
        });
    }
})();
