import { expect } from 'chai';

import Store from './store';

import Emitter from './emitter';

describe('Хранилище создается и успешно обрабатывает состояние', () => {
    it('Хранилище создается и инициализирует пустое состояние', () => {
        const emitter = new Emitter();
        const store = new Store(null, emitter);

        const state = store.getStateForDispatcher();

        expect(state).to.eql({});
    });

    it('Хранилище создается и инициализирует заданное состояние', () => {
        const emitter = new Emitter();
        const expectedState = {
            'someProperty': 'someValue',
        };
        const store = new Store(expectedState, emitter);

        const state = store.getStateForDispatcher();

        expect(state).to.eql(expectedState);
    });
});
