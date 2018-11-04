import Store from './store.js';
import Dispatcher from './dispatcher.js';

const store = new Store();

const dispatcher = new Dispatcher(store);

// create an action
const events = [
    {
        id: 1,
        device: 'TV',
    },
];

store.subscribe((state, action) => {
    switch (action.type) {
    case 'ADD_EVENTS': {
        state.events = events;
        break;
    }
    case 'REMOVE_EVENT': {
        state.events = state.events.splice(action.payload.eventId, 1);
        break;
    }
    default: return state;
    }
});
console.log('state', store.getState());
dispatcher.dispatch({
    type: 'ADD_EVENTS',
    data: {
        eventId: 1,
    },
});

console.log(store.getState());

dispatcher.dispatch({
    type: 'REMOVE_EVENT',
    data: {
        eventId : 1,
    },
});

console.log(store.getState());
