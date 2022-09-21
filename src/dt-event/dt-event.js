"use strict";
function handleDeploy(nodes) {
    console.log('deploy');
}
module.exports = function (RED) {
    function DTEvent(config) {
        RED.nodes.createNode(this, config);
        RED.events.on("deploy", function (nodes) {
            return console.log("deploy");
        });
        RED.events.on("nodes:remove", function (node) {
            console.log("node removed");
        });
        this.on('close', function (removed, done) {
            RED.events.off("deploy", handleDeploy);
            done();
        });
        this.on('input', function (msg, send, done) {
            send(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-event', DTEvent);
};
