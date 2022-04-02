import * as nodered from "node-red"
import { DT } from '../core/dt';

interface DTActionNodeDef extends nodered.NodeDef {
    bound_to: string
}

export = (RED: nodered.NodeAPI): void => {
    function DTGraph(this: nodered.Node, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);
        
        DT.events.on(DT.eventNames.updateAsset, (msg: any) => {
            console.log(msg);
        });

    };
    RED.nodes.registerType('dt-graph', DTGraph);
};