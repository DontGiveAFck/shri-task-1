#### Жесты из 2 задания временно не работают т.к. данные карточек приходят с сервера (было реализовано в 4 задании)

# Запуск: <br>
npm i <br>
npm start <br>

Запускается сервер с nodejs(express) с тестовыми потоками

В директории public/ - клиентские файлы <br>
В директории server/ - серверные <br>
В корневой директории server.js <br>

## **Задание 7** - архитектура
Была реализована библиотека, основанная на flux подходе. <br>
Файлы библиотеки находятся здесь: <b>./public/js/lib/arsux </b>

#### API библиотеки
<b>class Store</b>
```

// при инициализации принимает начальное состояние и ивент эмиттер
    constructor(< initialState: null | object >, < emitter: object >)
// подписывает коллбэк на определенное событие, событие - action type
    subscribe(< actionType: string > , < cb: function >)
// отписывает коллбек от определенного события, событие - action type
    unsubscribe(< actionType: string >, < cb: function >)
    

// Методы, которые могут изменить состояние (использовать с осторожностью):

// возвращает объект состояния - используется только внутри диспетчера (не использовать во view!!!)
    getStateForDispatcher()
// обновляет состояние (использовать только внутри редьюсеров!!!)
    updateState(< newState: object >)
```

<b>class Dispatcher </b>
```
// при инициализации принимает аргументами хранилища
    constructor(< store1 : object, store2, ... >)
// принимает редьюсер, возвращает id редьюсера
    addReducers(< cb: function >)
// удаляет редьюсер по id
    removeReducer(< id: number >)
// диспатчит событие
    dispatch(< action: object >)
```
<b> class Emitter </b> <br>

Используется для вызова событий внутри библиотеки. Публичного API нет.

#### Пример работы: <br>
<b>Камеры во вкладке "Видеонаблюдение" при разворачивании и сворачивании обновляют состояние - сохраняют и вытаскивают brightness и contrast(Все примеры из проекта)</b> <br> <br>
При разворачивании и сворачивании видео в консоль логируется текущее состояние state. Например:
![alt text](https://image.ibb.co/c0LCXq/image.png)
<br> <br>
1.Объявляются reducers - функции, которые принимают текущее состояние и событие, возвращают новое (immutable) состояние в зависимости от поступившего события. <br>

```    
    const reducer = (state, action) => { 
             switch (action.type) {
                 case 'OPEN_VIDEO': {
                     store.updateState({
                         ...state,
                         openedVideo: action.payload
                     })
                     break;
                 }
                 case 'CLOSE_VIDEO': {
                     store.updateState({
                         ...state,
                         [action.payload.videoId]: {
                             brightness: action.payload.brightness,
                             contrast: action.payload.contrast,
                         },
                         openedVideo: false
                     });
                     break;
                 }
             }
         };
```

2.В начале файла импортируем Store, Emitter, Dispatcher:

```
import Store from "./lib/arsux/store.js";
import Dispatcher from "./lib/arsux/dispatcher.js";
import Emitter from "./lib/arsux/emitter.js";
```
3.Объявляем event emitter 
```
const emitter = new Emitter();
```
4.Далее по желанию объявляем начальное initialState состояние, если объявляем initialState,то в конструктор первым аргументом передаем его, если нет, то null - будет пустым. Следующими параметрами передаем event emitter:
```
    const initialState = {
        openedVideo: false,
        'video-1': {
            brightness: '100',
            contrast: '100'
        },
        'video-2': {
            brightness: '100',
            contrast: '100'
        },
        'video-3': {
            brightness: '100',
            contrast: '100'
        },
        'video-4': {
            brightness: '100',
            contrast: '100'
        },
    }

    const store = new Store(initialState, emitter);
```

5.Объявляем диспетчер и передаем store в конструктор
```
const dispatcher = new Dispatcher(store)
```
6.Вызываем addReducers и передаем функцию - редьюсер
```
dispatcher.addReducers(reducer);
```

7.Объявляем функции-обработчики (предположительно view controllers), которые будут слушать изменения в store по определенным событиям и вызываться после его изменения. Первым аргументом функции получают новое состояние:
```
    const openVideoController = (state) => {
        const video = document.querySelector(`#${state.openedVideo}`);

        video.style.filter = `brightness(${state[state.openedVideo].brightness}%)`;
        video.style.filter = `contrast(${state[state.openedVideo].contrast}%)`;
        brightnessRange.value = state[state.openedVideo].brightness;
        contrastRange.value = state[state.openedVideo].contrast;
        brightnessLabel.innerText = state[state.openedVideo].brightness;
        contrastLabel.innerText = state[state.openedVideo].contrast;

        console.log(state);
    };

    const closeVideoController = state => console.log(state);
```
8.Подписываем функции обработчики на изменения в store по определенным action, после которых они должны принимать новое состояние.
```
    store.subscribe('OPEN_VIDEO', openVideoController);
    store.subscribe('CLOSE_VIDEO', closeVideoController);
```

9.Далее "диспатчим экшены" используя dispatcher.dispatch(), передаем аргументом объект, который содержит свойства type - тип события и payload - что положить / изменить в state.
```
    dispatcher.dispatch({
        type: 'OPEN_VIDEO',
        payload: video.id
    });
```

```
    dispatcher.dispatch({
        type: "CLOSE_VIDEO",
        payload: {
            videoId: opened.id,
            brightness: brightnessRange.value,
            contrast: contrastRange.value,
        }
    });
```

### Тесты 
<b>Для запуска тестов: </b>
```
npm run test:flux
```

## **Задание 3**
перейти на http://localhost:8000/cameras.html
    
- Реализованы все обязательные пункты задания и определение освещенности из дополнительных.
- Отлаживал на условно последних браузерах Desktop Chrome, Android Chrome через Chrome dev tools - не возможности постоянно тестировать на моб. устройстве
- Использовал тестовые потоки - перенес их себе в проект.

# Пункты задания:
1. Страница-вкладка в интерфейсе умного дома "Видеонаблюдение"
 - Реализована анимация, которая почти похожа на превью
 - Анимацию реализовать только с использованием безопасных свойств (transform, opacity, filter)
 не получилось - изменял height, но двигал с помощью transfom: translate
 - При открытии видео есть кнопка "Все камеры", которая позволяет показать все видео

2. Фильтры для видео:
 - Реализовал фильтры с помощью css filter()
 
3. Анализатор звука
 - Использовал AudioContext для реализации, рисую на канвасе.
 Для открытия/закрытия нажать "Анализатор громкости" после развертывания видео.
 
4. Уровень освещенности показывается в открытом видео и обновляется каждую секунду.
 
## **Задание 4**


Релизованы все обязательные и дополнительные пункты задания
 
1. GET localhost:8000/status - аптайм сервера в формате hh:mm:ss
2. GET localhost:8000/api/events - отдает содержимое файла events.json (server/files/events.json)
Принимает параметр type, значения info и/или critical (например, localhost:8000/api/events?type=info:critical ивенты с типом info и critical)
Если хоть один тип будет некорректен - вернет ошибку 400.
3. POST localhost:8000/api/events - возвращает тоже самое что и GET, только параметры в теле запроса в формате xxx-url-encoded.
4. Другие роуты (кроме '/' и 'cameras.html' - нужны для реализации пункта 5) возвращают Page not found , code 404.
5. Соединил с версткой из первого задания - при открытии страницы localhost:8080 ajax GET запрос на 'api/events' - в параметрах также можно указывать type, limit, offset.
6. Пагинация на GET запросы параметры - limit и offset, например:
    http://localhost:8000?type=critical&offset=1&limit=1 - вернет критический ивент со сдвигом 1 и пределом 1.
    http://localhost:8000?offset=3&limit=5 - вернет 5 ивентов с любым типом со сдвигом 3.
На POST запросы тоже работает - параметры offset и limit указывать в теле xxx-url-enoceded, можно совмещать с type.
