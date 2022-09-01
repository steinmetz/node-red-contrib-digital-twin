"use strict";
var crypto_1 = require("crypto");
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
                id: (0, crypto_1.randomUUID)(),
                content: node,
            };
            if (node.name == 'temperature') {
                console.log('DTProperty node: ', node);
                console.log('DTProperty data: ', data);
            }
            send(data);
        });
    }
    ;
    RED.nodes.registerType('dt-property', DTProperty);
};
