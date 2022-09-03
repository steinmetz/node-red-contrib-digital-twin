"use strict";
var dt_1 = require("../resources/dt");
var node;
function processNode(asset, node, nodes, relationsMap) {
    switch (node.type) {
        case 'dt-property':
            if (!asset.properties)
                asset.properties = [];
            asset.properties.push(node);
            break;
        case 'dt-action':
            if (!asset.actions)
                asset.actions = [];
            asset.actions.push(node);
            break;
        case 'dt-event':
            break;
        case 'dt-model':
            break;
        case 'dt-relation':
            if (node.type == 'dt-relation') {
                var outgoingNodes = nodes.find(function (n) { return node.wires[0].includes(n.id); });
                var incomingNodes = nodes.find(function (n) { return n.wires[0].includes(asset.id); });
                relationsMap.set(node.id, {
                    id: node.id,
                    name: node.name,
                    direction: node.direction,
                    origins: [incomingNodes],
                    targets: [outgoingNodes]
                });
            }
            break;
        default:
            throw new Error("Not allowed connection to ".concat(node.type));
    }
}
module.exports = function (RED) {
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        node = this;
        // handle events coming from the editor 
        // mainly model changes
        RED.httpNode.post('/dt-graph', function (req, res) {
            if (req.body.action == 'deploy') {
                var assets = [];
                var relationsMap = new Map();
                var nodes = JSON.parse(req.body.nodes);
                var assetsNodes = nodes.filter(function (n) { return n.type.startsWith('dt-asset'); });
                if (assetsNodes.length == 0) {
                    throw new Error('No assets found');
                }
                var _loop_1 = function (assetNode) {
                    var asset = assetNode;
                    var outGoingConnections = nodes.filter(function (n) { return assetNode.wires[0].includes(n.id); });
                    var inComingConnections = nodes.filter(function (n) { return n.wires[0].includes(assetNode.id); });
                    for (var _a = 0, outGoingConnections_1 = outGoingConnections; _a < outGoingConnections_1.length; _a++) {
                        var node_1 = outGoingConnections_1[_a];
                        processNode(asset, node_1, nodes, relationsMap);
                    }
                    for (var _b = 0, inComingConnections_1 = inComingConnections; _b < inComingConnections_1.length; _b++) {
                        var node_2 = inComingConnections_1[_b];
                        processNode(asset, node_2, nodes, relationsMap);
                    }
                    assets.push(asset);
                };
                for (var _i = 0, assetsNodes_1 = assetsNodes; _i < assetsNodes_1.length; _i++) {
                    var assetNode = assetsNodes_1[_i];
                    _loop_1(assetNode);
                }
                var payload = {
                    'assets': assets,
                    'relations': Array.from(relationsMap.values()),
                };
                var message = {
                    payload: payload,
                };
                node.send(message);
            }
            else if (req.body.action == 'node_deleted') {
                //TODO: delete node from db 
                //      or keep it in memory for when deploy is called
            }
            else if (req.body.action == 'node_added') {
            }
        });
        dt_1.DT.events.on(dt_1.DT.eventNames.updateAsset, function (msg) {
            //TODO: update asset in graph
        });
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
