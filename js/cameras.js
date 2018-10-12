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
       canvas = document.querySelector('.sound-diagram');

    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

   videos.forEach(function (video) {
       video.addEventListener('click', function () {
           video.classList.add('video-opened');
           video.muted = false;
           bg.classList.add('bg-opened');

           //audio context creation
           var context = new AudioContext();
           //create node
           var node = context.createScriptProcessor(2048, 1, 1);

           //analyzer creation
           var analyzer = context.createAnalyser();
           analyzer.smoothingTimeConstant = 0.3;
           analyzer.fftSize = 512;
           console.log(analyzer.frequencyBinCount);
           var bands = new Uint8Array(analyzer.frequencyBinCount);
           console.log(bands);

           //create audio source
           var source = context.createMediaElementSource(video);
           source.connect(analyzer);
           analyzer.connect(node);
           node.connect(context.destination);
           source.connect(context.destination);
           console.log(bands);

           node.onaudioprocess = function () {
               analyzer.getByteFrequencyData(bands);
               var ctx = canvas.getContext('2d');
               setInterval(draw(bands, ctx), 100);
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
   btnAllCameras.addEventListener('click', function () {
       var opened = document.body.querySelector('.video-opened');
       opened.classList.remove('video-opened');
       opened.muted = true;
       bg.classList.toggle('bg-opened');
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