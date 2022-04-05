import * as nodered from "node-red"

interface DTPropertyNodeDef extends nodered.NodeDef {
    bound_to: string
}

interface DTPropertyNodeMessage extends nodered.NodeMessage {
    propertyName: string,
    propertyValue: any,
    propertyId: string,
}

export = (RED: nodered.NodeAPI): void => {
    function DTProperty(this: nodered.Node, config: DTPropertyNodeDef): void {
        RED.nodes.createNode(this, config);
        this.on('input', (msg: any, send, done): void => {
            let data: DTPropertyNodeMessage = {
                propertyName: this.name ?? '',
                propertyValue: msg.payload,
                propertyId: this.id,
            };
            send(data);
        });

    };
    RED.nodes.registerType('dt-property', DTProperty);
};