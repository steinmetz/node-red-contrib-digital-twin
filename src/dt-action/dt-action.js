"use strict";
var dt_1 = require("../resources/dt");
module.exports = function (RED) {
    function DTAction(config) {
        RED.nodes.createNode(this, config);
        this.topic = config.topic;
        this.payload = config.payload;
    }
    ;
    dt_1.DT.events.on(dt_1.DT.eventNames.actionCall, function (msg) {
        console.log('actionCall', msg);
    });
    RED.nodes.registerType('dt-action', DTAction);
};
//# sourceMappingURL=dt-action.js.map