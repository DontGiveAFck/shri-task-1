export default class Emitter {
    constructor() {
        this.events = {};
    }

    bind(event, cb) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(cb);
        return this;
    }

    unbind(event, cb) {
        let idx;

        if (typeof this.events[event] === 'object') {
            idx = this.events[event].indexOf(cb);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }

    emit(event, payload) {
        let i;
        let listeners;
        let length;
        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice();
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listeners[i].call(null, payload);
            }
        }
    }
}
