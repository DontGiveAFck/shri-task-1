export default class Dispatcher {
    constructor(store) {
        this._store = store;
        this._callbacks = {};
        this._isDispatching = false;
        this._isHandled = {};
        this._isPending = {};
        this._lastID = 1;
    }

    dispatch(action) {

    }
}
