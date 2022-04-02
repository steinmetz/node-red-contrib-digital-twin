"use strict";
var dt_1 = require("../core/dt");
module.exports = function (RED) {
    function DTAsset(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            dt_1.DT.events.emit(dt_1.DT.eventsNames.updateAsset, {
                property: msg,
                assetId: _this.id,
            });
        });
    }
    ;
    RED.nodes.registerType('dt-asset', DTAsset);
};
