"use strict";
module.exports = function (RED) {
    function DTAsset(config) {
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-asset', DTAsset);
};
