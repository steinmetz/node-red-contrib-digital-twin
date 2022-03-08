"use strict";
module.exports = (RED) => {
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg, send, done) => {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
