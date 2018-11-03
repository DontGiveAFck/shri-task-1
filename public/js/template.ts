(() => {
    const list: object[] = [
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
        const mq = (queryCheck: string) => {
            return window.matchMedia(queryCheck).matches;
        };

        if (("ontouchstart" in window)) {
            return true;
        }
        const query = ["(", prefixes.join("touch-enabled),("), "heartz", ")"].join("");
        return mq(query);
    }

    interface IData {
        artist: string | undefined;
        albumcover: string | undefined;
        buttons: string[] | undefined;
        track: {
            name: string | undefined,
            length: string | undefined,
        };
        volume: number | undefined;
        type: string | undefined;
        humidity: number | null;
        temperature: number | null;
        image: string | null;
    }

    interface IEvent {
        icon: string;
        title: string;
        source: string;
        type: string;
        time: string;
        description: string | null;
        data: IData | undefined;
        size: string;
    }

    addEvents(list);

    // add events that come from the server
    function addEvents(eventsList: object[]) {
        const input: {[events: string]: object[]} = {
            events: [],
        };
        input.events = eventsList;
        let isImageAdded = false;
        const template: HTMLTemplateElement | null = document.querySelector(".template");
        const events: HTMLElement | null = document.querySelector(".events");

        // events properties
        let eventContainer: DocumentFragment | null;
        let icon: HTMLElement | null;
        let title: HTMLElement | null;
        let source: HTMLElement | null;
        let time: HTMLElement | null;
        let description: HTMLElement | null;
        let btnNegative: HTMLElement | null;
        let btnPositive: HTMLElement | null;
        let btnsRow: HTMLElement | null;
        let humidity: HTMLElement | null;
        let temp: HTMLElement | null;
        let tempValue: HTMLElement | null;
        let humidityValue: HTMLElement | null;
        let tempHumidityRow: HTMLElement | null;
        let image: HTMLImageElement | null;
        let imageInfo: HTMLElement | null;
        let imageWrapper: HTMLElement | null;
        let trackIcon: HTMLImageElement | null;
        let trackLength: HTMLElement | null;
        let volumeRange: HTMLInputElement | null;
        let volumePercentage: HTMLElement | null;
        let music: HTMLElement | null;
        let data: HTMLElement | null;
        let trackTitle: HTMLElement | null;

        if (template) {

        }

        interface IEventIcons {
            [eventIcon: string]: string;
        }
        const eventIcons: IEventIcons = {
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
        const eventiki: IEvent[] = input.events as IEvent[];
        eventiki.forEach((event) => {
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

                if (eventContainer) {
                    const eventIcon: string | null = event.icon;
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
                        } else {
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

                        } else {
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

                        } else {
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
                                isImageAdded = true;
                                let wrapper: HTMLElement | null;
                                wrapper = eventContainer.querySelector(".image-wrapper");
                                if (wrapper) {
                                    wrapper.style.backgroundImage = 'url("images/sm.png")';
                                    wrapper.style.width = "100%";
                                }

                                image.style.visibility = "hidden";
                                image.style.pointerEvents = "none";
                            }

                            if (isTouchDevice() && !isImageAdded) {
                                if (imageInfo) {
                                    imageInfo.style.display = "flex";
                                }
                            }
                        } else {
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

                        } else {
                            if (music) {
                                music.remove();
                            }
                        }
                    } else {
                        if (data) {
                            data.remove();
                        }
                    }
                    if (events) {
                        events.appendChild(eventContainer);
                        if (events.lastElementChild) {
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
                                const arrowCross: HTMLImageElement | null = events.lastElementChild
                                    .querySelector(".arrow-cross");
                                if (arrowCross) {
                                    arrowCross.setAttribute("src", "images/cross-white.svg");
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    if (isTouchDevice()) {
        const icons: NodeListOf<HTMLImageElement> | null = document.body.querySelectorAll(".arrow-cross, .arrow-right");
        icons.forEach((icon) => {
            icon.style.display = "block";
        });
    }

    const iconMenu: HTMLElement | null = document.body.querySelector(".icon-menu");
    if (iconMenu) {
        iconMenu.addEventListener("click", () => {
            const menu: HTMLElement | null = document.body.querySelector("nav ul");
            if (menu) {
                menu.classList.toggle("menu-active");
            }
            iconMenu.classList.toggle("icon-menu-open");
            iconMenu.classList.toggle("icon-menu-close");
        });
    }

})();
