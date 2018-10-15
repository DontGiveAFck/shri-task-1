(function () {
    // get event list from the server
    window.onload = function () {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                return addEvents(JSON.parse(this.response));
            }
        };
        xhr.open('GET', `${document.location.protocol}//${document.location.host}/api/events${window.location.search}`);
        xhr.send();
    };

    function isTouchDevice() {
        const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        const mq = function (query) {
            return window.matchMedia(query).matches;
        };

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }
        const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }

    // add events that come from the server
    function addEvents(eventsList) {
        const input = {};
        input.events = eventsList;
        let isImageAdded = false;
        let template;
        template = document.querySelector('.template');
        const events = document.querySelector('.events');
        const eventIcons = {
            'ac-white': 'images/ac-white.svg',
            ac: 'images/ac-white.svg',
            battery: 'images/battery.svg',
            fridge: 'images/fridge.svg',
            kettle: 'images/kettle.svg',
            key: 'images/key.svg',
            music: 'images/music.svg',
            'robot-cleaner': 'images/robot-cleaner.svg',
            router: 'images/router.svg',
            stats: 'images/stats.svg',
            thermal: 'images/thermal.svg',
            cam: 'images/cam-white.svg',
        };

        // build template and append to the page
        input.events.forEach((event) => {
            const eventContainer = document.importNode(template.content, true);
            eventContainer.querySelector('.icon').setAttribute('src', eventIcons[event.icon]);
            eventContainer.querySelector('.title').textContent = event.title;
            eventContainer.querySelector('.source').textContent = event.source;
            eventContainer.querySelector('.time').textContent = event.time;
            if (event.description) {
                eventContainer.querySelector('.description').textContent = event.description;
            } else {
                eventContainer.querySelector('.description').remove();
            }
            if (event.data) {
                if (event.data.buttons) {
                    eventContainer.querySelector('.data .btn-positive').textContent = event.data.buttons[0];
                    eventContainer.querySelector('.data .btn-negative').textContent = event.data.buttons[1];
                } else {
                    eventContainer.querySelector('.data .buttons-row').remove();
                }
                if (event.data.humidity) {
                    eventContainer.querySelector('.humidity').textContent = 'Влажность:';
                    eventContainer.querySelector('.temp').textContent = 'Tемпература:';
                    eventContainer.querySelector('.temp-value').textContent = `${event.data.temperature} C`;
                    eventContainer.querySelector('.humidity-value').textContent = `${event.data.humidity} %`;
                } else {
                    eventContainer.querySelector('.data .temp-humidity-row').remove();
                }
                if (event.data.type === 'graph') {
                    eventContainer.querySelector('.image').setAttribute('src', 'images/Richdata.png');
                }
                if (event.data.image) {
                    const img = eventContainer.querySelector('.image');
                    img.setAttribute('src', 'images/md.png');
                    img.setAttribute('srcset', 'images/sm.png 832w, images/lg.png 2496w');
                    img.setAttribute('sizes', '(max-width: 648px) 832px, (min-width: 1600) 2496px');

                    if (isTouchDevice() && !isImageAdded) {
                        isImageAdded = true;
                        const wrapper = eventContainer.querySelector('.image-wrapper');
                        wrapper.style.backgroundImage = 'url("images/sm.png")';
                        wrapper.style.width = '100%';
                        img.style.visibility = 'hidden';
                        img.style.pointerEvents = 'none';
                        eventContainer.querySelector('.image-info').style.display = 'flex';
                    }
                } else {
                    if (event.data.type !== 'graph') {
                        eventContainer.querySelector('.image').remove();
                    }
                    eventContainer.querySelector('.image-wrapper').remove();
                    eventContainer.querySelector('.image-info').remove();
                }
                if (event.data.track) {
                    eventContainer.querySelector('.track-icon').setAttribute('src', event.data.albumcover);
                    eventContainer.querySelector('.track-title').textContent = `${event.data.artist} - ${event.data.track.name}`;
                    eventContainer.querySelector('.track-length').textContent = event.data.track.length;
                    eventContainer.querySelector('.volume-range').value = event.data.volume;
                    eventContainer.querySelector('.volume-percentage').textContent = `${event.data.volume}%`;
                } else {
                    eventContainer.querySelector('.music').remove();
                }
            } else {
                eventContainer.querySelector('.data').remove();
            }
            events.appendChild(eventContainer);
            switch (event.size) {
            case 'l': {
                events.lastElementChild.classList.add('event-l');
                break;
            }
            case 's': {
                events.lastElementChild.classList.add('event-s');
                break;
            }
            case 'm': {
                events.lastElementChild.classList.add('event-m');
                break;
            }
            default: {
                console.warn('smth wrong in input file');
            }
            }
            if (event.type === 'critical') {
                events.lastElementChild.classList.add('event-critical');
                events.lastElementChild.children[4].classList.add('event');
                events.lastElementChild.querySelector('.arrow-cross').setAttribute('src', 'images/cross-white.svg');
            }
        });
    }

    if (isTouchDevice()) {
        const icons = document.body.querySelectorAll('.arrow-cross, .arrow-right');
        icons.forEach((icon) => {
            icon.style.display = 'block';
        });
    }

    document.body.querySelector('.icon-menu').addEventListener('click', () => {
        document.body.querySelector('nav ul').classList.toggle('menu-active');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-open');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-close');
    });
}());
