"use strict";
(() => {
    const videos = document.body.querySelectorAll(".video");
    const bg = document.body.querySelector(".bg");
    const btnAllCameras = document.querySelector(".btn-all-cameras");
    const brightnessRange = document.querySelector(".brightness input");
    const contrastRange = document.querySelector(".contrast input");
    const brightnessLabel = document.querySelector(".brightness span");
    const contrastLabel = document.querySelector(".contrast span");
    const controlsPanel = document.querySelector(".controls-panel");
    const canvases = document.querySelectorAll(".sound-diagram");
    const btnAnalyzator = document.querySelector(".btn-analyzator");
    const lightingLevel = document.querySelector(".lighting");
    const sourceFlags = [];
    const sourceInstances = new Map();
    const analyzeInstances = [];
    let mediaElementSource;
    let stopLighting;
    let videoOpened = false;
    let openedCanvas = 0;
    // check audio context
    const Audio = AudioContext /*|| window.webkitAudioContext */;
    if (!Audio) {
        alert("Браузер не поддерживает Web Audio API!");
    }
    const context = new Audio();
    // full screen video
    function videoScreenFit(video) {
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
    function draw(data, ctx) {
        ctx.clearRect(0, 0, canvases[openedCanvas].width, canvases[openedCanvas].height);
        data.forEach((soundValue, i) => {
            ctx.fillStyle = `rgb(${soundValue + i / data.length}, ${(i / data.length)}, ${100})`;
            ctx.fillRect(((i * canvases[openedCanvas].width) / data.length) * 2, canvases[openedCanvas].height - soundValue / 4, (canvases[openedCanvas].width / data.length) * 2, soundValue);
        });
    }
    function getLightingLevel(video) {
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
    function analyzer(video) {
        // context creation
        const node = context.createScriptProcessor(2048, 1, 1);
        if (!sourceFlags.includes(video)) {
            mediaElementSource = context.createMediaElementSource(video);
            sourceFlags.push(video);
            sourceInstances.set(video, mediaElementSource);
        }
        else {
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
            const opened = document.body.querySelector(".video-opened");
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
        brightnessRange.addEventListener("input", function () {
            const openedVideo = document.body.querySelector(".video-opened");
            if (brightnessLabel) {
                brightnessLabel.innerText = this.value;
            }
            if (openedVideo) {
                openedVideo.style.filter = `brightness(${this.value}%)`;
            }
        });
    }
    if (contrastRange) {
        contrastRange.addEventListener("input", function () {
            const openedVideo = document.body.querySelector(".video-opened");
            if (contrastLabel) {
                contrastLabel.innerText = this.value;
            }
            if (openedVideo) {
                openedVideo.style.filter = `contrast(${this.value}%)`;
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
    const menu = document.body.querySelector(".menu");
    const iconMenu = document.body.querySelector(".icon-menu");
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
// init video streams
function initVideo(video, url) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        console.log(hls);
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    }
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = "https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8";
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    }
}
// urls of video streams
function getUrl(path) {
    if (document.location) {
        return encodeURIComponent(`${document.location.protocol}//${document.location.hostname}:${document.location.port}/streams/${path}/master.m3u8`);
    }
}
const video1 = document.querySelector("#video-1");
const video2 = document.querySelector("#video-2");
const video3 = document.querySelector("#video-3");
const video4 = document.querySelector("#video-4");
if (video1) {
    initVideo(video1, `http://localhost:9191/master?url=${getUrl("sosed")}`);
}
if (video2) {
    initVideo(video2, `http://localhost:9191/master?url=${getUrl("cat")}`);
}
if (video3) {
    initVideo(video3, `http://localhost:9191/master?url=${getUrl("dog")}`);
}
if (video4) {
    initVideo(video4, `http://localhost:9191/master?url=${getUrl("hall")}`);
}
(() => {
    // get event list from the server
    /*
    window.onload = () => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                return addEvents(JSON.parse(xhr.response));
            }
        };
        if (document.location) {
            xhr.open(
                "GET",
                `${document.location.protocol}//${document.location.host}/api/events${window.location.search}`,
            );
        }
        xhr.send();
    };
    */
    const list = [
        {
            type: "info",
            title: "Еженедельный отчет по расходам ресурсов",
            source: "Сенсоры потребления",
            time: "19:00, Сегодня",
            description: "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
            icon: "stats",
            data: {
                type: "graph",
                values: [
                    {
                        electricity: [
                            [
                                "1536883200",
                                115,
                            ],
                            [
                                "1536969600",
                                117,
                            ],
                            [
                                "1537056000",
                                117.2,
                            ],
                            [
                                "1537142400",
                                118,
                            ],
                            [
                                "1537228800",
                                120,
                            ],
                            [
                                "1537315200",
                                123,
                            ],
                            [
                                "1537401600",
                                129,
                            ],
                        ],
                    },
                    {
                        water: [
                            [
                                "1536883200",
                                40,
                            ],
                            [
                                "1536969600",
                                40.2,
                            ],
                            [
                                "1537056000",
                                40.5,
                            ],
                            [
                                "1537142400",
                                41,
                            ],
                            [
                                "1537228800",
                                41.4,
                            ],
                            [
                                "1537315200",
                                41.9,
                            ],
                            [
                                "1537401600",
                                42.6,
                            ],
                        ],
                    },
                    {
                        gas: [
                            [
                                "1536883200",
                                13,
                            ],
                            [
                                "1536969600",
                                13.2,
                            ],
                            [
                                "1537056000",
                                13.5,
                            ],
                            [
                                "1537142400",
                                13.7,
                            ],
                            [
                                "1537228800",
                                14,
                            ],
                            [
                                "1537315200",
                                14.2,
                            ],
                            [
                                "1537401600",
                                14.5,
                            ],
                        ],
                    },
                ],
            },
            size: "l",
        },
        {
            type: "info",
            title: "Дверь открыта",
            source: "Сенсор входной двери",
            time: "18:50, Сегодня",
            description: null,
            icon: "key",
            size: "s",
        },
        {
            type: "info",
            title: "Уборка закончена",
            source: "Пылесос",
            time: "18:45, Сегодня",
            description: null,
            icon: "robot-cleaner",
            size: "s",
        },
        {
            type: "info",
            title: "Новый пользователь",
            source: "Роутер",
            time: "18:45, Сегодня",
            description: null,
            icon: "router",
            size: "s",
        },
        {
            type: "info",
            title: "Изменен климатический режим",
            source: "Сенсор микроклимата",
            time: "18:30, Сегодня",
            description: "Установлен климатический режим «Фиджи»",
            icon: "thermal",
            size: "m",
            data: {
                temperature: "24",
                humidity: "80",
            },
        },
        {
            type: "critical",
            title: "Невозможно включить кондиционер",
            source: "Кондиционер",
            time: "18:21, Сегодня",
            description: "В комнате открыто окно, закройте его и повторите попытку",
            icon: "ac",
            size: "m",
        },
        {
            type: "info",
            title: "Музыка включена",
            source: "Яндекс.Станция",
            time: "18:16, Сегодня",
            description: "Сейчас проигрывается:",
            icon: "music",
            size: "m",
            data: {
                albumcover: "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
                artist: "Florence & The Machine",
                track: {
                    name: "Big God",
                    length: "4:31",
                },
                volume: "80",
            },
        },
        {
            type: "info",
            title: "Заканчивается молоко",
            source: "Холодильник",
            time: "17:23, Сегодня",
            description: "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
            icon: "fridge",
            size: "m",
            data: {
                buttons: [
                    "Да",
                    "Нет",
                ],
            },
        },
        {
            type: "info",
            title: "Зарядка завершена",
            source: "Оконный сенсор",
            time: "16:22, Сегодня",
            description: "Ура! Устройство «Оконный сенсор» снова в строю!",
            icon: "battery",
            size: "s",
        },
        {
            type: "critical",
            title: "Пылесос застрял",
            source: "Сенсор движения",
            time: "16:17, Сегодня",
            description: "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
            icon: "cam",
            data: {
                image: "get_it_from_mocks_:3.jpg",
            },
            size: "l",
        },
        {
            type: "info",
            title: "Вода вскипела",
            source: "Чайник",
            time: "16:20, Сегодня",
            description: null,
            icon: "kettle",
            size: "s",
        },
    ];
    // check, if device has a touch screen
    function isTouchDevice() {
        const prefixes = " -webkit- -moz- -o- -ms- ".split(" ");
        const mq = (queryCheck) => {
            return window.matchMedia(queryCheck).matches;
        };
        if (("ontouchstart" in window)) {
            return true;
        }
        const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
        return mq(query);
    }
    addEvents(list);
    // add events that come from the server
    function addEvents(eventsList) {
        const input = {
            events: [],
        };
        input.events = eventsList;
        let isImageAdded = false;
        const template = document.querySelector(".template");
        const events = document.querySelector(".events");
        // events properties
        let eventContainer;
        let icon;
        let title;
        let source;
        let time;
        let description;
        let btnNegative;
        let btnPositive;
        let btnsRow;
        let humidity;
        let temp;
        let tempValue;
        let humidityValue;
        let tempHumidityRow;
        let image;
        let imageInfo;
        let imageWrapper;
        let trackIcon;
        let trackLength;
        let volumeRange;
        let volumePercentage;
        let music;
        let data;
        let trackTitle;
        if (template) {
            eventContainer = document.importNode(template.content, true);
            icon = eventContainer.querySelector(".icon");
            title = eventContainer.querySelector(".title");
            source = eventContainer.querySelector(".source");
            time = eventContainer.querySelector(".time");
            description = eventContainer.querySelector(".description");
            btnNegative = eventContainer.querySelector(".data .btn-negative");
            btnPositive = eventContainer.querySelector(".data .btn-positive");
            btnsRow = eventContainer.querySelector(".buttons-row");
            humidity = eventContainer.querySelector(".humidity");
            temp = eventContainer.querySelector(".temp");
            tempValue = eventContainer.querySelector(".temp-value");
            humidityValue = eventContainer.querySelector(".humidity-value");
            tempHumidityRow = eventContainer.querySelector(".data .temp-humidity-row");
            image = eventContainer.querySelector(".data .image");
            imageInfo = eventContainer.querySelector(".image-info");
            imageWrapper = eventContainer.querySelector(".image-wrapper");
            trackIcon = eventContainer.querySelector(".track-icon");
            trackLength = eventContainer.querySelector(".track-length");
            volumeRange = eventContainer.querySelector(".volume-range");
            volumePercentage = eventContainer.querySelector("volume-percentage");
            music = eventContainer.querySelector(".music");
            data = eventContainer.querySelector(".data");
            trackTitle = eventContainer.querySelector(".track-title");
        }
        const eventIcons = {
            "ac": "images/ac-white.svg",
            "ac-white": "images/ac-white.svg",
            "battery": "images/battery.svg",
            "cam": "images/cam-white.svg",
            "fridge": "images/fridge.svg",
            "kettle": "images/kettle.svg",
            "key": "images/key.svg",
            "music": "images/music.svg",
            "robot-cleaner": "images/robot-cleaner.svg",
            "router": "images/router.svg",
            "stats": "images/stats.svg",
            "thermal": "images/thermal.svg",
        };
        // build template and append to the page
        input.events.forEach((event) => {
            if (template) {
                if (eventContainer) {
                    const eventIcon = event.icon;
                    if (icon && event.icon) {
                        icon.setAttribute("src", eventIcons[eventIcon]);
                    }
                    if (title) {
                        title.textContent = event.title;
                    }
                    if (source) {
                        source.textContent = event.source;
                    }
                    if (time) {
                        time.textContent = event.time;
                    }
                    if (description) {
                        if (event.description) {
                            description.textContent = event.description;
                        }
                        else {
                            description.remove();
                        }
                    }
                    if (event.data) {
                        if (event.data.buttons) {
                            if (btnPositive) {
                                btnPositive.textContent = event.data.buttons[0];
                            }
                            if (btnNegative) {
                                btnNegative.textContent = event.data.buttons[1];
                            }
                        }
                        else {
                            if (btnsRow) {
                                btnsRow.remove();
                            }
                        }
                        if (event.data.humidity) {
                            if (humidity) {
                                humidity.textContent = "Влажность:";
                            }
                            if (temp) {
                                temp.textContent = "Tемпература:";
                            }
                            if (tempValue) {
                                tempValue.textContent = `${event.data.temperature} C`;
                            }
                            if (humidityValue) {
                                humidityValue.textContent = `${event.data.humidity} %`;
                            }
                        }
                        else {
                            if (tempHumidityRow) {
                                tempHumidityRow.remove();
                            }
                        }
                        if (event.data.type === "graph") {
                            if (image) {
                                image.setAttribute("src", "images/Richdata.png");
                            }
                        }
                        if (event.data.image) {
                            if (image) {
                                image.setAttribute("src", "images/md.png");
                                image.setAttribute("srcset", "images/sm.png 832w, images/lg.png 2496w");
                                image.setAttribute("sizes", "(max-width: 648px) 832px, (min-width: 1600) 2496px");
                            }
                            if (isTouchDevice() && !isImageAdded) {
                                isImageAdded = true;
                                let wrapper;
                                wrapper = eventContainer.querySelector(".image-wrapper");
                                if (wrapper) {
                                    wrapper.style.backgroundImage = 'url("images/sm.png")';
                                    wrapper.style.width = "100%";
                                }
                                if (image) {
                                    image.style.visibility = "hidden";
                                    image.style.pointerEvents = "none";
                                }
                                if (imageInfo) {
                                    imageInfo.style.display = "flex";
                                }
                            }
                        }
                        else {
                            if (event.data.type !== "graph") {
                                if (image) {
                                    image.remove();
                                }
                            }
                            if (imageWrapper) {
                                imageWrapper.remove();
                            }
                            if (imageInfo) {
                                imageInfo.remove();
                            }
                        }
                        if (event.data.track) {
                            if (trackIcon && event.data.albumcover) {
                                trackIcon.setAttribute("src", event.data.albumcover);
                            }
                            if (trackTitle) {
                                trackTitle.textContent = `${event.data.artist} - ${event.data.track.name}`;
                            }
                            if (trackLength && event.data.track.length) {
                                trackLength.textContent = event.data.track.length;
                            }
                            if (volumeRange && event.data.volume) {
                                volumeRange.value = event.data.volume.toString();
                            }
                            if (volumePercentage && event.data.volume) {
                                volumePercentage.textContent = `${event.data.volume}%`;
                            }
                        }
                        else {
                            if (music) {
                                music.remove();
                            }
                        }
                    }
                    else {
                        if (data) {
                            data.remove();
                        }
                    }
                    if (events && events.lastElementChild) {
                        events.appendChild(eventContainer);
                        switch (event.size) {
                            case "l": {
                                events.lastElementChild.classList.add("event-l");
                                break;
                            }
                            case "s": {
                                events.lastElementChild.classList.add("event-s");
                                break;
                            }
                            case "m": {
                                events.lastElementChild.classList.add("event-m");
                                break;
                            }
                            default: {
                                console.warn("smth wrong in input file");
                            }
                        }
                        if (event.type === "critical") {
                            events.lastElementChild.classList.add("event-critical");
                            events.lastElementChild.children[4].classList.add("event");
                            const arrowCross = events.lastElementChild
                                .querySelector(".arrow-cross");
                            if (arrowCross) {
                                arrowCross.setAttribute("src", "images/cross-white.svg");
                            }
                        }
                    }
                }
            }
        });
    }
    if (isTouchDevice()) {
        const icons = document.body.querySelectorAll(".arrow-cross, .arrow-right");
        icons.forEach((icon) => {
            icon.style.display = "block";
        });
    }
    const iconMenu = document.body.querySelector(".icon-menu");
    if (iconMenu) {
        iconMenu.addEventListener("click", () => {
            const menu = document.body.querySelector("nav ul");
            if (menu) {
                menu.classList.toggle("menu-active");
            }
            iconMenu.classList.toggle("icon-menu-open");
            iconMenu.classList.toggle("icon-menu-close");
        });
    }
})();
