# NodeRED Digital Twins

A set of NodeRED nodes for modeling Digital Twins.

<img width="568" alt="nodes (1)" src="https://user-images.githubusercontent.com/3587083/186910297-93557df9-84fe-4acc-8540-dfb9214688f8.png">


# Nodes
- **dt-asset:** represents an observable asset from the real world. It can be composed by other assets.
- **dt-event:** events can happen internally or externally and can be used to trigger actions or change properties.
- **dt-action:** an asset can have actuation methods such as ``open()``, ``close()``...
- **dt-property:** used to define a property of an asset (``temperature``, ``humidity``...)
- **dt-relation:** it can be used to (semantically) represent the relation between two nodes.
- **dt-graph:** it watches the model and creates/updates a knowledge graph everytime the diagram is deployed.
##
