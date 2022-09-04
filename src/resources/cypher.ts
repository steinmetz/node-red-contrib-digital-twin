import { DTAssetNodeDef, DTRelationNodeDef } from "./types";

export class Cypher {
    convertAssetsRelations(assets: DTAssetNodeDef[], relations: DTRelationNodeDef[]) {
        return [
            ...this.createAssetsCypher(assets),
            ...this.createRelationsCypher(relations)
        ];

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
                    cypher.push(` MERGE (${proAlias}:Property {nodered_id: '${property.id}'}) 
                                SET ${proAlias}.name = '${property.name}',
                                    ${proAlias}.a_context = '${property.aContext}',
                                    ${proAlias}.a_id = '${property.aId}',
                                    ${proAlias}.a_type = '${property.aType}',
                                    ${proAlias}.access_group = '${property.accessGroup}',
                                    ${proAlias}.nodered_type = '${property.type}'`);
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