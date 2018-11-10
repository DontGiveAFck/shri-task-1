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
