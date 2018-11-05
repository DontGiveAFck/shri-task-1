import Store from './store.js';

// create a reducer
const reducer = (state, action) => {
    switch (action.type) {
    case 'INIT_EVENTS': {
        state.events = action.payload;
        break;
    }
    case 'REMOVE_EVENT': {
        state.events.splice(action.payload, 1);
        break;
    }
    default: return state;
    }
};

// create store, add reducers to the store
const store = new Store(reducer);

// create a view controller
const viewController = (state) => {
    // events from the state
    const currentEvents = state.events;

    // do smth with events
    console.log('events', currentEvents);
};

// subscribe to state update
store.subscribe('INIT_EVENTS', viewController);
store.subscribe('REMOVE_EVENT', viewController);

// dispatch an action
store.dispatch({
    type: 'INIT_EVENTS',
    payload: [
        {
            id: '1',
            resource: 'Пылесос',
            time: '12.00',
        },
        {
            id: '2',
            resource: 'Холодильник',
            time: '12.00',
        },
        {
            id: '3',
            resource: 'Зубочистка',
            time: '12.00',
        },
    ],
});

store.dispatch({
    type: 'REMOVE_EVENT',
    payload: 2,
});
