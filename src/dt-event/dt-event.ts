import * as nodered from "node-red"

interface DTEventNodeDef extends nodered.NodeDef {
    bound_to: string
}

function handleDeploy(nodes: any){
    console.log('deploy');
 }

export = (RED: nodered.NodeAPI): void => {
    function DTEvent(this: nodered.Node, config: DTEventNodeDef): void {
        RED.nodes.createNode(this, config);

        RED.events.on('deploy', handleDeploy);
 
        this.on('close', (removed: boolean, done: any) => {
            RED.events.off("deploy", handleDeploy);
            done();
        });

        this.on('input', (msg: any, send, done): void => {
            send(msg);
        });
    };
    RED.nodes.registerType('dt-event', DTEvent);
};