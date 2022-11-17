import * as nodered from "node-red"
import { DTEventNode, DTEventNodeDef } from "../resources/types";


export = (RED: nodered.NodeAPI): void => {
    function DTEvent(this: DTEventNode, config: DTEventNodeDef): void {
        RED.nodes.createNode(this, config);
        this.topic = config.topic;
       
        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-event', DTEvent);
};