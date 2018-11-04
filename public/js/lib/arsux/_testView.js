import Store from './store.js';
//import Dispatcher from './dispatcher';

const store = new Store();
//const dispatcher = new Dispatcher(store);

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
        state.events = [...state.events, events];
        break;
    }
    default: return state;
    }
});
console.log('asd')
store.dispatch({
    type: 'ADD_EVENTS',
    data: {
        eventId: 1,
    },
});

console.log(store.getState())
