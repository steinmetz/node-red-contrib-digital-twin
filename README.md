[![Platform Node-RED](http://b.repl.ca/v1/Platform-Node--RED-red.png)](https://flows.nodered.org/node/@digitaltwins/node-red-contrib-digital-twin)

# NodeRED nodes for modeling Digital Twins

A set of NodeRED nodes for modeling Digital Twins with semantics.

More information can be found here: [A methodology for creating semantic digital twin models supported by knowledge graphs](https://ieeexplore.ieee.org/document/9921499)


# Simple example
<img width="600" alt="nodes (1)" src="https://user-images.githubusercontent.com/3587083/188316228-9d59f0d5-caf5-4d2f-ac2a-54978500c380.png"> 



# Nodes
<img width="568" alt="nodes (1)" src="https://user-images.githubusercontent.com/3587083/186910297-93557df9-84fe-4acc-8540-dfb9214688f8.png">

- **dt-asset:** represents an observable asset from the real world. It can be composed by other assets.
- **dt-event:** events can happen internally or externally and can be used to trigger actions or change properties.
- **dt-action:** an asset can have actuation methods such as ``open()``, ``close()``...
- **dt-property:** used to define a property of an asset (``temperature``, ``humidity``...)
- **dt-relation:** it can be used to (semantically) represent the relation between two nodes.
- **dt-graph:** it watches the model and creates/updates a knowledge graph everytime the diagram is deployed.
##


## Citing
``` bibtex
@INPROCEEDINGS{steinmetz2022,  
author={Steinmetz, Charles and Schroeder, Greyce N. and Sulak, Adam and Tuna, Kaan and Binotto, Alecio and Rettberg, Achim and Pereira, Carlos Eduardo},  booktitle={2022 IEEE 27th International Conference on Emerging Technologies and Factory Automation (ETFA)},   
title={A methodology for creating semantic digital twin models supported by knowledge graphs},   
year={2022},
pages={1-7},  
doi={10.1109/ETFA52439.2022.9921499}
}
```
