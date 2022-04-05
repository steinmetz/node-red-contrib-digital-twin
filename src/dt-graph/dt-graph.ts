import * as nodered from "node-red"
import { DT } from '../resources/dt';

interface DTActionNodeDef extends nodered.NodeDef {
    bound_to: string
}

interface Node {
    id: string,
    type: string,
    name: string,
    wires: string[],
    direction: string,
}
interface QueryMessage extends nodered.NodeMessage {
    query: string
}

var node: nodered.Node;

export = (RED: nodered.NodeAPI): void => {
    function DTGraph(this: nodered.Node, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);

        node = this;

        RED.httpNode.post('/dt-graph', (req, res) => {

            if (req.body.action == 'deploy') {

                let nodes = JSON.parse(req.body.nodes) as Node[];
                let assets = nodes.filter((node) => node.type == 'dt-asset');
                var query: QueryMessage;

                // for each asset, creates a query with its relations
                for (let asset of assets) {

                    let cypher = `MERGE (a:Asset {nodered_id: '${asset.id}'}) 
                                    SET a.name = '${asset.name}',
                                        a.nodered_type = '${asset.type}'`;

                    let connectedNodes = nodes.filter((node) => asset.wires[0].includes(node.id));

                    let label = 0;

                    for (let connectedNode of connectedNodes) {
                        if (connectedNode.type == 'dt-property') {
                            cypher += `\nMERGE (p${label}:Property {nodered_id: '${connectedNode.id}'}) 
                                        MERGE (a)-[:hasProperty]->(p${label}) 
                            SET p${label}.name = '${connectedNode.name}',
                                p${label}.nodered_type = '${connectedNode.type}'`;
                        } else if (connectedNode.type == 'dt-action') {
                            cypher += `\nMERGE (a${label}:Action {nodered_id: '${connectedNode.id}'}) 
                            MERGE (a)-[:hasAction]->(a${label}) 
                            SET a${label}.name = '${connectedNode.name}',
                                a${label}.nodered_type = '${connectedNode.type}'`;
                        } else if (connectedNode.type == 'dt-relation') {
                            let relationTarget = nodes.filter((node) => connectedNode.wires[0].includes(node.id));
                            let relationCypher = getRelationCypher(connectedNode.direction, connectedNode.name);
                            for (let target of relationTarget) {
                                cypher += `\nMERGE (t${label}:Asset {nodered_id: '${target.id}'})
                                MERGE (a)${relationCypher}(t${label})
                                SET t${label}.name = '${target.name}',
                                    t${label}.nodered_type = '${target.type}'`;
                                label++;
                            }
                        }
                        label++;
                    }
                    let nodesConnectedToAsset = nodes.filter((node) => node.wires[0].includes(asset.id));
                    for (let node of nodesConnectedToAsset) {
                        if (node.type == 'dt-property') {
                            cypher += `\nMERGE (p${label}:Property {nodered_id: '${node.id}'})
                                MERGE (a)-[:hasProperty]->(p${label})
                                SET p${label}.name = '${node.name}',
                                    p${label}.nodered_type = '${node.type}'`;
                        } else if (node.type == 'dt-action') {
                            cypher += `\nMERGE (a${label}:Action {nodered_id: '${node.id}'})
                                MERGE (a)-[:hasAction]->(a${label})
                                SET a${label}.name = '${node.name}',
                                    a${label}.nodered_type = '${node.type}'`;
                        } else if (node.type == 'dt-relation') {
                            let relationTarget = nodes.filter((node) => node.wires[0].includes(node.id));
                            let relationCypher = getRelationCypher(node.direction, node.name);
                            for (let target of relationTarget) {
                                cypher += `\nMERGE (t${label}:Asset {nodered_id: '${target.id}'})
                                    MERGE (a)${relationCypher}(t${label})
                                    SET t${label}.name = '${target.name}',
                                        t${label}.nodered_type = '${target.type}'`;
                                label++;
                            }
                        }
                        label++;
                    }
                    cypher += `\nRETURN a`;
                    query = {
                        query: cypher,
                        payload: cypher,
                    };
                    node.send(query);
                }
            }

            if (req.body.action == 'node_deleted') {
                //TODO: delete node from db 
                //      or keep it in memory for when deploy is called
            }
            if (req.body.action == 'node_added') {

            }
        });

        DT.events.on(DT.eventNames.updateAsset, (msg: any) => {
            //TODO: update asset in graph
        });

    };
    RED.nodes.registerType('dt-graph', DTGraph);
};

function  getRelationCypher(direction: string, name: string): string {
    if (direction == '-->') return `-[:${name}]->`;
    if (direction == '<--') return `<-[:${name}]-`;
    return `<-[:${name}]->`;
}