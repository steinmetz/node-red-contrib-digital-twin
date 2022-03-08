import * as nodered from "node-red"

interface DTPropertyNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTProperty(this: nodered.Node, config: DTPropertyNodeDef): void {
        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-property', DTProperty);
};