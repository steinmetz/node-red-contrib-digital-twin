import * as nodered from "node-red"

interface DTAssetNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTAsset(this: nodered.Node, config: DTAssetNodeDef): void {
        RED.nodes.createNode(this, config);
        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-asset', DTAsset);
};



