import { expect } from 'chai';
import Dispatcher from './dispatcher';
import Store from './store';

import Emitter from './emitter';

describe('Диспетчер инициализируется и обрабатывает хранилище', () => {
    it('Диспетчер добавляет редьюсер', () => {
        const emitter = new Emitter();
        const initialState = {
            'someProperty': 'someValue',
        };
        const store = new Store(initialState, emitter);
        const dispatcher = new Dispatcher(store);
        const reducer = (state, action) => {
            switch (action.type) {
            case 'OPEN_VIDEO': {
                store.updateState({
                    ...state,
                    openedVideo: action.payload,
                });
                break;
            }
            default: return state;
            }
        };

        dispatcher.addReducers(reducer);

        const reducers = dispatcher._getReducers();

        expect(reducers).to.include.members([reducer]);
    });

    it('Диспетчер удаляет редьюсер', () => {
        const emitter = new Emitter();
        const initialState = {
            'someProperty': 'someValue',
        };
        const store = new Store(initialState, emitter);
        const dispatcher = new Dispatcher(store);
        const reducer = (state, action) => {
            switch (action.type) {
            case 'TEST_TYPE': {
                store.updateState({
                    ...state,
                    somePayload: action.payload,
                });
                break;
            }
            default: return state;
            }
        };

        dispatcher.addReducers(reducer);
        dispatcher.removeReducer(reducer);

        const reducers = dispatcher._getReducers();

        expect(reducers).to.eql([]);
    });

    it('Диспетчер диспатчит экшены', () => {
        const emitter = new Emitter();
        const initialState = {
            'someProperty': 'someValue',
        };
        const store = new Store(initialState, emitter);
        const dispatcher = new Dispatcher(store);
        const reducer = (state, action) => {
            switch (action.type) {
            case 'TEST_TYPE': {
                store.updateState({
                    ...state,
                    somePayload: action.payload,
                });
                break;
            }
            default: return state;
            }
        };
        dispatcher.addReducers(reducer);

        dispatcher.dispatch({
            type: 'TEST_TYPE',
            payload: 'somepayload',
        });

        expect(store.state).to.eql({
            'someProperty': 'someValue',
            'somePayload': 'somepayload',
        });
    });
});
