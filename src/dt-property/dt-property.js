"use strict";
module.exports = function (RED) {
    function DTProperty(config) {
        RED.nodes.createNode(this, config);
        this.accessGroup = config.accessGroup;
        this.aContext = config.aContext;
        this.aId = config.aId;
        var node = this;
        this.on('input', function (msg, send, done) {
            node.value = msg.payload;
            var data = {
                payload: node,
            };
            send(data);
        });
    }
    ;
    RED.nodes.registerType('dt-property', DTProperty);
};
