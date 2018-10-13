(function () {
    var input = {
        "events": [
            {
                "type": "info",
                "title": "Еженедельный отчет по расходам ресурсов",
                "source": "Сенсоры потребления",
                "time": "19:00, Сегодня",
                "description": "Так держать! За последнюю неделю вы потратили на 10% меньше ресурсов, чем неделей ранее.",
                "icon": "stats",
                "data": {
                    "type": "graph",
                    "values": [
                        {
                            "electricity": [
                                ["1536883200", 115],
                                ["1536969600", 117],
                                ["1537056000", 117.2],
                                ["1537142400", 118],
                                ["1537228800", 120],
                                ["1537315200", 123],
                                ["1537401600", 129]
                            ]
                        },
                        {
                            "water": [
                                ["1536883200", 40],
                                ["1536969600", 40.2],
                                ["1537056000", 40.5],
                                ["1537142400", 41],
                                ["1537228800", 41.4],
                                ["1537315200", 41.9],
                                ["1537401600", 42.6]
                            ]
                        },
                        {
                            "gas": [
                                ["1536883200", 13],
                                ["1536969600", 13.2],
                                ["1537056000", 13.5],
                                ["1537142400", 13.7],
                                ["1537228800", 14],
                                ["1537315200", 14.2],
                                ["1537401600", 14.5]
                            ]
                        }
                    ]
                },
                "size": "l"
            },
            {
                "type": "info",
                "title": "Дверь открыта",
                "source": "Сенсор входной двери",
                "time": "18:50, Сегодня",
                "description": null,
                "icon": "key",
                "size": "s"
            },
            {
                "type": "info",
                "title": "Уборка закончена",
                "source": "Пылесос",
                "time": "18:45, Сегодня",
                "description": null,
                "icon": "robot-cleaner",
                "size": "s"
            },
            {
                "type": "info",
                "title": "Новый пользователь",
                "source": "Роутер",
                "time": "18:45, Сегодня",
                "description": null,
                "icon": "router",
                "size": "s"
            },
            {
                "type": "info",
                "title": "Изменен климатический режим",
                "source": "Сенсор микроклимата",
                "time": "18:30, Сегодня",
                "description": "Установлен климатический режим «Фиджи»",
                "icon": "thermal",
                "size": "m",
                "data": {
                    "temperature": 24,
                    "humidity": 80
                }
            },
            {
                "type": "critical",
                "title": "Невозможно включить кондиционер",
                "source": "Кондиционер",
                "time": "18:21, Сегодня",
                "description": "В комнате открыто окно, закройте его и повторите попытку",
                "icon": "ac",
                "size": "m"
            },
            {
                "type": "info",
                "title": "Музыка включена",
                "source": "Яндекс.Станция",
                "time": "18:16, Сегодня",
                "description": "Сейчас проигрывается:",
                "icon": "music",
                "size": "m",
                "data": {
                    "albumcover": "https://avatars.yandex.net/get-music-content/193823/1820a43e.a.5517056-1/m1000x1000",
                    "artist": "Florence & The Machine",
                    "track": {
                        "name": "Big God",
                        "length": "4:31"
                    },
                    "volume": 80
                }
            },
            {
                "type": "info",
                "title": "Заканчивается молоко",
                "source": "Холодильник",
                "time": "17:23, Сегодня",
                "description": "Кажется, в холодильнике заканчивается молоко. Вы хотите добавить его в список покупок?",
                "icon": "fridge",
                "size": "m",
                "data": {
                    "buttons": ["Да", "Нет"]
                }
            },
            {
                "type": "info",
                "title": "Зарядка завершена",
                "source": "Оконный сенсор",
                "time": "16:22, Сегодня",
                "description": "Ура! Устройство «Оконный сенсор» снова в строю!",
                "icon": "battery",
                "size": "s"
            },
            {
                "type": "critical",
                "title": "Пылесос застрял",
                "source": "Сенсор движения",
                "time": "16:17, Сегодня",
                "description": "Робопылесос не смог сменить свое местоположение в течение последних 3 минут. Похоже, ему нужна помощь.",
                "icon": "cam",
                "data": {
                    "image": "get_it_from_mocks_:3.jpg"
                },
                "size": "l"
            },
            {
                "type": "info",
                "title": "Вода вскипела",
                "source": "Чайник",
                "time": "16:20, Сегодня",
                "description": null,
                "icon": "kettle",
                "size": "s"
            }
        ]
    }

    var isImageAdded = false;

    var template = document.querySelector('.template');
    var events = document.querySelector('.events');
    var eventIcons = {
        'ac-white': 'images/ac-white.svg',
        'ac': 'images/ac-white.svg',
        'battery': 'images/battery.svg',
        'fridge': 'images/fridge.svg',
        'kettle': 'images/kettle.svg',
        'key': 'images/key.svg',
        'music': 'images/music.svg',
        'robot-cleaner': 'images/robot-cleaner.svg',
        'router': 'images/router.svg',
        'stats': 'images/stats.svg',
        'thermal': 'images/thermal.svg',
        'cam': 'images/cam-white.svg'
    }
    input.events.forEach(function (event, index) {
        var eventContainer = document.importNode(template.content, true);
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
                eventContainer.querySelector('.temp-value').textContent = event.data.temperature + ' C';
                eventContainer.querySelector('.humidity-value').textContent = event.data.humidity + ' %';
            } else {
                eventContainer.querySelector('.data .temp-humidity-row').remove();
            }
            if (event.data.type == 'graph') {
                eventContainer.querySelector('.image').setAttribute('src', 'images/Richdata.png');
            }
            if (event.data.image) {
                var img = eventContainer.querySelector('.image');
                img.setAttribute('src', 'images/md.png');
                img.setAttribute('srcset', 'images/sm.png 832w, images/lg.png 2496w');
                img.setAttribute('sizes', '(max-width: 648px) 832px, (min-width: 1600) 2496px');

                if(isTouchDevice() && !isImageAdded) {
                    isImageAdded = true;
                    var wrapper = eventContainer.querySelector('.image-wrapper');
                    wrapper.style.backgroundImage = 'url("images/sm.png")';
                    wrapper.style.width = '100%';
                    img.style.visibility = 'hidden';
                    img.style.pointerEvents = 'none';
                    eventContainer.querySelector('.image-info').style.display = 'flex';
                }
            } else {
                if(event.data.type != 'graph'){
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
                eventContainer.querySelector('.volume-percentage').textContent = event.data.volume + '%';
            } else {
                eventContainer.querySelector('.music').remove();
            }
        } else {
            eventContainer.querySelector('.data').remove();
        }
        events.appendChild(eventContainer);
        switch(event.size) {
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
            }
        }
        if (event.type == 'critical') {
            events.lastElementChild.classList.add('event-critical');
            events.lastElementChild.children[4].classList.add('event');
            events.lastElementChild.querySelector('.arrow-cross').setAttribute('src', 'images/cross-white.svg');
        }
    });

    function isTouchDevice() {
        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function(query) {
            return window.matchMedia(query).matches;
        }

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }

    if (isTouchDevice()) {
        var icons = document.body.querySelectorAll('.arrow-cross, .arrow-right');
        icons.forEach(function (icon) {
            icon.style.display = 'block';
        });
    }

    document.body.querySelector('.icon-menu').addEventListener('click', function () {
        document.body.querySelector('nav ul').classList.toggle('menu-active');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-open');
        document.body.querySelector('.icon-menu').classList.toggle('icon-menu-close');
    });
})();