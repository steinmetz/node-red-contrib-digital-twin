"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cypher = void 0;
var Cypher = /** @class */ (function () {
    function Cypher() {
    }
    Cypher.prototype.convertAssetsRelations = function (assets, relations) {
        return __spreadArray(__spreadArray([], this.createAssetsCypher(assets), true), this.createRelationsCypher(relations), true);
    };
    Cypher.prototype.createAssetsCypher = function (assets) {
        var propertyRelationName = 'hasProperty';
        var actionRelationName = 'hasAction';
        var eventRelationName = 'hasEvent';
        var cypher = [];
        var assetAliasCounter = 0;
        var propertyAliasCounter = 0;
        var actionAliasCounter = 0;
        for (var _i = 0, assets_1 = assets; _i < assets_1.length; _i++) {
            var asset = assets_1[_i];
            assetAliasCounter++;
            var assetAlias = "a".concat(assetAliasCounter);
            cypher.push("MERGE (".concat(assetAlias, ":Asset {nodered_id: '").concat(asset.id, "'}) \n                SET ").concat(assetAlias, ".name = '").concat(asset.name, "',\n                    ").concat(assetAlias, ".nodered_type = '").concat(asset.type, "'"));
            if (asset.properties) {
                for (var _a = 0, _b = asset.properties; _a < _b.length; _a++) {
                    var property = _b[_a];
                    var proAlias = "p".concat(propertyAliasCounter);
                    cypher.push(" MERGE (".concat(proAlias, ":Property {nodered_id: '").concat(property.id, "'}) \n                                SET ").concat(proAlias, ".name = '").concat(property.name, "',\n                                    ").concat(proAlias, ".a_context = '").concat(property.aContext, "',\n                                    ").concat(proAlias, ".a_id = '").concat(property.aId, "',\n                                    ").concat(proAlias, ".a_type = '").concat(property.aType, "',\n                                    ").concat(proAlias, ".access_group = '").concat(property.accessGroup, "',\n                                    ").concat(proAlias, ".nodered_type = '").concat(property.type, "'"));
                    cypher.push(" MERGE (".concat(assetAlias, ")-[:").concat(propertyRelationName, "]->(").concat(proAlias, ") "));
                    propertyAliasCounter++;
                }
            }
            if (asset.actions) {
                for (var _c = 0, _d = asset.actions; _c < _d.length; _c++) {
                    var action = _d[_c];
                    var actionAlias = "ac".concat(actionAliasCounter);
                    cypher.push(" MERGE (".concat(actionAlias, ":Action {nodered_id: '").concat(action.id, "'}) \n                                SET ").concat(actionAlias, ".name = '").concat(action.name, "',\n                                    ").concat(actionAlias, ".a_context = '").concat(action.aContext, "',\n                                    ").concat(actionAlias, ".a_id = '").concat(action.aId, "',\n                                    ").concat(actionAlias, ".a_type = '").concat(action.aType, "',\n                                    ").concat(actionAlias, ".access_group = '").concat(action.accessGroup, "',\n                                    ").concat(actionAlias, ".nodered_type = '").concat(action.type, "'"));
                    cypher.push(" MERGE (".concat(assetAlias, ")-[:").concat(actionRelationName, "]->(").concat(actionAlias, ") "));
                    actionAliasCounter++;
                }
            }
        }
        return cypher;
    };
    Cypher.prototype.createRelationsCypher = function (relations) {
        var cypher = [];
        var originCounter = 0;
        var targetCounter = 0;
        var originAlias = "ao".concat(originCounter);
        var targetAlias = "at".concat(targetCounter + 1);
        for (var _i = 0, relations_1 = relations; _i < relations_1.length; _i++) {
            var relation = relations_1[_i];
            originCounter++;
            targetCounter++;
            var direction = this.getRelationDirectionCypher(relation.direction, relation.name);
            for (var _a = 0, _b = relation.origins; _a < _b.length; _a++) {
                var origin_1 = _b[_a];
                for (var _c = 0, _d = relation.targets; _c < _d.length; _c++) {
                    var target = _d[_c];
                    cypher.push(" MATCH (".concat(originAlias, ":Asset {nodered_id: '").concat(origin_1.id, "'}) \n                                MATCH (").concat(targetAlias, ":Asset {nodered_id: '").concat(target.id, "'}) \n                                MERGE (").concat(originAlias, ")").concat(direction, "(").concat(targetAlias, ")"));
                }
            }
        }
        return cypher;
    };
    Cypher.prototype.getRelationDirectionCypher = function (direction, name) {
        if (direction == '-->')
            return "-[:".concat(name, "]->");
        if (direction == '<--')
            return "<-[:".concat(name, "]-");
        return "<-[:".concat(name, "]->");
    };
    return Cypher;
}());
exports.Cypher = Cypher;
