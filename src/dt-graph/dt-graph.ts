import * as nodered from "node-red"
import { DT } from '../resources/dt';
import { DTActionNodeDef, DTAssetNodeDef, DTEventNodeDef, DTGraphNode, DTGraphNodeDef, DTNodeDef, DTPropertyNodeDef, DTRelationNode, DTRelationNodeDef, GraphMessage } from '../resources/types';
import { Cypher } from '../resources/cypher';

const cypherConverter = new Cypher();

var graphNode: DTGraphNode;

export = (RED: nodered.NodeAPI): void => {

    // receive updates from the Editor (model changes)
    RED.httpNode.post('/dt-graph', (req, res) => {

        if (req.body.action == 'deploy') {

            let deletedNodes = JSON.parse(req.body.deletedNodes) as DTNodeDef[];
            let assets: DTAssetNodeDef[] = [];
            let relationsMap = new Map<string, any>();

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
                    processNode(asset, node, nodes, relationsMap);
                }
                for (let node of inComingConnections) {
                    processNode(asset, node, nodes, relationsMap);
                }
                assets.push(asset);
            }

            let relations = Array.from(relationsMap.values());
            let cypher = modelToCypher(assets, relations);
            let deletedNodesC = deletedNodesCypher(deletedNodes);
            cypher.push(...deletedNodesC);
            let payload = {
                'model': {
                    'projectName': graphNode.projectName,
                    'projectId': graphNode.projectId,
                    'version': graphNode.version,
                    'assets': assets,
                    'relations': relations,
                    'deletedNodes': deletedNodes
                },
                'cypher': cypher
            };

            let message: GraphMessage = {
                payload: payload,
            };
            graphNode.send(message);

            deletedNodes = [];


        } else if (req.body.action == 'node_deleted') {
            // deletedNodes.push(req.body.node);

            //TODO: delete node from db 
            //      or keep it in memory for when deploy is called
        } else if (req.body.action == 'node_added') {

        }
        res.sendStatus(200);
    });

    DT.events.on(DT.eventNames.updateAsset, (msg: any) => {

        let property = msg.property as DTPropertyNodeDef;
        let cypher = propertyToCypher(property);
        let payload = {
            'data': {
                'asset_id': msg.assetId,
                'property': property
            },
            'cypher': cypher
        };

        let message: GraphMessage = {
            payload: payload,
        };
        graphNode.send(message);
    });


    function DTGraph(this: DTGraphNode, config: DTGraphNodeDef): void {
        RED.nodes.createNode(this, config);
        graphNode = this as DTGraphNode;
        graphNode.projectName = config.projectName;
        graphNode.projectId = config.projectId;
        graphNode.version = config.version;
    };
    RED.nodes.registerType('dt-graph', DTGraph);
};

function processNode(asset: DTAssetNodeDef, node: any, nodes: any[], relationsMap: Map<string, any>) {
    switch (node.type) {
        case 'dt-property':
            if (!asset.properties) asset.properties = [];
            asset.properties.push(node as DTPropertyNodeDef);
            break;
        case 'dt-action':
            if (!asset.actions) asset.actions = [];
            asset.actions.push(node as DTActionNodeDef);
            break;
        case 'dt-event':
            if (!asset.events) asset.events = [];
            asset.events.push(node as DTEventNodeDef);
            break;
        case 'dt-model':
            break;
        case 'dt-relation':
            let relationNode = node;
            let outgoingNodes = nodes.filter(n => relationNode.wires[0].includes(n.id)) as DTNodeDef[];
            let incomingNodes = nodes.filter(n => n.wires[0].includes(relationNode.id)) as DTNodeDef[];

            let isAssetsRelation = !(
                outgoingNodes.find(e => !e.type.startsWith('dt-asset')) &&
                incomingNodes.find(e => !e.type.startsWith('dt-asset'))
            );

            if (isAssetsRelation) {
                relationsMap.set(
                    node.id,
                    {
                        id: relationNode.id,
                        name: relationNode.name,
                        direction: relationNode.direction,
                        origins: incomingNodes,
                        targets: outgoingNodes,
                    } as DTRelationNodeDef
                );
            }
            break;
        default:
            throw new Error(`Not allowed connection to ${node.type}`);
    }
}


function modelToCypher(assets: DTAssetNodeDef[], relations: DTRelationNodeDef[]) {
    return cypherConverter.convertAssetsRelations(assets, relations);
}

function deletedNodesCypher(nodes: DTNodeDef[]) {
    return cypherConverter.deletedNodesCypher(nodes);
}

function propertyToCypher(propertyNode: DTPropertyNodeDef) {
    return [cypherConverter.createDataPropertyCypher(propertyNode)];
}


