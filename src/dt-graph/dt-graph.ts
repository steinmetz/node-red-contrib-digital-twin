import * as nodered from "node-red"
import { DT } from '../resources/dt';
import { DTActionNodeDef, DTAssetNodeDef, DTPropertyNodeDef, DTRelationNodeDef, GraphMessage } from '../resources/types';

var graphNode: nodered.Node;

export = (RED: nodered.NodeAPI): void => {

    RED.httpNode.post('/dt-graph', (req, res) => {

        if (req.body.action == 'deploy') {

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
            let cypher = [''];// toCypher(assets, relations);
            let payload = {
                'assets': assets,
                'relations': relations,
                'cypher': cypher
            };

            let message: GraphMessage = {
                payload: payload,
            };
            graphNode.send(message);

        } else if (req.body.action == 'node_deleted') {
            //TODO: delete node from db 
            //      or keep it in memory for when deploy is called
        } else if (req.body.action == 'node_added') {

        }
        res.sendStatus(200);
    });

    DT.events.on(DT.eventNames.updateAsset, (msg: any) => {
        //TODO: update asset in graph
    });


    function DTGraph(this: nodered.Node, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);
        graphNode = this;
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
            asset.actions.push(node as DTPropertyNodeDef);
            break;
        case 'dt-event':
            break;
        case 'dt-model':
            break;
        case 'dt-relation':
            if (node.type == 'dt-relation') {
                let outgoingNodes = nodes.find(n => node.wires[0].includes(n.id));
                let incomingNodes = nodes.find(n => n.wires[0].includes(asset.id));

                relationsMap.set(
                    node.id,
                    {
                        id: node.id,
                        name: node.name,
                        direction: node.direction,
                        origins: [incomingNodes],
                        targets: [outgoingNodes]
                    } as DTRelationNodeDef
                );
            }
            break;
        default:
            throw new Error(`Not allowed connection to ${node.type}`);
    }
}


function toCypher(assets: DTAssetNodeDef[], relations: DTRelationNodeDef[]) {

    let cypher = createAssetsCypher(assets);
    // cypher += createRelationsCypher(relations);

    return cypher;
}


function createAssetsCypher(assets: DTAssetNodeDef[]) {
    const propertyRelationName = 'hasProperty';
    const actionRelationName = 'hasAction';
    const eventRelationName = 'hasEvent';
    let cypher: string[] = [];

    let assetAliasCounter = 0;
    let propertyAliasCounter = 0;
    let actionAliasCounter = 0;




    for (let asset of assets) {
        assetAliasCounter++;
        let assetAlias = `a${assetAliasCounter}`;

        cypher.push(
            `MERGE (${assetAlias}:Asset {nodered_id: '${asset.id}'}) 
            SET ${assetAlias}.name = '${asset.name}',
                ${assetAlias}.nodered_type = '${asset.type}'`);

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

function createRelationsCypher(relations: DTRelationNodeDef[]) {
    let cypher = '';
    let originCounter = 0;
    let targetCounter = 0;
    let originAlias = `ao${originCounter}`;
    let targetAlias = `at${targetCounter + 1}`;

    for (let relation of relations) {
        originCounter++;
        targetCounter++;
        let direction = getRelationDirectionCypher(relation.direction, relation.name);
        for (let origin of relation.origins!) {
            for (let target of relation.targets!) {
                cypher += ` MATCH (${originAlias}:Asset {nodered_id: '${origin.id}'}) 
                            MATCH (${targetAlias}:Asset {nodered_id: '${target.id}'}) 
                            MERGE (${originAlias})${direction}(${targetAlias})`;
            }
        }
    }
    return cypher;
}

function getRelationDirectionCypher(direction: string, name: string): string {
    if (direction == '-->') return `-[:${name}]->`;
    if (direction == '<--') return `<-[:${name}]-`;
    return `<-[:${name}]->`;
}