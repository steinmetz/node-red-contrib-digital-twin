import { assert } from "console";
import { randomUUID } from "crypto";
import * as nodered from "node-red"
import { stringify } from "querystring";
import { DT } from '../resources/dt';
import { DTActionNodeDef, DTAssetNodeDef, DTPropertyNodeDef, DTVirtualRelationNodeDef, GraphMessage } from '../resources/types';

var node: nodered.Node;

export = (RED: nodered.NodeAPI): void => {
    function DTGraph(this: nodered.Node, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);

        node = this;

        // handle events coming from the editor 
        // mainly model changes
        RED.httpNode.post('/dt-graph', (req, res) => {

            if (req.body.action == 'deploy') {

                let assets: DTAssetNodeDef[] = [];


                let nodes = JSON.parse(req.body.nodes) as any[];
                let assetsNodes = nodes.filter(n => n.type.startsWith('dt-asset'));
                if (assetsNodes.length == 0) {
                    throw new Error('No assets found');
                }


                for (let assetNode of assetsNodes) {

                    let asset = assetNode as DTAssetNodeDef;

                    let outGoingConnections = nodes.filter(n => assetNode.wires[0].includes(n.id));
                    let inComingConnections = nodes.filter(n => n.wires[0].includes(assetNode.id));

                    for (let node of outGoingConnections) {
                        processNode(asset, node);
                    }
                    for (let node of inComingConnections) {
                        processNode(asset, node);
                    }
                    assets.push(asset);
                }

                let payload = {
                    'assets': assets,
                    'relations': [],
                };

                let message: GraphMessage = {
                    payload: payload,
                };
                node.send(message);

            } else if (req.body.action == 'node_deleted') {
                //TODO: delete node from db 
                //      or keep it in memory for when deploy is called
            } else if (req.body.action == 'node_added') {

            }
        });

        DT.events.on(DT.eventNames.updateAsset, (msg: any) => {
            //TODO: update asset in graph
        });

    };
    RED.nodes.registerType('dt-graph', DTGraph);
};

function processNode(asset: DTAssetNodeDef, node: any) {
    switch (node.type) {
        case 'dt-property':
            console.log(`${asset.name} has property ${node.name}`);
            if (!asset.properties) asset.properties = [];
            let virtualRelation = createVirtualRelation<DTPropertyNodeDef>(node as DTPropertyNodeDef, 'hasProperty');
            asset.properties.push(virtualRelation);
            break;
        case 'dt-model':
            break;
        case 'dt-action':
            break;
        case 'dt-relation':
            break;
        default:
            throw new Error(`Not allowed connection to ${node.type}`);
    }
}

function createVirtualRelation<T>(targetNode: any, name: string) {
    return {
        'id': randomUUID(),
        'name': name,
        'direction': '-->',
        'target': targetNode,
    } as DTVirtualRelationNodeDef<T>;
}

function getRelationCypher(direction: string, name: string): string {
    if (direction == '-->') return `-[:${name}]->`;
    if (direction == '<--') return `<-[:${name}]-`;
    return `<-[:${name}]->`;
}