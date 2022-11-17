"use strict";
module.exports = function (RED) {
    function DTEvent(config) {
        RED.nodes.createNode(this, config);
        this.topic = config.topic;
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-event', DTEvent);
};
