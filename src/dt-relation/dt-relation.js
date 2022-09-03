"use strict";
module.exports = function (RED) {
    function DTRelation(config) {
        this.isVirtual = false;
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-relation', DTRelation);
};
