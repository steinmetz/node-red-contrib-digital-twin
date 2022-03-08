"use strict";
module.exports = (RED) => {
    function DTAsset(config) {
        RED.nodes.createNode(this, config);
        this.on('input', (msg, send, done) => {
            send(msg);
            console.log(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-asset', DTAsset);
};