"use strict";
var dt_1 = require("../resources/dt");
var node;
module.exports = function (RED) {
    function DTGraph(config) {
        RED.nodes.createNode(this, config);
        node = this;
        RED.httpNode.post('/dt-graph', function (req, res) {
            if (req.body.action == 'deploy') {
                var nodes = JSON.parse(req.body.nodes);
                var assets = nodes.filter(function (node) { return node.type == 'dt-asset'; });
                var properties = nodes.filter(function (node) { return node.type == 'dt-asset'; });
                var methods = nodes.filter(function (node) { return node.type == 'dt-asset'; });
                for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
                    var method = methods_1[_i];
                }
                var query;
                var _loop_1 = function (asset) {
                    var cypher = "MERGE (a:Asset {nodered_id: '".concat(asset.id, "'}) \n                                    SET a.name = '").concat(asset.name, "',\n                                        a.nodered_type = '").concat(asset.type, "'");
                    var connectedNodes = nodes.filter(function (node) { return asset.wires[0].includes(node.id); });
                    var label = 0;
                    var _loop_2 = function (connectedNode) {
                        if (connectedNode.type == 'dt-property') {
                            cypher += "\nMERGE (p".concat(label, ":Property {nodered_id: '").concat(connectedNode.id, "'}) \n                                        MERGE (a)-[:hasProperty]->(p").concat(label, ") \n                            SET p").concat(label, ".name = '").concat(connectedNode.name, "',\n                                p").concat(label, ".nodered_type = '").concat(connectedNode.type, "'");
                        }
                        else if (connectedNode.type == 'dt-action') {
                            cypher += "\nMERGE (a".concat(label, ":Action {nodered_id: '").concat(connectedNode.id, "'}) \n                            MERGE (a)-[:hasAction]->(a").concat(label, ") \n                            SET a").concat(label, ".name = '").concat(connectedNode.name, "',\n                                a").concat(label, ".nodered_type = '").concat(connectedNode.type, "'");
                        }
                        else if (connectedNode.type == 'dt-relation') {
                            var relationTarget = nodes.filter(function (node) { return connectedNode.wires[0].includes(node.id); });
                            for (var _e = 0, relationTarget_2 = relationTarget; _e < relationTarget_2.length; _e++) {
                                var target = relationTarget_2[_e];
                                cypher += "\nMERGE (t".concat(label, ":Asset {nodered_id: '").concat(target.id, "'})\n                                MERGE (a)-[:").concat(connectedNode.name, "]->(t").concat(label, ")\n                                SET t").concat(label, ".name = '").concat(target.name, "',\n                                    t").concat(label, ".nodered_type = '").concat(target.type, "'");
                                label++;
                            }
                        }
                        label++;
                    };
                    for (var _b = 0, connectedNodes_1 = connectedNodes; _b < connectedNodes_1.length; _b++) {
                        var connectedNode = connectedNodes_1[_b];
                        _loop_2(connectedNode);
                    }
                    var nodesConnectedToAsset = nodes.filter(function (node) { return node.wires[0].includes(asset.id); });
                    for (var _c = 0, nodesConnectedToAsset_1 = nodesConnectedToAsset; _c < nodesConnectedToAsset_1.length; _c++) {
                        var node_1 = nodesConnectedToAsset_1[_c];
                        if (node_1.type == 'dt-property') {
                            cypher += "\nMERGE (p".concat(label, ":Property {nodered_id: '").concat(node_1.id, "'})\n                                MERGE (a)-[:hasProperty]->(p").concat(label, ")\n                                SET p").concat(label, ".name = '").concat(node_1.name, "',\n                                    p").concat(label, ".nodered_type = '").concat(node_1.type, "'");
                        }
                        else if (node_1.type == 'dt-action') {
                            cypher += "\nMERGE (a".concat(label, ":Action {nodered_id: '").concat(node_1.id, "'})\n                                MERGE (a)-[:hasAction]->(a").concat(label, ")\n                                SET a").concat(label, ".name = '").concat(node_1.name, "',\n                                    a").concat(label, ".nodered_type = '").concat(node_1.type, "'");
                        }
                        else if (node_1.type == 'dt-relation') {
                            var relationTarget = nodes.filter(function (node) { return node.wires[0].includes(node.id); });
                            for (var _d = 0, relationTarget_1 = relationTarget; _d < relationTarget_1.length; _d++) {
                                var target = relationTarget_1[_d];
                                cypher += "\nMERGE (t".concat(label, ":Asset {nodered_id: '").concat(target.id, "'})\n                                    MERGE (a)-[:").concat(node_1.name, "]->(t").concat(label, ")\n                                    SET t").concat(label, ".name = '").concat(target.name, "',\n                                        t").concat(label, ".nodered_type = '").concat(target.type, "'");
                                label++;
                            }
                        }
                        label++;
                    }
                    cypher += "\nRETURN a";
                    query = {
                        query: cypher,
                        payload: cypher,
                    };
                    node.send(query);
                };
                for (var _a = 0, assets_1 = assets; _a < assets_1.length; _a++) {
                    var asset = assets_1[_a];
                    _loop_1(asset);
                }
            }
            if (req.body.action == 'node_deleted') {
            }
            if (req.body.action == 'node_added') {
            }
        });
        dt_1.DT.events.on(dt_1.DT.eventNames.updateAsset, function (msg) {
            // console.log(msg);
        });
    }
    ;
    RED.nodes.registerType('dt-graph', DTGraph);
};
