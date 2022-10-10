"use strict";
var dt_1 = require("../resources/dt");
module.exports = function (RED) {
    function DTAction(config) {
        RED.nodes.createNode(this, config);
        this.call = config.call;
    }
    ;
    dt_1.DT.events.on(dt_1.DT.eventNames.actionCall, function (msg) {
        console.log('actionCall', msg);
    });
    RED.nodes.registerType('dt-action', DTAction);
};
