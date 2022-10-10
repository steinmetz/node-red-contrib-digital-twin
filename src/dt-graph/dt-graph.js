"use strict";
var dt_1 = require("../resources/dt");
var cypher_1 = require("../resources/cypher");
var cypherConverter = new cypher_1.Cypher();
var projectId = 'project1';
var graphNode;
function setupActions(assets, RED) {
    // for (let asset of assets) {
    //     client.on('steinmetz/' + asset.name, function (topic: any, message: any) {
    //         // message is Buffer
    //         console.log(message.toString())
    //         // client.end()
    //     })
    // }
    // client.on('steinmetz', function (topic: any, message: any) {
    //     // message is Buffer
    //     console.log(message.toString())
    //     // client.end()
    // })
}
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
            if (!asset.events)
                asset.actions = [];
            asset.events.push(node);
            break;
        case 'dt-model':
            break;
        case 'dt-relation':
            var relationNode_1 = node;
            var outgoingNodes = nodes.filter(function (n) { return relationNode_1.wires[0].includes(n.id); });
            var incomingNodes = nodes.filter(function (n) { return n.wires[0].includes(relationNode_1.id); });
            var isAssetsRelation = !(outgoingNodes.find(function (e) { return !e.type.startsWith('dt-asset'); }) &&
                incomingNodes.find(function (e) { return !e.type.startsWith('dt-asset'); }));
            if (isAssetsRelation) {
                relationsMap.set(node.id, {
                    id: relationNode_1.id,
                    name: relationNode_1.name,
                    direction: relationNode_1.direction,
                    origins: incomingNodes,
                    targets: outgoingNodes,
                });
            }
            break;
        default:
            throw new Error("Not allowed connection to ".concat(node.type));
    }
}
function modelToCypher(assets, relations) {
    return cypherConverter.convertAssetsRelations(assets, relations);
}
function deletedNodesCypher(nodes) {
    return cypherConverter.deletedNodesCypher(nodes);
}
function propertyToCypher(propertyNode) {
    return [cypherConverter.createDataPropertyCypher(propertyNode)];
}
module.exports = function (RED) {
    // receive updates from the Editor (model changes)
    RED.httpNode.post('/dt-graph', function (req, res) {
        if (req.body.action == 'deploy') {
            var deletedNodes = JSON.parse(req.body.deletedNodes);
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
                    var node = outGoingConnections_1[_a];
                    processNode(asset, node, nodes, relationsMap);
                }
                for (var _b = 0, inComingConnections_1 = inComingConnections; _b < inComingConnections_1.length; _b++) {
                    var node = inComingConnections_1[_b];
                    processNode(asset, node, nodes, relationsMap);
                }
                assets.push(asset);
            };
            for (var _i = 0, assetsNodes_1 = assetsNodes; _i < assetsNodes_1.length; _i++) {
                var assetNode = assetsNodes_1[_i];
                _loop_1(assetNode);
            }
            setupActions(assets, RED);
            var relations = Array.from(relationsMap.values());
            var cypher = modelToCypher(assets, relations);
            var deletedNodesC = deletedNodesCypher(deletedNodes);
            cypher.push.apply(cypher, deletedNodesC);
            var payload = {
                'model': {
                    'assets': assets,
                    'relations': relations,
                    'deletedNodes': deletedNodes
                },
                'cypher': cypher
            };
            var message = {
                payload: payload,
            };
            graphNode.send(message);
            deletedNodes = [];
        }
        else if (req.body.action == 'node_deleted') {
            // deletedNodes.push(req.body.node);
            //TODO: delete node from db 
            //      or keep it in memory for when deploy is called
        }
        else if (req.body.action == 'node_added') {
        }
        res.sendStatus(200);
    });
    dt_1.DT.events.on(dt_1.DT.eventNames.updateAsset, function (msg) {
        var property = msg.property;
        var cypher = propertyToCypher(property);
        var payload = {
            'data': {
                'asset_id': msg.assetId,
                'property': property
            },
            'cypher': cypher
        };
        var message = {
            payload: payload,
        };
        graphNode.send(message);
    });
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        graphNode = this;
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
