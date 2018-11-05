import Store from "./lib/arsux/store.js";
(function () {

    const videos = document.body.querySelectorAll('.video');

    const bg = document.body.querySelector('.bg');

    const btnAllCameras = document.querySelector('.btn-all-cameras');

    const brightnessRange = document.querySelector('.brightness input');

    const contrastRange = document.querySelector('.contrast input');

    const brightnessLabel = document.querySelector('.brightness span');

    const contrastLabel = document.querySelector('.contrast span');

    const controlsPanel = document.querySelector('.controls-panel');

    const canvases = document.querySelectorAll('.sound-diagram');

    const btnAnalyzator = document.querySelector('.btn-analyzator');

    const lightingLevel = document.querySelector('.lighting');

    const sourceFlags = [];

    const sourceInstances = [];

    const analyzeInstances = [];

    let mediaElementSource;
    let stopLighting;
    let videoOpened = false;
    let openedCanvas = 0;

    // check audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

    const context = new AudioContext();

    // Framework usage

    // reducer creation
    const reducer = (state, action) => {
        switch (action.type) {
            case 'OPEN_VIDEO': {
                store.updateState({
                    ...state,
                    openedVideo: action.payload
                })
                break;
            }
            case 'CLOSE_VIDEO': {
                store.updateState({
                    ...state,
                    [action.payload.videoId]: {
                        brightness: action.payload.brightness,
                        contrast: action.payload.contrast,
                    },
                    openedVideo: false
                });
                break;
            }
        }
    };

    // create store, add initial state, reducers to the store
    const initialState = {
        openedVideo: false,
        'video-1': {
            brightness: '100',
            contrast: '100'
        },
        'video-2': {
            brightness: '100',
            contrast: '100'
        },
        'video-3': {
            brightness: '100',
            contrast: '100'
        },
        'video-4': {
            brightness: '100',
            contrast: '100'
        },
    }

    const store = new Store(initialState, reducer);

    // create a view controllers
    const openVideoController = (state) => {
        const video = document.querySelector(`#${state.openedVideo}`);

        video.style.filter = `brightness(${state[state.openedVideo].brightness}%)`;
        video.style.filter = `contrast(${state[state.openedVideo].contrast}%)`;
        brightnessRange.value = state[state.openedVideo].brightness;
        contrastRange.value = state[state.openedVideo].contrast;
        brightnessLabel.innerText = state[state.openedVideo].brightness;
        contrastLabel.innerText = state[state.openedVideo].contrast;

        console.log(state);
    };

    const closeVideoController = state => console.log(state);

    store.subscribe('OPEN_VIDEO', openVideoController);
    store.subscribe('CLOSE_VIDEO', closeVideoController);


    // full screen video
    function videoScreenFit(video) {
        video.classList.add('video-opened');
        video.style.transform = `translateX(${-video.offsetLeft}px) translateY(${-video.offsetTop}px)`;
        controlsPanel.classList.add('controls-panel-opened');
        bg.classList.add('bg-opened');
        window.location = '#';
        document.body.classList.toggle('body-no-scroll');
    }

    // draw diagram on the canvas
    function draw(data, ctx) {
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

    function getLightingLevel(video) {
        const lightningCanvas = document.createElement('canvas');
        const ctx = lightningCanvas.getContext('2d');

        lightningCanvas.width = 1;
        lightningCanvas.height = 1;

        ctx.drawImage(video, 0, 0, 1, 1);
        const imageData = ctx.getImageData(0, 0, 1, 1).data;
        const grayScale = (imageData[0] + imageData[1] + imageData[2]) / 3;
        const percentage = parseInt((grayScale * 100) / 255, 10);
        lightingLevel.innerText = `Освещенность: ${percentage}%`;
    }

    // video
    function analyzer(video) {
        // context creation
        const node = context.createScriptProcessor(2048, 1, 1);
        if (!sourceFlags.includes(video)) {
            mediaElementSource = context.createMediaElementSource(video);
            sourceFlags.push(video);
            sourceInstances[video] = mediaElementSource;
        } else {
            mediaElementSource = sourceInstances[video];
        }

        // analyzer creation
        const analyzer = context.createAnalyser();
        analyzer.smoothingTimeConstant = 0.3;
        analyzer.fftSize = 512;

        // array for volume values
        const bands = new Uint8Array(analyzer.frequencyBinCount);

        // create audio source
        mediaElementSource.connect(analyzer);
        analyzer.connect(node);
        node.connect(context.destination);
        mediaElementSource.connect(context.destination);
        const ctx = canvases[[openedCanvas]].getContext('2d');

        // listen for audio process
        node.onaudioprocess = function () {
            if (videoOpened) {
                analyzer.getByteFrequencyData(bands);
                setTimeout(draw(bands, ctx), 400);
            }
        };
    }

    // add event listener for each video
    videos.forEach((video, i) => {
        video.addEventListener('click', () => {
            if (!video.classList.contains('video-opened')) {
                store.dispatch({
                    type: 'OPEN_VIDEO',
                    payload: video.id
                })
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
    btnAllCameras.addEventListener('click', () => {
        const opened = document.body.querySelector('.video-opened');
        opened.classList.remove('video-opened');
        opened.muted = true;
        opened.style.transform = 'unset';

        store.dispatch({
            type: "CLOSE_VIDEO",
            payload: {
                videoId: opened.id,
                brightness: brightnessRange.value,
                contrast: contrastRange.value,
            }
        });

        bg.classList.toggle('bg-opened');
        controlsPanel.classList.remove('controls-panel-opened');
        canvases[openedCanvas].classList.remove('sound-diagram-opened');
        document.body.classList.toggle('body-no-scroll');
        clearInterval(stopLighting);
        videoOpened = false;
    });

    // add listeners for video controls
    brightnessRange.addEventListener('input', function () {
        brightnessLabel.innerText = this.value;
        document.body.querySelector('.video-opened').style.filter = `brightness(${
            this.value
        }%)`;
    });

    contrastRange.addEventListener('input', function () {
        contrastLabel.innerText = this.value;
        document.body.querySelector('.video-opened').style.filter = `contrast(${
            this.value
        }%)`;
    });


    // show analyzer
    btnAnalyzator.addEventListener('click', () => {
        canvases[openedCanvas].classList.toggle('sound-diagram-opened');
    });

    // hamburger menu
    document.body.querySelector('.icon-menu').addEventListener('click', () => {
        document.body.querySelector('.menu').classList.toggle('menu-active');
        console.log(document.body.querySelector('.menu'));
        document.body
            .querySelector('.icon-menu')
            .classList.toggle('icon-menu-open');
        document.body
            .querySelector('.icon-menu')
            .classList.toggle('icon-menu-close');
    });
}());
