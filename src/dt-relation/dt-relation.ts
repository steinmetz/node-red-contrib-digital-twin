import * as nodered from "node-red"
import { DTRelationNode, DTRelationNodeDef } from "../resources/types";
 

export = (RED: nodered.NodeAPI): void => {
    function DTRelation(this: DTRelationNode, config: DTRelationNodeDef): void {

        this.isVirtual = false;

        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-relation', DTRelation);
};