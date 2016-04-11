'use strict';var lang_1 = require('angular2/src/facade/lang');
var collection_1 = require('angular2/src/facade/collection');
// The names of these fields must be kept in sync with abstract_change_detector.ts or change
// detection will fail.
var _STATE_ACCESSOR = "state";
var _CONTEXT_ACCESSOR = "context";
var _PROP_BINDING_INDEX = "propertyBindingIndex";
var _DIRECTIVES_ACCESSOR = "directiveIndices";
var _DISPATCHER_ACCESSOR = "dispatcher";
var _LOCALS_ACCESSOR = "locals";
var _MODE_ACCESSOR = "mode";
var _PIPES_ACCESSOR = "pipes";
var _PROTOS_ACCESSOR = "protos";
exports.CONTEXT_ACCESSOR = "context";
// `context` is always first.
exports.CONTEXT_INDEX = 0;
var _FIELD_PREFIX = 'this.';
var _whiteSpaceRegExp = /\W/g;
/**
 * Returns `s` with all non-identifier characters removed.
 */
function sanitizeName(s) {
    return lang_1.StringWrapper.replaceAll(s, _whiteSpaceRegExp, '');
}
exports.sanitizeName = sanitizeName;
/**
 * Class responsible for providing field and local variable names for change detector classes.
 * Also provides some convenience functions, for example, declaring variables, destroying pipes,
 * and dehydrating the detector.
 */
var CodegenNameUtil = (function () {
    function CodegenNameUtil(_records, _eventBindings, _directiveRecords, _utilName) {
        this._records = _records;
        this._eventBindings = _eventBindings;
        this._directiveRecords = _directiveRecords;
        this._utilName = _utilName;
        /** @internal */
        this._sanitizedEventNames = new collection_1.Map();
        this._sanitizedNames = collection_1.ListWrapper.createFixedSize(this._records.length + 1);
        this._sanitizedNames[exports.CONTEXT_INDEX] = exports.CONTEXT_ACCESSOR;
        for (var i = 0, iLen = this._records.length; i < iLen; ++i) {
            this._sanitizedNames[i + 1] = sanitizeName("" + this._records[i].name + i);
        }
        for (var ebIndex = 0; ebIndex < _eventBindings.length; ++ebIndex) {
            var eb = _eventBindings[ebIndex];
            var names = [exports.CONTEXT_ACCESSOR];
            for (var i = 0, iLen = eb.records.length; i < iLen; ++i) {
                names.push(sanitizeName("" + eb.records[i].name + i + "_" + ebIndex));
            }
            this._sanitizedEventNames.set(eb, names);
        }
    }
    /** @internal */
    CodegenNameUtil.prototype._addFieldPrefix = function (name) { return "" + _FIELD_PREFIX + name; };
    CodegenNameUtil.prototype.getDispatcherName = function () { return this._addFieldPrefix(_DISPATCHER_ACCESSOR); };
    CodegenNameUtil.prototype.getPipesAccessorName = function () { return this._addFieldPrefix(_PIPES_ACCESSOR); };
    CodegenNameUtil.prototype.getProtosName = function () { return this._addFieldPrefix(_PROTOS_ACCESSOR); };
    CodegenNameUtil.prototype.getDirectivesAccessorName = function () { return this._addFieldPrefix(_DIRECTIVES_ACCESSOR); };
    CodegenNameUtil.prototype.getLocalsAccessorName = function () { return this._addFieldPrefix(_LOCALS_ACCESSOR); };
    CodegenNameUtil.prototype.getStateName = function () { return this._addFieldPrefix(_STATE_ACCESSOR); };
    CodegenNameUtil.prototype.getModeName = function () { return this._addFieldPrefix(_MODE_ACCESSOR); };
    CodegenNameUtil.prototype.getPropertyBindingIndex = function () { return this._addFieldPrefix(_PROP_BINDING_INDEX); };
    CodegenNameUtil.prototype.getLocalName = function (idx) { return "l_" + this._sanitizedNames[idx]; };
    CodegenNameUtil.prototype.getEventLocalName = function (eb, idx) {
        return "l_" + this._sanitizedEventNames.get(eb)[idx];
    };
    CodegenNameUtil.prototype.getChangeName = function (idx) { return "c_" + this._sanitizedNames[idx]; };
    /**
     * Generate a statement initializing local variables used when detecting changes.
     */
    CodegenNameUtil.prototype.genInitLocals = function () {
        var declarations = [];
        var assignments = [];
        for (var i = 0, iLen = this.getFieldCount(); i < iLen; ++i) {
            if (i == exports.CONTEXT_INDEX) {
                declarations.push(this.getLocalName(i) + " = " + this.getFieldName(i));
            }
            else {
                var rec = this._records[i - 1];
                if (rec.argumentToPureFunction) {
                    var changeName = this.getChangeName(i);
                    declarations.push(this.getLocalName(i) + "," + changeName);
                    assignments.push(changeName);
                }
                else {
                    declarations.push("" + this.getLocalName(i));
                }
            }
        }
        var assignmentsCode = collection_1.ListWrapper.isEmpty(assignments) ? '' : assignments.join('=') + " = false;";
        return "var " + declarations.join(',') + ";" + assignmentsCode;
    };
    /**
     * Generate a statement initializing local variables for event handlers.
     */
    CodegenNameUtil.prototype.genInitEventLocals = function () {
        var _this = this;
        var res = [(this.getLocalName(exports.CONTEXT_INDEX) + " = " + this.getFieldName(exports.CONTEXT_INDEX))];
        this._sanitizedEventNames.forEach(function (names, eb) {
            for (var i = 0; i < names.length; ++i) {
                if (i !== exports.CONTEXT_INDEX) {
                    res.push("" + _this.getEventLocalName(eb, i));
                }
            }
        });
        return res.length > 1 ? "var " + res.join(',') + ";" : '';
    };
    CodegenNameUtil.prototype.getPreventDefaultAccesor = function () { return "preventDefault"; };
    CodegenNameUtil.prototype.getFieldCount = function () { return this._sanitizedNames.length; };
    CodegenNameUtil.prototype.getFieldName = function (idx) { return this._addFieldPrefix(this._sanitizedNames[idx]); };
    CodegenNameUtil.prototype.getAllFieldNames = function () {
        var fieldList = [];
        for (var k = 0, kLen = this.getFieldCount(); k < kLen; ++k) {
            if (k === 0 || this._records[k - 1].shouldBeChecked()) {
                fieldList.push(this.getFieldName(k));
            }
        }
        for (var i = 0, iLen = this._records.length; i < iLen; ++i) {
            var rec = this._records[i];
            if (rec.isPipeRecord()) {
                fieldList.push(this.getPipeName(rec.selfIndex));
            }
        }
        for (var j = 0, jLen = this._directiveRecords.length; j < jLen; ++j) {
            var dRec = this._directiveRecords[j];
            fieldList.push(this.getDirectiveName(dRec.directiveIndex));
            if (!dRec.isDefaultChangeDetection()) {
                fieldList.push(this.getDetectorName(dRec.directiveIndex));
            }
        }
        return fieldList;
    };
    /**
     * Generates statements which clear all fields so that the change detector is dehydrated.
     */
    CodegenNameUtil.prototype.genDehydrateFields = function () {
        var fields = this.getAllFieldNames();
        collection_1.ListWrapper.removeAt(fields, exports.CONTEXT_INDEX);
        if (collection_1.ListWrapper.isEmpty(fields))
            return '';
        // At least one assignment.
        fields.push(this._utilName + ".uninitialized;");
        return fields.join(' = ');
    };
    /**
     * Generates statements destroying all pipe variables.
     */
    CodegenNameUtil.prototype.genPipeOnDestroy = function () {
        var _this = this;
        return this._records.filter(function (r) { return r.isPipeRecord(); })
            .map(function (r) { return (_this._utilName + ".callPipeOnDestroy(" + _this.getPipeName(r.selfIndex) + ");"); })
            .join('\n');
    };
    CodegenNameUtil.prototype.getPipeName = function (idx) {
        return this._addFieldPrefix(this._sanitizedNames[idx] + "_pipe");
    };
    CodegenNameUtil.prototype.getDirectiveName = function (d) {
        return this._addFieldPrefix("directive_" + d.name);
    };
    CodegenNameUtil.prototype.getDetectorName = function (d) { return this._addFieldPrefix("detector_" + d.name); };
    return CodegenNameUtil;
})();
exports.CodegenNameUtil = CodegenNameUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWdlbl9uYW1lX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkaWZmaW5nX3BsdWdpbl93cmFwcGVyLW91dHB1dF9wYXRoLU15MEtZVTgxLnRtcC9hbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NvZGVnZW5fbmFtZV91dGlsLnRzIl0sIm5hbWVzIjpbInNhbml0aXplTmFtZSIsIkNvZGVnZW5OYW1lVXRpbCIsIkNvZGVnZW5OYW1lVXRpbC5jb25zdHJ1Y3RvciIsIkNvZGVnZW5OYW1lVXRpbC5fYWRkRmllbGRQcmVmaXgiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RGlzcGF0Y2hlck5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UGlwZXNBY2Nlc3Nvck5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJvdG9zTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXREaXJlY3RpdmVzQWNjZXNzb3JOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldExvY2Fsc0FjY2Vzc29yTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXRTdGF0ZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0TW9kZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJvcGVydHlCaW5kaW5nSW5kZXgiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0TG9jYWxOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldEV2ZW50TG9jYWxOYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldENoYW5nZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2VuSW5pdExvY2FscyIsIkNvZGVnZW5OYW1lVXRpbC5nZW5Jbml0RXZlbnRMb2NhbHMiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UHJldmVudERlZmF1bHRBY2Nlc29yIiwiQ29kZWdlbk5hbWVVdGlsLmdldEZpZWxkQ291bnQiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RmllbGROYW1lIiwiQ29kZWdlbk5hbWVVdGlsLmdldEFsbEZpZWxkTmFtZXMiLCJDb2RlZ2VuTmFtZVV0aWwuZ2VuRGVoeWRyYXRlRmllbGRzIiwiQ29kZWdlbk5hbWVVdGlsLmdlblBpcGVPbkRlc3Ryb3kiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0UGlwZU5hbWUiLCJDb2RlZ2VuTmFtZVV0aWwuZ2V0RGlyZWN0aXZlTmFtZSIsIkNvZGVnZW5OYW1lVXRpbC5nZXREZXRlY3Rvck5hbWUiXSwibWFwcGluZ3MiOiJBQUFBLHFCQUEyQywwQkFBMEIsQ0FBQyxDQUFBO0FBQ3RFLDJCQUEyQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBTzVFLDRGQUE0RjtBQUM1Rix1QkFBdUI7QUFDdkIsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQ2hDLElBQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDO0FBQ3BDLElBQU0sbUJBQW1CLEdBQUcsc0JBQXNCLENBQUM7QUFDbkQsSUFBTSxvQkFBb0IsR0FBRyxrQkFBa0IsQ0FBQztBQUNoRCxJQUFNLG9CQUFvQixHQUFHLFlBQVksQ0FBQztBQUMxQyxJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQztBQUNsQyxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUM7QUFDOUIsSUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQ2hDLElBQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDO0FBQ3JCLHdCQUFnQixHQUFHLFNBQVMsQ0FBQztBQUUxQyw2QkFBNkI7QUFDaEIscUJBQWEsR0FBRyxDQUFDLENBQUM7QUFDL0IsSUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDO0FBRTlCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDO0FBRTlCOztHQUVHO0FBQ0gsc0JBQTZCLENBQVM7SUFDcENBLE1BQU1BLENBQUNBLG9CQUFhQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxFQUFFQSxpQkFBaUJBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0FBQzVEQSxDQUFDQTtBQUZlLG9CQUFZLGVBRTNCLENBQUE7QUFFRDs7OztHQUlHO0FBQ0g7SUFVRUMseUJBQW9CQSxRQUF1QkEsRUFBVUEsY0FBOEJBLEVBQy9EQSxpQkFBd0JB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QUlBLENBQUNBLGVBQWVBLENBQUNBLGVBQWFBLENBQUNBLENBQUNBLElBQU1BLENBQUNBLENBQUNBO0lBQ3JEQSxDQUFDQTtJQUVEdkIseUNBQWVBLEdBQWZBLFVBQWdCQSxDQUFpQkEsSUFBWXdCLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLGNBQVlBLENBQUNBLENBQUNBLElBQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBQ25HeEIsc0JBQUNBO0FBQURBLENBQUNBLEFBN0pELElBNkpDO0FBN0pZLHVCQUFlLGtCQTZKM0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UmVnRXhwV3JhcHBlciwgU3RyaW5nV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXIsIE1hcH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcblxuaW1wb3J0IHtEaXJlY3RpdmVJbmRleH0gZnJvbSAnLi9kaXJlY3RpdmVfcmVjb3JkJztcblxuaW1wb3J0IHtQcm90b1JlY29yZH0gZnJvbSAnLi9wcm90b19yZWNvcmQnO1xuaW1wb3J0IHtFdmVudEJpbmRpbmd9IGZyb20gJy4vZXZlbnRfYmluZGluZyc7XG5cbi8vIFRoZSBuYW1lcyBvZiB0aGVzZSBmaWVsZHMgbXVzdCBiZSBrZXB0IGluIHN5bmMgd2l0aCBhYnN0cmFjdF9jaGFuZ2VfZGV0ZWN0b3IudHMgb3IgY2hhbmdlXG4vLyBkZXRlY3Rpb24gd2lsbCBmYWlsLlxuY29uc3QgX1NUQVRFX0FDQ0VTU09SID0gXCJzdGF0ZVwiO1xuY29uc3QgX0NPTlRFWFRfQUNDRVNTT1IgPSBcImNvbnRleHRcIjtcbmNvbnN0IF9QUk9QX0JJTkRJTkdfSU5ERVggPSBcInByb3BlcnR5QmluZGluZ0luZGV4XCI7XG5jb25zdCBfRElSRUNUSVZFU19BQ0NFU1NPUiA9IFwiZGlyZWN0aXZlSW5kaWNlc1wiO1xuY29uc3QgX0RJU1BBVENIRVJfQUNDRVNTT1IgPSBcImRpc3BhdGNoZXJcIjtcbmNvbnN0IF9MT0NBTFNfQUNDRVNTT1IgPSBcImxvY2Fsc1wiO1xuY29uc3QgX01PREVfQUNDRVNTT1IgPSBcIm1vZGVcIjtcbmNvbnN0IF9QSVBFU19BQ0NFU1NPUiA9IFwicGlwZXNcIjtcbmNvbnN0IF9QUk9UT1NfQUNDRVNTT1IgPSBcInByb3Rvc1wiO1xuZXhwb3J0IGNvbnN0IENPTlRFWFRfQUNDRVNTT1IgPSBcImNvbnRleHRcIjtcblxuLy8gYGNvbnRleHRgIGlzIGFsd2F5cyBmaXJzdC5cbmV4cG9ydCBjb25zdCBDT05URVhUX0lOREVYID0gMDtcbmNvbnN0IF9GSUVMRF9QUkVGSVggPSAndGhpcy4nO1xuXG52YXIgX3doaXRlU3BhY2VSZWdFeHAgPSAvXFxXL2c7XG5cbi8qKlxuICogUmV0dXJucyBgc2Agd2l0aCBhbGwgbm9uLWlkZW50aWZpZXIgY2hhcmFjdGVycyByZW1vdmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVOYW1lKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBTdHJpbmdXcmFwcGVyLnJlcGxhY2VBbGwocywgX3doaXRlU3BhY2VSZWdFeHAsICcnKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXNwb25zaWJsZSBmb3IgcHJvdmlkaW5nIGZpZWxkIGFuZCBsb2NhbCB2YXJpYWJsZSBuYW1lcyBmb3IgY2hhbmdlIGRldGVjdG9yIGNsYXNzZXMuXG4gKiBBbHNvIHByb3ZpZGVzIHNvbWUgY29udmVuaWVuY2UgZnVuY3Rpb25zLCBmb3IgZXhhbXBsZSwgZGVjbGFyaW5nIHZhcmlhYmxlcywgZGVzdHJveWluZyBwaXBlcyxcbiAqIGFuZCBkZWh5ZHJhdGluZyB0aGUgZGV0ZWN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlZ2VuTmFtZVV0aWwge1xuICAvKipcbiAgICogUmVjb3JkIG5hbWVzIHNhbml0aXplZCBmb3IgdXNlIGFzIGZpZWxkcy5cbiAgICogU2VlIFtzYW5pdGl6ZU5hbWVdIGZvciBkZXRhaWxzLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9zYW5pdGl6ZWROYW1lczogc3RyaW5nW107XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Nhbml0aXplZEV2ZW50TmFtZXMgPSBuZXcgTWFwPEV2ZW50QmluZGluZywgc3RyaW5nW10+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVjb3JkczogUHJvdG9SZWNvcmRbXSwgcHJpdmF0ZSBfZXZlbnRCaW5kaW5nczogRXZlbnRCaW5kaW5nW10sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2RpcmVjdGl2ZVJlY29yZHM6IGFueVtdLCBwcml2YXRlIF91dGlsTmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fc2FuaXRpemVkTmFtZXMgPSBMaXN0V3JhcHBlci5jcmVhdGVGaXhlZFNpemUodGhpcy5fcmVjb3Jkcy5sZW5ndGggKyAxKTtcbiAgICB0aGlzLl9zYW5pdGl6ZWROYW1lc1tDT05URVhUX0lOREVYXSA9IENPTlRFWFRfQUNDRVNTT1I7XG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLl9yZWNvcmRzLmxlbmd0aDsgaSA8IGlMZW47ICsraSkge1xuICAgICAgdGhpcy5fc2FuaXRpemVkTmFtZXNbaSArIDFdID0gc2FuaXRpemVOYW1lKGAke3RoaXMuX3JlY29yZHNbaV0ubmFtZX0ke2l9YCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgZWJJbmRleCA9IDA7IGViSW5kZXggPCBfZXZlbnRCaW5kaW5ncy5sZW5ndGg7ICsrZWJJbmRleCkge1xuICAgICAgdmFyIGViID0gX2V2ZW50QmluZGluZ3NbZWJJbmRleF07XG4gICAgICB2YXIgbmFtZXMgPSBbQ09OVEVYVF9BQ0NFU1NPUl07XG4gICAgICBmb3IgKHZhciBpID0gMCwgaUxlbiA9IGViLnJlY29yZHMubGVuZ3RoOyBpIDwgaUxlbjsgKytpKSB7XG4gICAgICAgIG5hbWVzLnB1c2goc2FuaXRpemVOYW1lKGAke2ViLnJlY29yZHNbaV0ubmFtZX0ke2l9XyR7ZWJJbmRleH1gKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9zYW5pdGl6ZWRFdmVudE5hbWVzLnNldChlYiwgbmFtZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FkZEZpZWxkUHJlZml4KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBgJHtfRklFTERfUFJFRklYfSR7bmFtZX1gOyB9XG5cbiAgZ2V0RGlzcGF0Y2hlck5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9ESVNQQVRDSEVSX0FDQ0VTU09SKTsgfVxuXG4gIGdldFBpcGVzQWNjZXNzb3JOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfUElQRVNfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0UHJvdG9zTmFtZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoX1BST1RPU19BQ0NFU1NPUik7IH1cblxuICBnZXREaXJlY3RpdmVzQWNjZXNzb3JOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfRElSRUNUSVZFU19BQ0NFU1NPUik7IH1cblxuICBnZXRMb2NhbHNBY2Nlc3Nvck5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9MT0NBTFNfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0U3RhdGVOYW1lKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfU1RBVEVfQUNDRVNTT1IpOyB9XG5cbiAgZ2V0TW9kZU5hbWUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KF9NT0RFX0FDQ0VTU09SKTsgfVxuXG4gIGdldFByb3BlcnR5QmluZGluZ0luZGV4KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeChfUFJPUF9CSU5ESU5HX0lOREVYKTsgfVxuXG4gIGdldExvY2FsTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgbF8ke3RoaXMuX3Nhbml0aXplZE5hbWVzW2lkeF19YDsgfVxuXG4gIGdldEV2ZW50TG9jYWxOYW1lKGViOiBFdmVudEJpbmRpbmcsIGlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYGxfJHt0aGlzLl9zYW5pdGl6ZWRFdmVudE5hbWVzLmdldChlYilbaWR4XX1gO1xuICB9XG5cbiAgZ2V0Q2hhbmdlTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgY18ke3RoaXMuX3Nhbml0aXplZE5hbWVzW2lkeF19YDsgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIHN0YXRlbWVudCBpbml0aWFsaXppbmcgbG9jYWwgdmFyaWFibGVzIHVzZWQgd2hlbiBkZXRlY3RpbmcgY2hhbmdlcy5cbiAgICovXG4gIGdlbkluaXRMb2NhbHMoKTogc3RyaW5nIHtcbiAgICB2YXIgZGVjbGFyYXRpb25zID0gW107XG4gICAgdmFyIGFzc2lnbm1lbnRzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLmdldEZpZWxkQ291bnQoKTsgaSA8IGlMZW47ICsraSkge1xuICAgICAgaWYgKGkgPT0gQ09OVEVYVF9JTkRFWCkge1xuICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChgJHt0aGlzLmdldExvY2FsTmFtZShpKX0gPSAke3RoaXMuZ2V0RmllbGROYW1lKGkpfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlYyA9IHRoaXMuX3JlY29yZHNbaSAtIDFdO1xuICAgICAgICBpZiAocmVjLmFyZ3VtZW50VG9QdXJlRnVuY3Rpb24pIHtcbiAgICAgICAgICB2YXIgY2hhbmdlTmFtZSA9IHRoaXMuZ2V0Q2hhbmdlTmFtZShpKTtcbiAgICAgICAgICBkZWNsYXJhdGlvbnMucHVzaChgJHt0aGlzLmdldExvY2FsTmFtZShpKX0sJHtjaGFuZ2VOYW1lfWApO1xuICAgICAgICAgIGFzc2lnbm1lbnRzLnB1c2goY2hhbmdlTmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVjbGFyYXRpb25zLnB1c2goYCR7dGhpcy5nZXRMb2NhbE5hbWUoaSl9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGFzc2lnbm1lbnRzQ29kZSA9XG4gICAgICAgIExpc3RXcmFwcGVyLmlzRW1wdHkoYXNzaWdubWVudHMpID8gJycgOiBgJHthc3NpZ25tZW50cy5qb2luKCc9Jyl9ID0gZmFsc2U7YDtcbiAgICByZXR1cm4gYHZhciAke2RlY2xhcmF0aW9ucy5qb2luKCcsJyl9OyR7YXNzaWdubWVudHNDb2RlfWA7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBzdGF0ZW1lbnQgaW5pdGlhbGl6aW5nIGxvY2FsIHZhcmlhYmxlcyBmb3IgZXZlbnQgaGFuZGxlcnMuXG4gICAqL1xuICBnZW5Jbml0RXZlbnRMb2NhbHMoKTogc3RyaW5nIHtcbiAgICB2YXIgcmVzID0gW2Ake3RoaXMuZ2V0TG9jYWxOYW1lKENPTlRFWFRfSU5ERVgpfSA9ICR7dGhpcy5nZXRGaWVsZE5hbWUoQ09OVEVYVF9JTkRFWCl9YF07XG4gICAgdGhpcy5fc2FuaXRpemVkRXZlbnROYW1lcy5mb3JFYWNoKChuYW1lcywgZWIpID0+IHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgaWYgKGkgIT09IENPTlRFWFRfSU5ERVgpIHtcbiAgICAgICAgICByZXMucHVzaChgJHt0aGlzLmdldEV2ZW50TG9jYWxOYW1lKGViLCBpKX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXMubGVuZ3RoID4gMSA/IGB2YXIgJHtyZXMuam9pbignLCcpfTtgIDogJyc7XG4gIH1cblxuICBnZXRQcmV2ZW50RGVmYXVsdEFjY2Vzb3IoKTogc3RyaW5nIHsgcmV0dXJuIFwicHJldmVudERlZmF1bHRcIjsgfVxuXG4gIGdldEZpZWxkQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Nhbml0aXplZE5hbWVzLmxlbmd0aDsgfVxuXG4gIGdldEZpZWxkTmFtZShpZHg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiB0aGlzLl9hZGRGaWVsZFByZWZpeCh0aGlzLl9zYW5pdGl6ZWROYW1lc1tpZHhdKTsgfVxuXG4gIGdldEFsbEZpZWxkTmFtZXMoKTogc3RyaW5nW10ge1xuICAgIHZhciBmaWVsZExpc3QgPSBbXTtcbiAgICBmb3IgKHZhciBrID0gMCwga0xlbiA9IHRoaXMuZ2V0RmllbGRDb3VudCgpOyBrIDwga0xlbjsgKytrKSB7XG4gICAgICBpZiAoayA9PT0gMCB8fCB0aGlzLl9yZWNvcmRzW2sgLSAxXS5zaG91bGRCZUNoZWNrZWQoKSkge1xuICAgICAgICBmaWVsZExpc3QucHVzaCh0aGlzLmdldEZpZWxkTmFtZShrKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDAsIGlMZW4gPSB0aGlzLl9yZWNvcmRzLmxlbmd0aDsgaSA8IGlMZW47ICsraSkge1xuICAgICAgdmFyIHJlYyA9IHRoaXMuX3JlY29yZHNbaV07XG4gICAgICBpZiAocmVjLmlzUGlwZVJlY29yZCgpKSB7XG4gICAgICAgIGZpZWxkTGlzdC5wdXNoKHRoaXMuZ2V0UGlwZU5hbWUocmVjLnNlbGZJbmRleCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGogPSAwLCBqTGVuID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkcy5sZW5ndGg7IGogPCBqTGVuOyArK2opIHtcbiAgICAgIHZhciBkUmVjID0gdGhpcy5fZGlyZWN0aXZlUmVjb3Jkc1tqXTtcbiAgICAgIGZpZWxkTGlzdC5wdXNoKHRoaXMuZ2V0RGlyZWN0aXZlTmFtZShkUmVjLmRpcmVjdGl2ZUluZGV4KSk7XG4gICAgICBpZiAoIWRSZWMuaXNEZWZhdWx0Q2hhbmdlRGV0ZWN0aW9uKCkpIHtcbiAgICAgICAgZmllbGRMaXN0LnB1c2godGhpcy5nZXREZXRlY3Rvck5hbWUoZFJlYy5kaXJlY3RpdmVJbmRleCkpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmllbGRMaXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBzdGF0ZW1lbnRzIHdoaWNoIGNsZWFyIGFsbCBmaWVsZHMgc28gdGhhdCB0aGUgY2hhbmdlIGRldGVjdG9yIGlzIGRlaHlkcmF0ZWQuXG4gICAqL1xuICBnZW5EZWh5ZHJhdGVGaWVsZHMoKTogc3RyaW5nIHtcbiAgICB2YXIgZmllbGRzID0gdGhpcy5nZXRBbGxGaWVsZE5hbWVzKCk7XG4gICAgTGlzdFdyYXBwZXIucmVtb3ZlQXQoZmllbGRzLCBDT05URVhUX0lOREVYKTtcbiAgICBpZiAoTGlzdFdyYXBwZXIuaXNFbXB0eShmaWVsZHMpKSByZXR1cm4gJyc7XG5cbiAgICAvLyBBdCBsZWFzdCBvbmUgYXNzaWdubWVudC5cbiAgICBmaWVsZHMucHVzaChgJHt0aGlzLl91dGlsTmFtZX0udW5pbml0aWFsaXplZDtgKTtcbiAgICByZXR1cm4gZmllbGRzLmpvaW4oJyA9ICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBzdGF0ZW1lbnRzIGRlc3Ryb3lpbmcgYWxsIHBpcGUgdmFyaWFibGVzLlxuICAgKi9cbiAgZ2VuUGlwZU9uRGVzdHJveSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZWNvcmRzLmZpbHRlcihyID0+IHIuaXNQaXBlUmVjb3JkKCkpXG4gICAgICAgIC5tYXAociA9PiBgJHt0aGlzLl91dGlsTmFtZX0uY2FsbFBpcGVPbkRlc3Ryb3koJHt0aGlzLmdldFBpcGVOYW1lKHIuc2VsZkluZGV4KX0pO2ApXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIGdldFBpcGVOYW1lKGlkeDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoYCR7dGhpcy5fc2FuaXRpemVkTmFtZXNbaWR4XX1fcGlwZWApO1xuICB9XG5cbiAgZ2V0RGlyZWN0aXZlTmFtZShkOiBEaXJlY3RpdmVJbmRleCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2FkZEZpZWxkUHJlZml4KGBkaXJlY3RpdmVfJHtkLm5hbWV9YCk7XG4gIH1cblxuICBnZXREZXRlY3Rvck5hbWUoZDogRGlyZWN0aXZlSW5kZXgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYWRkRmllbGRQcmVmaXgoYGRldGVjdG9yXyR7ZC5uYW1lfWApOyB9XG59XG4iXX0=