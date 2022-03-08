"use strict";
module.exports = function (RED) {
    function DTProperty(config) {
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-property', DTProperty);
};
