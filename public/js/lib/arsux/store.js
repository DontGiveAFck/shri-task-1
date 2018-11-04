export default class Store {
    constructor() {
        this.subscribers = [];
        this.state = {};
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    emitStateChange(action) {
        this.subscribers.forEach(cb => cb(this.state, action));
    }

    getState() {
        return this.state;
    }


}
