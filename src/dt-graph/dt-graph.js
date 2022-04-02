"use strict";
var dt_1 = require("../core/dt");
module.exports = function (RED) {
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        // this.on('input', (msg: any, send, done): void => {
        //     send(msg);
        // });
        dt_1.DT.events.on(dt_1.DT.eventNames.updateAsset, function (msg) {
            console.log(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
