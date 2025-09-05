"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ControlTypes_1 = require("../stack/ControlTypes");
// Minimal BatchProcessor focused on deletes
var BatchProcessor = /** @class */ (function () {
    function BatchProcessor(initial) {
        this.history = [];
        // Ensure initial items have targetIndex
        this.history = initial.map(function (step) {
            return step.map(function (item, idx) { var _a; return (__assign(__assign({}, item), { targetIndex: (_a = item.targetIndex) !== null && _a !== void 0 ? _a : idx })); });
        });
    }
    BatchProcessor.prototype.getHistory = function () {
        return this.history;
    };
    BatchProcessor.prototype.applyBatch = function (batch) {
        var _a;
        var last = this.history[this.history.length - 1] || [];
        var next = last.map(function (item) { return (__assign({}, item)); });
        (_a = batch.deletes) === null || _a === void 0 ? void 0 : _a.forEach(function (_a) {
            var targetIndex = _a.targetIndex;
            if (targetIndex >= 0 && targetIndex < next.length) {
                next[targetIndex].state = ControlTypes_1.ControlItemState.PreRemove;
                next[targetIndex].targetIndex = targetIndex;
            }
            else {
                console.warn("Delete targetIndex ".concat(targetIndex, " out of bounds"));
            }
        });
        this.history.push(next);
    };
    return BatchProcessor;
}());
// --- Test ---
var initialArray = [
    { id: "item0", value: 10, state: ControlTypes_1.ControlItemState.Inserted },
    { id: "item1", value: 20, state: ControlTypes_1.ControlItemState.Inserted },
    { id: "item2", value: 30, state: ControlTypes_1.ControlItemState.Inserted },
];
// Wrap initial array in outer array to create history
var bp = new BatchProcessor([initialArray]);
// Apply delete on index 1
bp.applyBatch({ deletes: [{ targetIndex: 1 }] });
// Print results
console.log("Initial snapshot:", bp.getHistory()[0]);
console.log("After delete batch:", bp.getHistory()[1]);
