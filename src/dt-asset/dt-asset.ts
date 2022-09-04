import * as nodered from "node-red"
import { DT } from '../resources/dt'
import { DTAssetNode, DTAssetNodeDef } from '../resources/types'

export = (RED: nodered.NodeAPI): void => {
    function DTAsset(this: DTAssetNode, config: DTAssetNodeDef): void {        
        RED.nodes.createNode(this, config);
        this.on('input', (msg: any, send, done): void => {
            DT.events.emit(
                DT.eventNames.updateAsset,
                {
                    property: msg.payload,
                    assetId: this.id,
                }
            );
        });
    };
    RED.nodes.registerType('dt-asset', DTAsset);
};



