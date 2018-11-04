export default class Dispatcher {
    constructor(store) {
        this._store = store;
    }

    dispatch(action) {
        this._store.emitStateChange(action);
    }


}
