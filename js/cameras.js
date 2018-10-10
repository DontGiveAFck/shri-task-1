(function () {

    class Particle {
        constructor (canvas, ctx) {
            this.canvas = canvas;
            this.x = this.random(this.canvas.width);
            this.y = this.random(this.canvas.height);
            this.level = 1 * this.random(4);
            this.speed = this.random(0.2, 1);
            this.radius = this.random(10, 70); //радиус частиц
            this.color = this.random(['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']); //цвет частицы
            this.opacity = this.random(0.2, 1);
            this.band = Math.floor(this.random(128));
            this.pulse = 5;
        }

        draw(ctx) {
            let pulsar, scale;
            pulsar = Math.exp(this.pulse);
            scale = pulsar * this.radius || this.radius;
            ctx.save();
            ctx.beginPath(); //Начинает отрисовку фигуры
            ctx.arc(this.x, this.y, scale, 0, Math.PI * 2);
            ctx.fillStyle = this.color; //цвет
            ctx.globalAlpha = this.opacity / this.level; //прозрачность
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = this.color; //цвет рамки
            ctx.stroke();
            ctx.restore();

            this.move();
        }
        move() {
            this.y -= this.speed * this.level;

            //Возвращаем в начало частицы которые ушли за пределы холста
            if (this.y < -100) {
                this.y = this.canvas.height;
            }
        }

        random (min, max) {
            if (this.isArray( min )) {
                return min[ ~~( Math.random() * min.length ) ];
            }
            if (!this.isNumber(max)) {
                max = min || 1, min = 0;
            }
            return min + Math.random() * ( max - min );
        }
    }

    class VolumeAnalyzer {
        constructor(canvas) {
            //canvas
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');

            //particles
            this.particles = [];

            //create audio context
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.video = document.body.querySelector('.opened-video');
            this.source = this.context.createMediaElementSource(this.video);
            this.node = this.context.createScriptProcessor(2048, 1, 1);

            //create analyzer
            this.analyzer = this.context.createAnalyser();
            this.analyzer.smoothingTimeConstant = 0.3;
            this.analyzer.fftSize = 512;

            this.bands = new Uint8Array(this.analyzer.frequencyBinCount);

            this.source.connect(this.analyzer);
            this.analyzer.connect(this.node);

            this.source = this.context.createMediaElementSource(this.video);
            this.source.connect(this.analyzer);
            this.analyzer.connect(this.node);

            this.node.connect(this.context.destination);
            this.source.connect(this.context.destination);

            this.node.onaudioprocess = () => {
                this.analyzer.getByteFrequencyData(this.bands);
                if(this.video.paused) {
                    if (typeof this.update === 'function') {
                        return this.update(this.bands);
                    } else {
                        return 0;
                    }
                }
            }

        }

        createParticles() {
            let particle = null;

            for (let i = 0; i < 50; i++) {
                particle = new Particle();
                this.particles.push(particle);
            }
            //Тут запускаем непосредственно ф-ю отрисовки
            setInterval(this.draw, 33);
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (let i = 0; i < 50; i++) {
                let loc = particles[i];
                loc.draw();
            }

        }
    }

    var videos = document.body.querySelectorAll('.video'),
       bg = document.body.querySelector('.bg'),
       btnAllCameras = document.querySelector('.btn-all-cameras'),
       brightnessRange = document.querySelector('.brightness input'),
       contrastRange = document.querySelector('.contrast input'),
       brightnessLabel = document.querySelector('.brightness span'),
       contrastLabel = document.querySelector('.contrast span'),
       volumeRange = document.querySelector('.volume input'),
       volumeLabel = document.querySelector('.volume span'),
       soundDiagram = document.querySelector('.sound-diagram');
   videos.forEach(function (video) {
       video.addEventListener('click', function () {
           video.classList.toggle('video-opened');
           video.muted = false;
           bg.classList.toggle('bg-opened');
       });
   });
   btnAllCameras.addEventListener('click', function () {
       var opened = document.body.querySelector('.video-opened');
       opened.classList.toggle('video-opened');
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
    document.body.querySelector('.video-opened').addEventListener('canplay', function () {
        console.log('can play');
    });

    var AudioContext = window.AudioContext || window.webkitAudioContext;

    if (AudioContext) {
    } else {
        alert('Браузер не поддерживает Web Audio API!');
    }

    function createParticles() {
        let particle = null, audio = null;
        for (let i = 0; i < 50; i++) {
            particle = new Particle();
            particles.push(particle);
        }
        elem = new Analyse();
        document.body.appendChild(elem.audio);
        audio.update = function (bands) {
            var ln = 50;
            while (ln--) {
                var loc = particles[ln];
                loc.pulse = bands[loc.band] / 256;
            }
        };
        setInterval(draw,33);
    }
})();