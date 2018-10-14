(function () {
    // init videos (copied from rep)
    function initVideo(video, url) {
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    }

    function getUrl(path) {
        return encodeURIComponent(`${document.location.protocol}//${document.location.hostname}:${document.location.port}/streams/${path}/master.m3u8`)
    }
    initVideo(
        document.getElementById('video-1'),
        'http://localhost:9191/master?url='+ getUrl('sosed')
    );

    initVideo(
        document.getElementById('video-2'),
        'http://localhost:9191/master?url='+ getUrl('cat')
    );

    initVideo(
        document.getElementById('video-3'),
        'http://localhost:9191/master?url='+ getUrl('dog')
    );

    initVideo(
        document.getElementById('video-4'),
        'http://localhost:9191/master?url='+ getUrl('hall')
    );

    var videos = document.body.querySelectorAll('.video'),
       bg = document.body.querySelector('.bg'),
       btnAllCameras = document.querySelector('.btn-all-cameras'),
       brightnessRange = document.querySelector('.brightness input'),
       contrastRange = document.querySelector('.contrast input'),
       brightnessLabel = document.querySelector('.brightness span'),
       contrastLabel = document.querySelector('.contrast span'),
       volumeRange = document.querySelector('.volume input'),
       volumeLabel = document.querySelector('.volume span'),
       controlsPanel = document.querySelector('.controls-panel'),
       canvas = document.querySelector('.sound-diagram'),
       btnAnalyzator = document.querySelector('.btn-analyzator');

    //check audio context
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

    // add event listener for each video
    videos.forEach(function (video) {
       video.addEventListener('click', function () {
           if (!video.classList.contains('video-opened')) {
               video.muted = false;
               videoScreenFit(video);
               //audio context creation
               var context =  new AudioContext();
               var node = context.createScriptProcessor(2048, 1, 1);
               var source = context.createMediaElementSource(video);

               //analyzer creation
               var analyzer = context.createAnalyser();
               analyzer.smoothingTimeConstant = 0.3;
               analyzer.fftSize = 512;

               var bands = new Uint8Array(analyzer.frequencyBinCount);
               //create audio source
               source.connect(analyzer);
               analyzer.connect(node);
               node.connect(context.destination);
               source.connect(context.destination);
               var ctx = canvas.getContext('2d');

               // listen for audio process
               node.onaudioprocess = function () {
                   console.log('ps')
                   analyzer.getByteFrequencyData(bands);
                   setTimeout(draw(bands, ctx), 500);
               }
           }
       });
   });

   // draw diagram on the canvas
   function draw(data, ctx) {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       data.forEach(function (soundValue, i) {
           ctx.fillStyle = '#ff0000';
           ctx.fillRect(i, canvas.height - soundValue, i + 1, soundValue);
       });
   }

    // close opened video
    btnAllCameras.addEventListener('click', function () {
        var opened = document.body.querySelector('.video-opened');
        opened.classList.remove('video-opened');
        opened.muted = true;
        opened.style.transform = 'unset';
        bg.classList.toggle('bg-opened');
        controlsPanel.classList.remove('controls-panel-opened');
        canvas.classList.remove('sound-diagram-opened');
        document.body.classList.toggle('body-no-scroll');
    });

   // full screen video
   function videoScreenFit(video) {
       video.classList.add('video-opened');
       video.style.transform = `translateX(${-video.offsetLeft}px) translateY(${-video.offsetTop}px)`;
       controlsPanel.classList.add('controls-panel-opened');
       bg.classList.add('bg-opened');
       window.location = '#';
       document.body.classList.toggle('body-no-scroll');
   }

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
       var opened = document.body.querySelector('.video-opened');
       opened.volume = this.value / 100;
       volumeLabel.innerText = this.value;
   });

   // show analyzer
   btnAnalyzator.addEventListener('click', function () {
       canvas.classList.toggle('sound-diagram-opened');
   });

   // hamburger menu
    document.body.querySelector('.icon-menu').addEventListener('click', function () {
        document.body.querySelector('nav ul').classList.toggle('menu-active');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-open');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-close');
    });

})();