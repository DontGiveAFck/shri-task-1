export default class Store {
    constructor(initialState, ...reducers) {
        // view controllers, that listen for state change
        this.subscribers = []; // example: [{actionType: 'action1', cb: doSomething()}]

        // functions, that describe how state will change on specified action
        this.reducers = [...reducers];

        // current state
        this.state = initialState || {};
    }

    dispatch(action) {
        // change state
        this.reducers.forEach((reducer) => {
            reducer(this.state, action);
        });

        // tell to all subscribers, that state has changed
        this.subscribers.forEach((subscriber) => {
            if (subscriber.actionType === action.type) {
                subscriber.cb(this.state);
            }
        });
    }

    // subscribe ViewController to state changing with specified action type
    subscribe(type, viewController) {
        this.subscribers.push({
            actionType: type,
            cb: viewController,
        });
    }

    updateState(newState) {
        this.state = newState;
    }

    // get current state
    getState() {
        return this.state;
    }
}
