"use strict";

function handleDeploy(nodes) {
    console.log("deploy");
}

module.exports = function (RED) {
    function DTEvent(config) {
        RED.nodes.createNode(this, config);

        RED.events.on("deploy", handleDeploy);

        this.on("close", function (removed, done) {
            RED.events.off("deploy", handleDeploy);
            done();
        });
    }
    RED.nodes.registerType("dt-event", DTEvent);
};
