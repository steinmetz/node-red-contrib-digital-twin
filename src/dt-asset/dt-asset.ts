import * as nodered from "node-red"
import { DT } from '../resources/dt'
import { DTAssetNode, DTAssetNodeDef } from '../resources/types'

export = (RED: nodered.NodeAPI): void => {
    function DTAsset(this: DTAssetNode, config: DTAssetNodeDef): void {
        RED.nodes.createNode(this, config);
        this.on('input', (msg: any, send, done): void => {
            this.on('input', (msg: any, send, done): void => {
                let data = {
                    property: msg.payload,
                    assetId: this.id,
                };
                if (RED.events.listenerCount(DT.eventNames.updateAsset) > 0) {
                    DT.events.emit(DT.eventNames.updateAsset, data);
                }
            });

        });
    };
    RED.nodes.registerType('dt-asset', DTAsset);
};



