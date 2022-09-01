import * as nodered from "node-red"
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
  */
export interface DTNodeDef extends nodered.NodeDef {
  aContext: string;
  aId: string;
  accessGroup: string;
}

export interface DTNode extends nodered.Node {
  aContext: string;
  aId: string;
  accessGroup: string;
}

interface DTNodeMessage<T> extends nodered.NodeMessage {
  id: string,
  content: T,
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
}

export interface DTModelNodeDef extends DTNodeDef { }

export interface DTPropertyNodeDef extends DTNodeDef { }

export interface DTPropertyNode extends DTNode {
  value: any;
}

export interface DTPropertyNodeMessage extends DTNodeMessage<DTPropertyNode> { }