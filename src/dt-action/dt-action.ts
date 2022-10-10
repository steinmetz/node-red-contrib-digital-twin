import * as nodered from "node-red"
import { DT } from "../resources/dt";
import { DTActionNode, DTActionNodeDef, GraphMessage, DTActionCall } from "../resources/types";

export = (RED: nodered.NodeAPI): void => {
    function DTAction(this: DTActionNode, config: DTActionNodeDef): void {
        RED.nodes.createNode(this, config);
        this.call = config.call;
    };


    DT.events.on(DT.eventNames.actionCall, (msg: any) => {

        console.log('actionCall', msg);
         
    });


    RED.nodes.registerType('dt-action', DTAction);
};