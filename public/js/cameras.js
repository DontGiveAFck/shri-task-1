(function () {
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
       canvas = document.querySelector('.sound-diagram');

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

    var openedVideo = {
        kw: 0,
        kh: 0
    }
    videos.forEach(function (video) {
       video.addEventListener('click', function () {

           video.muted = false;
           videoScreenFit(video);

           //audio context creation
           var context =  new AudioContext();
           var node = context.createScriptProcessor(2048, 1, 1);
           var source = context.createMediaElementSource(video);

           //analyzer creation
           var analyzer = context.createAnalyser();
           analyzer.smoothingTimeConstant = 0.3;
           analyzer.fftSize = 128;

           var bands = new Uint8Array(analyzer.frequencyBinCount);
           //create audio source
           source.connect(analyzer);
           analyzer.connect(node);
           node.connect(context.destination);
           source.connect(context.destination);
           var ctx = canvas.getContext('2d');

           node.onaudioprocess = function () {
               analyzer.getByteFrequencyData(bands);
               setTimeout(draw(bands, ctx), 500);
           }
       });
   });

   function draw(data, ctx) {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       data.forEach(function (soundValue, i) {
           ctx.fillStyle = '#ff0000';
           ctx.fillRect(i, canvas.height - soundValue, i + 1, soundValue);
       });
   }

   function videoScreenFit(video) {
       var viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
       var viewportH = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
       var height = video.offsetHeight;
       var width = video.offsetWidth;
       var kw = viewportW / width;
       var kh = viewportH / height;
       video.style.transform = `scaleX(${kw}) scaleY(${kh}) translate(calc((39.3vw - ${video.offsetLeft}px)/${kw}), calc((40vh - ${video.offsetTop}px)/${kh}) `;
       video.classList.add('video-opened');
       controlsPanel.classList.add('controls-panel-opened');
       bg.classList.add('bg-opened');

   }
   btnAllCameras.addEventListener('click', function () {
       var opened = document.body.querySelector('.video-opened');
       opened.classList.remove('video-opened');
       opened.muted = true;
       opened.style.transform = 'unset';
       bg.classList.toggle('bg-opened');
       controlsPanel.classList.remove('controls-panel-opened');
   });

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
       volumeLabel = this.value;
   });


})();