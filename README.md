# NodeRED Digital Twins

A set of NodeRED nodes for modeling Digital Twins.

![image](https://user-images.githubusercontent.com/3587083/157247342-44155974-7e15-4b30-b1fa-71f83dee05e3.png)


# Nodes
- **dt-asset:** represents an observable asset from the real world. It can be composed by other assets.
- **dt-event:** events can happen internally or externally and can be used to trigger actions or change properties.
- **dt-action:** an asset can have actuation methods such as ``open()``, ``close()``...
- **dt-property:** used to define a property of an asset (``temperature``, ``humidity``...)
- **dt-relation:** it can be used to (semantically) represent the relation between two nodes.
- **dt-graph:** it watches the model and creates/updates a knowledge graph everytime the diagram is deployed.
##
