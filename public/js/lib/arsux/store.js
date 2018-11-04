//import Dispatcher from './dispatcher';

//const dispatcher = new Dispatcher();

export default class Store {
    constructor() {
        this.subscribers = [];
        this.state = {};
    }

    //вызываю все reducerы, а они выполняют обработку данных, если типа подходит и возращают state.
    dispatch(action) {
        /* данные обновляются в завимистости от типа */

        this._changeState(action);
    }

    // регистрирую reducers
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    getState() {
        return this.state;
    }

    _changeState(action) {
        const oldState = this.getState();
    }
}
