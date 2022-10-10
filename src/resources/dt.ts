import { EventEmitter } from 'events';

const _myEmitter = new EventEmitter();
export namespace DT {
    export namespace events {
        export const on = _myEmitter.on.bind(_myEmitter);
        export const emit = _myEmitter.emit.bind(_myEmitter);
        export const listenerCount = _myEmitter.listenerCount.bind(_myEmitter);
        export const listeners = _myEmitter.listeners.bind(_myEmitter);
    }
    export namespace eventNames {
        export const updateAsset = 'updateAsset';
        export const actionCall = 'actionCall';
    }
}