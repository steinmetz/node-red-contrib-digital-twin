import * as nodered from "node-red"

interface DTRelationNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTRelation(this: nodered.Node, config: DTRelationNodeDef): void {
        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-relation', DTRelation);
};