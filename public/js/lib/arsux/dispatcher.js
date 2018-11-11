export default class Dispatcher {
    constructor(...stores) {
        // function-reducers
        this.reducers = [];

        this.stores = stores;
    }

    // add reducer and call after action dispatch
    addReducers(cb) {
        this.reducers.push(cb);

        // return id of added callback
        return this.reducers.length - 1;
    }

    // remove callback by id
    removeReducer(id) {
        this.reducers.splice(id, 1);
    }

    // dispatch an action
    dispatch(action) {
        // dispatch an anction for all stores
        this.stores.forEach((store) => {
            this.reducers.forEach(cb => cb(store.getStateForDispatcher(), action));
            store.trigger(action);
        });
    }

    // get reducers
    _getReducers() {
        return this.reducers;
    }
}
