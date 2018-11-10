export default class Store {
    constructor(initialState, emitter) {
        // current state
        this.state = initialState || {};

        // event emitter
        this.emitter = emitter;
    }

    // call all callbacks with specified action type
    trigger(action) {
        this.emitter.emit(action.type, this.state);
    }

    // subscribe callback to execute when specified action dispatched
    subscribe(actionType, cb) {
        this.emitter.bind(actionType, cb);
    }

    // subscribe callback
    unsubscribe(actionType, cb) {
        this.emitter.unbind(actionType, cb);
    }

    // ONLY for dispatcher usage
    getStateForDispatcher() {
        return this.state;
    }

    // ONLY for reducers usage
    updateState(newState) {
        this.state = newState;
    }
}
