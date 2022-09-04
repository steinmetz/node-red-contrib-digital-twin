"use strict";
var dt_1 = require("../resources/dt");
var graphNode;
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
function toCypher(assets, relations) {
    var cypher = createAssetsCypher(assets);
    // cypher += createRelationsCypher(relations);
    return cypher;
}
function createAssetsCypher(assets) {
    var propertyRelationName = 'hasProperty';
    var actionRelationName = 'hasAction';
    var eventRelationName = 'hasEvent';
    var cypher = [];
    var assetAliasCounter = 0;
    var propertyAliasCounter = 0;
    var actionAliasCounter = 0;
    for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
        var asset = assets_1[_i];
        assetAliasCounter++;
        var assetAlias = "a".concat(assetAliasCounter);
        cypher.push("MERGE (".concat(assetAlias, ":Asset {nodered_id: '").concat(asset.id, "'}) \n            SET ").concat(assetAlias, ".name = '").concat(asset.name, "',\n                ").concat(assetAlias, ".nodered_type = '").concat(asset.type, "'"));
        // if (asset.properties) {
        //     for (let property of asset.properties) {
        //         let proAlias = `p${propertyAliasCounter}`;
        //         cypher += ` MERGE (${proAlias}:Property {nodered_id: '${property.id}'}) 
        //                     SET ${proAlias}.name = '${property.name}',
        //                         ${proAlias}.a_context = '${property.aContext}',
        //                         ${proAlias}.a_id = '${property.aId}',
        //                         ${proAlias}.a_type = '${property.aType}',
        //                         ${proAlias}.access_group = '${property.accessGroup}',
        //                         ${proAlias}.nodered_type = '${property.type}'`;
        //         cypher += ` MERGE (${assetAlias})-[:${propertyRelationName}]->(${proAlias}) `;
        //         propertyAliasCounter++;
        //     }
        // }
        // if (asset.actions) {
        //     for (let action of asset.actions) {
        //         let actionAlias = `ac${actionAliasCounter}`;
        //         cypher += ` MERGE (${actionAlias}:Action {nodered_id: '${action.id}'}) 
        //                     SET ${actionAlias}.name = '${action.name}',
        //                         ${actionAlias}.a_context = '${action.aContext}',
        //                         ${actionAlias}.a_id = '${action.aId}',
        //                         ${actionAlias}.a_type = '${action.aType}',
        //                         ${actionAlias}.access_group = '${action.accessGroup}',
        //                         ${actionAlias}.nodered_type = '${action.type}'`;
        //         cypher += ` MERGE (${assetAlias})-[:${actionRelationName}]->(${actionAlias}) `;
        //         actionAliasCounter++;
        //     }
        // }
    }
    return cypher;
}
function createRelationsCypher(relations) {
    var cypher = '';
    var originCounter = 0;
    var targetCounter = 0;
    var originAlias = "ao".concat(originCounter);
    var targetAlias = "at".concat(targetCounter + 1);
    for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
        var relation = relations_1[_i];
        originCounter++;
        targetCounter++;
        var direction = getRelationDirectionCypher(relation.direction, relation.name);
        for (var _a = 0, _b = relation.origins; _a < _b.length; _a++) {
            var origin_1 = _b[_a];
            for (var _c = 0, _d = relation.targets; _c < _d.length; _c++) {
                var target = _d[_c];
                cypher += " MATCH (".concat(originAlias, ":Asset {nodered_id: '").concat(origin_1.id, "'}) \n                            MATCH (").concat(targetAlias, ":Asset {nodered_id: '").concat(target.id, "'}) \n                            MERGE (").concat(originAlias, ")").concat(direction, "(").concat(targetAlias, ")");
            }
        }
    }
    return cypher;
}
function getRelationDirectionCypher(direction, name) {
    if (direction == '-->')
        return "-[:".concat(name, "]->");
    if (direction == '<--')
        return "<-[:".concat(name, "]-");
    return "<-[:".concat(name, "]->");
}
module.exports = function (RED) {
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
            var relations = Array.from(relationsMap.values());
            var cypher = ['']; // toCypher(assets, relations);
            var payload = {
                'assets': assets,
                'relations': relations,
                'cypher': cypher
            };
            var message = {
                payload: payload,
            };
            graphNode.send(message);
        }
        else if (req.body.action == 'node_deleted') {
            //TODO: delete node from db 
            //      or keep it in memory for when deploy is called
        }
        else if (req.body.action == 'node_added') {
        }
        res.sendStatus(200);
    });
    dt_1.DT.events.on(dt_1.DT.eventNames.updateAsset, function (msg) {
        //TODO: update asset in graph
    });
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        graphNode = this;
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
