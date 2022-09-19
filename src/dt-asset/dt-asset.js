"use strict";
module.exports = function (RED) {
    function DTAsset(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            console.log('DTAsset input');
            console.log(msg);
            console.log(_this);
            // DT.events.emit(
            //     DT.eventNames.updateAsset,
            //     {
            //         property: msg.payload,
            //         assetId: this.id,
            //     }
            // );
        });
    }
    ;
    RED.nodes.registerType('dt-asset', DTAsset);
};
