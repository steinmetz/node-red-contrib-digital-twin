"use strict";
module.exports = function (RED) {
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
