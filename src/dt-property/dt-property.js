"use strict";
module.exports = function (RED) {
    function DTProperty(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            var _a;
            var data = {
                propertyName: (_a = _this.name) !== null && _a !== void 0 ? _a : '',
                propertyValue: msg.payload,
                propertyId: _this.id,
            };
            send(data);
        });
    }
    ;
    RED.nodes.registerType('dt-property', DTProperty);
};
