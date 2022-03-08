import * as nodered from "node-red"

interface DTEventNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTEvent(this: nodered.Node, config: DTEventNodeDef): void {
        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-event', DTEvent);
};