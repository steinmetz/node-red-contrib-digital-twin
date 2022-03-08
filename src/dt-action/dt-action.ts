import * as nodered from "node-red"

interface DTActionNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTAction(this: nodered.Node, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-action', DTAction);
};