"use strict";
module.exports = function (RED) {
    function DTModel(config) {
        RED.nodes.createNode(this, config);
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-model', DTModel);
};
//# sourceMappingURL=dt-model.js.map