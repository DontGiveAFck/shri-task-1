import { expect } from 'chai';

import Emitter from './emitter';

describe('Emitter успешно обрабатывает коллбэки и ивенты', () => {
    it('Успешно инициализируется', () => {
        const emitter = new Emitter();

        const expected = {
            'events': {},
        };

        expect(emitter).to.eql(expected);
    });

    it('Успешно добавляет коллбэки на ивенты', () => {
        const emitter = new Emitter();
        const callback = () => {
            console.log('I am callback');
        };
        const EVENT = 'SOME_EVENT';
        const expected = {
            'SOME_EVENT': [callback],
        };

        emitter.bind(EVENT, callback);

        expect(emitter.events).to.eql(expected);
    });

    it('Успешно удаляет коллбэки на ивенты', () => {
        const emitter = new Emitter();
        const callback = () => {
            console.log('I am callback');
        };
        const EVENT = 'SOME_EVENT';
        const expected = {
            'SOME_EVENT': [],
        };

        emitter.bind(EVENT, callback);
        emitter.unbind(EVENT, callback);

        expect(emitter.events).to.eql(expected);
    });

    it('Успешно вызывает коллбэки на ивенты', () => {
        const emitter = new Emitter();
        let resultPayload = null;
        const callback = (payload) => {
            resultPayload = payload;
        };
        const EVENT = 'SOME_EVENT';
        const payload = 'somePayload';

        emitter.bind(EVENT, callback);
        emitter.emit(EVENT, payload);

        expect(resultPayload).to.eql('somePayload');
    });
});
