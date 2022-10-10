import * as nodered from "node-red"




// NodeDef types
/**
  * Defines node properties based on Json-ld standard
  *
  * @aContext should be serialized with '@' prefix
  *            https://www.w3.org/TR/json-ld11/#the-context
  * 
  * @aId defined for not conflicting with nodered 'id'. 
  *        Should be serialized with '@' prefix
  *       https://www.w3.org/TR/json-ld11/#node-identifier-indexing
  * 
  * @aType defined for not conflicting with nodered 'type'. 
  *         This defines the type class of the node (schema.org, ...)
  * 
  */
export interface DTNodeDef extends nodered.NodeDef {
  aContext: string;
  aId: string;
  aType: string[];
  accessGroup: string;
}
/**
  * 
  * @aDTType used to define the DT type. 
  *     Generic: default
  *     Part: it is just a part of an asset
  *     defined by ISO23247: Product, Equipment, Material, Process, Facility,
  *                          Environment, Personnel, SupportingDocuments
  */
export interface DTAssetNodeDef extends DTNodeDef {
  aDTType: string;
  properties: DTPropertyNodeDef[];
  actions: DTActionNodeDef[];
  events: DTEventNodeDef[];
}

export interface DTModelNodeDef extends DTNodeDef {
}

export interface DTPropertyNodeDef extends DTNodeDef {
  value: any;
}

export interface DTActionNodeDef extends DTNodeDef {
  call: DTActionCall;
}

export interface DTEventNodeDef extends DTNodeDef {
}

export interface DTRelationNodeDef extends DTNodeDef {
  direction: string, //-->, <--, <-->
  origins?: DTNodeDef[],
  targets?: DTNodeDef[],
}
export interface DTVirtualRelationNodeDef<T> {
  id: string;
  name: string;
  direction: string;
  target: T;
}


// Node types
export interface DTNode extends nodered.Node {
  aContext: string;
  aId: string;
  aDTType: string[];
  aType: string[];
  accessGroup: string;
}
export interface DTAssetNode extends DTNode {
}
export interface DTPropertyNode extends DTNode {
  value: any;
}
export interface DTRelationNode extends DTNode {
  direction: string;
  isVirtual: boolean;
  target: any;
}

export interface DTActionNode extends DTNode {
  call: DTActionCall;
}


// Message types
export interface DTPropertyNodeMessage extends nodered.NodeMessage { }

export interface GraphMessage extends nodered.NodeMessage {
  cypher?: string[],
}

// general types
export interface DTActionCall{
  mqtt: DTActionCallMqtt;
}

interface DTActionCallMqtt{
  topic: string;
  payload: string;
}