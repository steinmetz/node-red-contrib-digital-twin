import { randomUUID } from "crypto";
import * as nodered from "node-red"
import { DTPropertyNode, DTPropertyNodeDef, DTPropertyNodeMessage } from "../resources/types";

export = (RED: nodered.NodeAPI): void => {
    function DTProperty(this: DTPropertyNode, config: DTPropertyNodeDef): void {
        RED.nodes.createNode(this, config);
        this.accessGroup = config.accessGroup;
        this.aContext = config.aContext;
        this.aId = config.aId;
        var node = this;
        this.on('input', (msg: any, send, done): void => {
            node.value = msg.payload;
            let data: DTPropertyNodeMessage = {
                id: randomUUID(),
                content: node,
            };
            send(data);
        });
    };
    RED.nodes.registerType('dt-property', DTProperty);
};