import * as nodered from "node-red"
import { DT } from '../resources/dt'
interface DTAssetNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTAsset(this: nodered.Node, config: DTAssetNodeDef): void {
        RED.nodes.createNode(this, config);
        this.on('input', (msg: any, send, done): void => {
            DT.events.emit(
                DT.eventNames.updateAsset,
                {
                    property: msg,
                    assetId: this.id,
                }
            );
        });
    };
    RED.nodes.registerType('dt-asset', DTAsset);
};



