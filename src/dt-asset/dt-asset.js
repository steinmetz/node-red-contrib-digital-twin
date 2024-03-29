"use strict";
var dt_1 = require("../resources/dt");
module.exports = function (RED) {
    function DTAsset(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            var data = {
                property: msg.payload,
                assetId: _this.id,
            };
            dt_1.DT.events.emit(dt_1.DT.eventNames.updateAsset, data);
        });
    }
    ;
    RED.nodes.registerType('dt-asset', DTAsset);
};
//# sourceMappingURL=dt-asset.js.map