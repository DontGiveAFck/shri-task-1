(function () {
   var videos = document.body.querySelectorAll('.video'),
       bg = document.body.querySelector('.bg'),
       btnAllCameras = document.querySelector('.btn-all-cameras');
   videos.forEach(function (video) {
       video.addEventListener('click', function () {
           video.classList.toggle('video-opened');
           bg.classList.toggle('bg-opened');
       });
   });
   btnAllCameras.addEventListener('click', function () {
       document.body.querySelector('.video-opened').classList.toggle('video-opened');
       bg.classList.toggle('bg-opened');
   });
})();