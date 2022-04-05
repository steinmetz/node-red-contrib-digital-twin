import { EventEmitter } from 'events';

const _myEmitter = new EventEmitter();

declare var foo: number;

export namespace DT {
    export namespace events {
        export const on = _myEmitter.on.bind(_myEmitter);
        export const emit = _myEmitter.emit.bind(_myEmitter);
    }
    export namespace eventNames {
        export const updateAsset = 'updateAsset';
    }
}