"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DT = void 0;
var events_1 = require("events");
var _myEmitter = new events_1.EventEmitter();
var DT;
(function (DT) {
    var events;
    (function (events) {
        events.on = _myEmitter.on.bind(_myEmitter);
        events.emit = _myEmitter.emit.bind(_myEmitter);
    })(events = DT.events || (DT.events = {}));
    var eventsNames;
    (function (eventsNames) {
        eventsNames.updateAsset = 'updateAsset';
    })(eventsNames = DT.eventsNames || (DT.eventsNames = {}));
})(DT = exports.DT || (exports.DT = {}));
