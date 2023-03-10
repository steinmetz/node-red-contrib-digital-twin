import * as nodered from "node-red"
import { DTModelNodeDef } from "../resources/types";



export = (RED: nodered.NodeAPI): void => {
    function DTState(this: nodered.Node, config: DTModelNodeDef): void {
        RED.nodes.createNode(this, config);

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-state', DTState);
};