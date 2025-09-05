"use strict";
// ControlTypes.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlType = exports.ControlItemState = exports.getRandomColor = void 0;
var getRandomColor = function () { return "hsl(".concat(Math.floor(Math.random() * 360), ", 70%, 80%)"); };
exports.getRandomColor = getRandomColor;
var ControlItemState;
(function (ControlItemState) {
    ControlItemState["PreInsert"] = "PreInsert";
    ControlItemState["Inserted"] = "Inserted";
    ControlItemState["PreRemove"] = "PreRemove";
    ControlItemState["PreUpdate"] = "PreUpdate";
    ControlItemState["Removed"] = "Deleted";
})(ControlItemState || (exports.ControlItemState = ControlItemState = {}));
var ControlType;
(function (ControlType) {
    ControlType["Stack"] = "stack";
    ControlType["Array"] = "array";
})(ControlType || (exports.ControlType = ControlType = {}));
