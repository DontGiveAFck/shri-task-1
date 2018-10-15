(function () {
    // init videos (copied from rep)
    function initVideo(video, url) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        }
    }

    function getUrl(path) {
        return encodeURIComponent(`${document.location.protocol}//${document.location.hostname}:${document.location.port}/streams/${path}/master.m3u8`);
    }
    initVideo(
        document.getElementById('video-1'),
        `http://localhost:9191/master?url=${getUrl('sosed')}`,
    );

    initVideo(
        document.getElementById('video-2'),
        `http://localhost:9191/master?url=${getUrl('cat')}`,
    );

    initVideo(
        document.getElementById('video-3'),
        `http://localhost:9191/master?url=${getUrl('dog')}`,
    );

    initVideo(
        document.getElementById('video-4'),
        `http://localhost:9191/master?url=${getUrl('hall')}`,
    );

    const videos = document.body.querySelectorAll('.video');


    const bg = document.body.querySelector('.bg');


    const btnAllCameras = document.querySelector('.btn-all-cameras');


    const brightnessRange = document.querySelector('.brightness input');


    const contrastRange = document.querySelector('.contrast input');


    const brightnessLabel = document.querySelector('.brightness span');


    const contrastLabel = document.querySelector('.contrast span');


    const volumeRange = document.querySelector('.volume input');


    const volumeLabel = document.querySelector('.volume span');


    const controlsPanel = document.querySelector('.controls-panel');


    const canvas = document.querySelector('.sound-diagram');


    const btnAnalyzator = document.querySelector('.btn-analyzator');

    // check audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

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
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(i, canvas.height - soundValue / 4, i + 2, soundValue);
        });
    }

    function analyzer(video) {
        // context creation
        const context = new AudioContext();
        const node = context.createScriptProcessor(2048, 1, 1);
        const source = context.createMediaElementSource(video);

        // analyzer creation
        const analyzer = context.createAnalyser();
        analyzer.smoothingTimeConstant = 0.3;
        analyzer.fftSize = 512;

        // array for volume values
        const bands = new Uint8Array(analyzer.frequencyBinCount);

        // create audio source
        source.connect(analyzer);
        analyzer.connect(node);
        node.connect(context.destination);
        source.connect(context.destination);
        const ctx = canvas.getContext('2d');

        // listen for audio process
        node.onaudioprocess = function () {
            analyzer.getByteFrequencyData(bands);
            setTimeout(draw(bands, ctx), 500);
        };
    }



    // add event listener for each video
    videos.forEach((video) => {
        video.addEventListener('click', () => {
            if (!video.classList.contains('video-opened')) {
                video.muted = false;
                videoScreenFit(video);
                analyzer(video);
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
    });



    // add listeners for video controls
    brightnessRange.addEventListener('input', function () {
        brightnessLabel.innerText = this.value;
        document.body.querySelector('.video-opened').style.filter = `brightness(${this.value}%)`;
    });

    contrastRange.addEventListener('input', function () {
        contrastLabel.innerText = this.value;
        document.body.querySelector('.video-opened').style.filter = `contrast(${this.value}%)`;
    });

    volumeRange.addEventListener('input', function () {
        const opened = document.body.querySelector('.video-opened');
        opened.volume = this.value / 100;
        volumeLabel.innerText = this.value;
    });

    // show analyzer
    btnAnalyzator.addEventListener('click', () => {
        canvas.classList.toggle('sound-diagram-opened');
    });

    // hamburger menu
    document.body.querySelector('.icon-menu').addEventListener('click', () => {
        document.body.querySelector('.menu').classList.toggle('menu-active');
        console.log(document.body.querySelector('.menu'));
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-open');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-close');
    });
}());
