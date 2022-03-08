"use strict";
module.exports = (RED) => {
    function DTRelation(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg, send, done) => {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-relation', DTRelation);
};
