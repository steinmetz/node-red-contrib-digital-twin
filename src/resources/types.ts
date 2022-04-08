import * as nodered from "node-red"
/**
  * Defines node properties based on Json-ld standard
  *
  * @context should be serialized with '@' prefix
  *            https://www.w3.org/TR/json-ld11/#the-context
  * 
  * @a_id defined for not conflicting with nodered 'id'. 
  *        Should be serialized with '@' prefix
  *       https://www.w3.org/TR/json-ld11/#node-identifier-indexing
  * 
  */
export interface DTNodeDef extends nodered.NodeDef {
  context: string;
  a_id: string;
}

/**
  * 
  * @a_type used to define the DT type. 
  *     Generic: default
  *     Part: it is just a part of an asset
  *     defined by ISO23247: Product, Equipment, Material, Process, Facility,
  *                          Environment, Personnel, SupportingDocuments
  */
export interface DTAssetNodeDef extends DTNodeDef {
  dt_type: string;
}