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


    //get template
    var template = document.querySelector('.template');

    //create sections with inside data for events in template
    for (var i = 0; i < input.events.length; i++) {

        var event = document.createElement('section');
        event.classList.add('event');
        // inside items into each event

        var insideItems = [
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div'),
            document.createElement('div')
        ];

        // add class for each inside item
        insideItems[2].classList.add('description');
        insideItems[3].classList.add('data');

        insideItems[0] = document.createElement('div');
        insideItems[0].classList.add('icon-title-row');
        insideItems[1] = document.createElement('div');
        insideItems[1].classList.add('source-time-row');

        var icon = document.createElement('div');
        icon.classList.add('icon');
        var title = document.createElement('div');
        title.classList.add('title');
        var source = document.createElement('div');
        source.classList.add('source');
        var time = document.createElement('div');
        time.classList.add('time');

        insideItems[0].appendChild(icon);
        insideItems[0].appendChild(title);

        insideItems[1].appendChild(source);
        insideItems[1].appendChild(time);


        // append inside items to event section

        if (input.events[i].type == 'critical') {
            console.log('critical');
            var criticalContent = document.createElement('div');
            criticalContent.classList.add('event');
            insideItems.forEach(function (item, index) {
                if (index >= 2) {
                    criticalContent.appendChild(item);
                } else {
                    event.appendChild(item);
                }
            });
            event.appendChild(criticalContent);
        } else {
            console.log(input.events[i].type)
            insideItems.forEach(function (item) {
                event.appendChild(item);
            });
        }

        // add section to template
        template.content.appendChild(event);
    }

    // get events
    var events = template.content.querySelectorAll('.event:not(div)');
    console.log(events);

    //add content in inside items
    events.forEach(function (event, index) {
        event.children[0].children[1].innerText = input.events[index].title;
        event.children[1].children[0].innerText = input.events[index].source;
        event.children[1].children[1].innerText = input.events[index].time;
        if (input.events[index].type == 'info') {
            event.children[0].children[0].classList.add('icon-' + input.events[index].icon);
            event.children[2].innerText = input.events[index].description;
        } else if(input.events[index].type == 'critical'){
            event.children[0].children[0].classList.add('icon-' + input.events[index].icon + '-white');
            console.log('description', input.events[index].description)
            event.children[2].children[0].innerText = input.events[index].description;
            event.classList.add('event-critical');
        }

        //parse data property
       if (input.events[index].data != undefined) {
           if (input.events[index].data.type == 'graph') {
               var graphImage = document.createElement('img');
               graphImage.classList.add('bg-graph');
               graphImage.setAttribute('src', 'images/Richdata.png');
               event.appendChild(graphImage);
           } else if(input.events[index].data.temperature != undefined) {
               var tempHumidityRow = document.createElement('div');
               tempHumidityRow.classList.add('temp-humidity-row');
               var temp = document.createElement('div');
               temp.classList.add('data');
               temp.innerText = 'Температура: ';
               var tempValue = document.createElement('span');
               tempValue.classList.add('value');
               tempValue.innerText = input.events[index].data.temperature + ' C';
               var humidity = document.createElement('div');
               humidity.classList.add('data');
               humidity.innerText = 'Влажность: ';
               var humidityValue = document.createElement('span');
               humidityValue.classList.add('value');
               humidityValue.innerText = input.events[index].data.humidity + ' %';

               temp.appendChild(tempValue);
               humidity.appendChild(humidityValue);
               tempHumidityRow.appendChild(temp);
               tempHumidityRow.appendChild(humidity);

               event.appendChild(tempHumidityRow);
           } else if (input.events[index].data.buttons != undefined) {
                var buttonsRow = document.createElement('div');
                buttonsRow.classList.add('buttons-row');
                var posBtn = document.createElement('div');
                posBtn.classList.add('btn', 'btn-positive');
                posBtn.innerText = 'Да';
                var negBtn = document.createElement('div');
                negBtn.classList.add('btn', 'btn-negative');
                negBtn.innerText = 'Нет';
                buttonsRow.appendChild(posBtn);
                buttonsRow.appendChild(negBtn);
                event.appendChild(buttonsRow);
           } else if (input.events[index].data.image != undefined) {
               var img = document.createElement('img');
               img.setAttribute('src', 'images/Richdata Graph Alternative.png');
               img.style.maxWidth = '100%';
               img.style.maxHeight = '100%';
               var innerEvent = event.lastChild;
               innerEvent.appendChild(img);
           }
       }

       // add size of an event
       switch (input.events[index].size) {
           case 's': {
               event.classList.add('event-s');
               break;
           }
           case 'm': {
               event.classList.add('event-m');
               break;
           }
           case 'l': {
               event.classList.add('event-l');
               break;
           }
       }
    });

    //extract template into var
    var eventList = document.importNode(template.content, true);
    //append content to the page
    document.querySelector('.events').appendChild(eventList);
})();