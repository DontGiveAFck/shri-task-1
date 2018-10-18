(function () {
    const videos = document.body.querySelectorAll('.video');

    const bg = document.body.querySelector('.bg');

    const btnAllCameras = document.querySelector('.btn-all-cameras');

    const brightnessRange = document.querySelector('.brightness input');

    const contrastRange = document.querySelector('.contrast input');

    const brightnessLabel = document.querySelector('.brightness span');

    const contrastLabel = document.querySelector('.contrast span');

    const controlsPanel = document.querySelector('.controls-panel');

    const canvas = document.querySelector('.sound-diagram');

    const btnAnalyzator = document.querySelector('.btn-analyzator');

    const lightingLevel = document.querySelector('.lighting');

    const sourceFlags = [];

    const sourceInstances = [];

    let mediaElementSource;

    let stopLighting;
    let videoOpened = false;

    // check audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

    const context = new AudioContext();


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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        data.forEach((soundValue, i) => {
            ctx.fillStyle = `rgb(${soundValue + i / data.length}, ${(i / data.length)}, ${100})`;
            ctx.fillRect(
                ((i * canvas.width) / data.length) * 2,
                canvas.height - soundValue / 4,
                (canvas.width / data.length) * 2,
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
        const ctx = canvas.getContext('2d');

        // listen for audio process
        node.onaudioprocess = function () {
            if (videoOpened) {
                analyzer.getByteFrequencyData(bands);
                setTimeout(draw(bands, ctx), 400);
            }
        };
    }

    // add event listener for each video
    videos.forEach((video) => {
        video.addEventListener('click', () => {
            if (!video.classList.contains('video-opened')) {
                video.muted = false;
                videoScreenFit(video);
                analyzer(video);
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
        bg.classList.toggle('bg-opened');
        controlsPanel.classList.remove('controls-panel-opened');
        canvas.classList.remove('sound-diagram-opened');
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
        canvas.classList.toggle('sound-diagram-opened');
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
