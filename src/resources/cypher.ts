import { DTAssetNodeDef, DTNodeDef, DTPropertyNodeDef, DTRelationNodeDef } from "./types";

export class Cypher {
    convertAssetsRelations(assets: DTAssetNodeDef[], relations: DTRelationNodeDef[]) {
        return [
            ...this.createAssetsCypher(assets),
            ...this.createRelationsCypher(relations)
        ];

    }

    // TODO: just set the node as deleted and not delete it
    deletedNodesCypher(nodes: DTNodeDef[]) {
        let cypher: string[] = [];
        for (let node of nodes) {
            if (node.type == 'dt-asset') {
                cypher.push(`MATCH (n:Asset {nodered_id: "${node.id}"}) DETACH DELETE n`);
            } else if (node.type == 'dt-property') {
                cypher.push(`MATCH (n:Property {nodered_id: "${node.id}"}) DETACH DELETE n`);
            } else if (node.type == 'dt-action') {
                cypher.push(`MATCH (n:Action {nodered_id: "${node.id}"}) DETACH DELETE n`);
            } else if (node.type == 'dt-event') {
                cypher.push(`MATCH (n:Event {nodered_id: "${node.id}"}) DETACH DELETE n`);
            }
        }
        return cypher;
    }

    createAssetsCypher(assets: DTAssetNodeDef[]) {
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

            if (asset.properties) {
                for (let property of asset.properties) {
                    let proAlias = `p${propertyAliasCounter}`;
                    cypher.push(this.createPropertyCypher(property, proAlias));
                    cypher.push(` MERGE (${assetAlias})-[:${propertyRelationName}]->(${proAlias}) `);
                    propertyAliasCounter++;
                }
            }
            if (asset.actions) {
                for (let action of asset.actions) {
                    let actionAlias = `ac${actionAliasCounter}`;
                    cypher.push(` MERGE (${actionAlias}:Action {nodered_id: '${action.id}'}) 
                                SET ${actionAlias}.name = '${action.name}',
                                    ${actionAlias}.a_context = '${action.aContext}',
                                    ${actionAlias}.a_id = '${action.aId}',
                                    ${actionAlias}.a_type = '${action.aType}',
                                    ${actionAlias}.access_group = '${action.accessGroup}',
                                    ${actionAlias}.nodered_type = '${action.type}'`);
                    cypher.push(` MERGE (${assetAlias})-[:${actionRelationName}]->(${actionAlias}) `);
                    actionAliasCounter++;
                }
            }
        }
        return cypher;
    }

    createDataPropertyCypher(property: DTPropertyNodeDef) {
        return `MERGE (p:Property {nodered_id: '${property.id}'}) 
        SET p.value = '${property.value}'`;
    }

    createPropertyCypher(property: DTPropertyNodeDef, proAlias: string = 'p') {
        return `MERGE (${proAlias}:Property {nodered_id: '${property.id}'}) 
        SET ${proAlias}.name = '${property.name}',
            ${proAlias}.a_context = '${property.aContext}',
            ${proAlias}.a_id = '${property.aId}',
            ${proAlias}.a_type = '${property.aType}',
            ${proAlias}.access_group = '${property.accessGroup}',
            ${proAlias}.nodered_type = '${property.type}'`;
    }

    createRelationsCypher(relations: DTRelationNodeDef[]) {
        let cypher: string[] = [];
        let originCounter = 0;
        let targetCounter = 0;
        let originAlias = `ao${originCounter}`;
        let targetAlias = `at${targetCounter + 1}`;

        for (let relation of relations) {
            originCounter++;
            targetCounter++;
            let direction = this.getRelationDirectionCypher(relation.direction, relation.name);
            for (let origin of relation.origins!) {
                for (let target of relation.targets!) {
                    cypher.push(
                        ` MATCH (${originAlias}:Asset {nodered_id: '${origin.id}'}) 
                                MATCH (${targetAlias}:Asset {nodered_id: '${target.id}'}) 
                                MERGE (${originAlias})${direction}(${targetAlias})`);
                }
            }
        }
        return cypher;
    }

    getRelationDirectionCypher(direction: string, name: string): string {
        if (direction == '-->') return `-[:${name}]->`;
        if (direction == '<--') return `<-[:${name}]-`;
        return `<-[:${name}]->`;
    }


}