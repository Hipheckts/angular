'use strict';var lang_1 = require('angular2/src/facade/lang');
var html_tags_1 = require('./html_tags');
var NG_CONTENT_SELECT_ATTR = 'select';
var NG_CONTENT_ELEMENT = 'ng-content';
var LINK_ELEMENT = 'link';
var LINK_STYLE_REL_ATTR = 'rel';
var LINK_STYLE_HREF_ATTR = 'href';
var LINK_STYLE_REL_VALUE = 'stylesheet';
var STYLE_ELEMENT = 'style';
var SCRIPT_ELEMENT = 'script';
var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
var NG_PROJECT_AS = 'ngProjectAs';
function preparseElement(ast) {
    var selectAttr = null;
    var hrefAttr = null;
    var relAttr = null;
    var nonBindable = false;
    var projectAs = null;
    ast.attrs.forEach(function (attr) {
        var lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    var nodeName = ast.name.toLowerCase();
    var type = PreparsedElementType.OTHER;
    if (html_tags_1.splitNsName(nodeName)[1] == NG_CONTENT_ELEMENT) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
exports.preparseElement = preparseElement;
(function (PreparsedElementType) {
    PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
    PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
    PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
})(exports.PreparsedElementType || (exports.PreparsedElementType = {}));
var PreparsedElementType = exports.PreparsedElementType;
var PreparsedElement = (function () {
    function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
    return PreparsedElement;
})();
exports.PreparsedElement = PreparsedElement;
function normalizeNgContentSelect(selectAttr) {
    if (lang_1.isBlank(selectAttr) || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcHJlcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1NeTBLWVU4MS50bXAvYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3RlbXBsYXRlX3ByZXBhcnNlci50cyJdLCJuYW1lcyI6WyJwcmVwYXJzZUVsZW1lbnQiLCJQcmVwYXJzZWRFbGVtZW50VHlwZSIsIlByZXBhcnNlZEVsZW1lbnQiLCJQcmVwYXJzZWRFbGVtZW50LmNvbnN0cnVjdG9yIiwibm9ybWFsaXplTmdDb250ZW50U2VsZWN0Il0sIm1hcHBpbmdzIjoiQUFDQSxxQkFBaUMsMEJBQTBCLENBQUMsQ0FBQTtBQUM1RCwwQkFBMEIsYUFBYSxDQUFDLENBQUE7QUFFeEMsSUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUM7QUFDeEMsSUFBTSxrQkFBa0IsR0FBRyxZQUFZLENBQUM7QUFDeEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzVCLElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLElBQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLElBQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUM5QixJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsSUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDN0MsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBRXBDLHlCQUFnQyxHQUFtQjtJQUNqREEsSUFBSUEsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0E7SUFDdEJBLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO0lBQ3BCQSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUNuQkEsSUFBSUEsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0E7SUFDeEJBLElBQUlBLFNBQVNBLEdBQVdBLElBQUlBLENBQUNBO0lBQzdCQSxHQUFH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QUE7SUFDVkEsaUVBQUtBLENBQUFBO0lBQ0xBLDJFQUFVQSxDQUFBQTtJQUNWQSxtRUFBTUEsQ0FBQUE7SUFDTkEsaUVBQUtBLENBQUFBO0FBQ1BBLENBQUNBLEVBTlcsNEJBQW9CLEtBQXBCLDRCQUFvQixRQU0vQjtBQU5ELElBQVksb0JBQW9CLEdBQXBCLDRCQU1YLENBQUE7QUFFRDtJQUNFQywwQkFBbUJBLElBQTBCQSxFQUFTQSxVQUFrQkEsRUFBU0EsUUFBZ0JBLEVBQzlFQSxXQUFvQkEsRUFBU0EsU0FBaUJBO1FBRDlDQyxTQUFJQSxHQUFKQSxJQUFJQSxDQUFzQkE7UUFBU0EsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBUUE7UUFBU0EsYUFBUUEsR0FBUkEsUUFBUUEsQ0FBUUE7UUFDOUVBLGdCQUFXQSxHQUFYQSxXQUFXQSxDQUFTQTtRQUFTQSxjQUFTQSxHQUFUQSxTQUFTQSxDQUFRQTtJQUFHQSxDQUFDQTtJQUN2RUQsdUJBQUNBO0FBQURBLENBQUNBLEFBSEQsSUFHQztBQUhZLHdCQUFnQixtQkFHNUIsQ0FBQTtBQUdELGtDQUFrQyxVQUFrQjtJQUNsREUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsY0FBT0EsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsVUFBVUEsQ0FBQ0EsTUFBTUEsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDbkRBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO0lBQ2JBLENBQUNBO0lBQ0RBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBO0FBQ3BCQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SHRtbEVsZW1lbnRBc3R9IGZyb20gJy4vaHRtbF9hc3QnO1xuaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge3NwbGl0TnNOYW1lfSBmcm9tICcuL2h0bWxfdGFncyc7XG5cbmNvbnN0IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIgPSAnc2VsZWN0JztcbmNvbnN0IE5HX0NPTlRFTlRfRUxFTUVOVCA9ICduZy1jb250ZW50JztcbmNvbnN0IExJTktfRUxFTUVOVCA9ICdsaW5rJztcbmNvbnN0IExJTktfU1RZTEVfUkVMX0FUVFIgPSAncmVsJztcbmNvbnN0IExJTktfU1RZTEVfSFJFRl9BVFRSID0gJ2hyZWYnO1xuY29uc3QgTElOS19TVFlMRV9SRUxfVkFMVUUgPSAnc3R5bGVzaGVldCc7XG5jb25zdCBTVFlMRV9FTEVNRU5UID0gJ3N0eWxlJztcbmNvbnN0IFNDUklQVF9FTEVNRU5UID0gJ3NjcmlwdCc7XG5jb25zdCBOR19OT05fQklOREFCTEVfQVRUUiA9ICduZ05vbkJpbmRhYmxlJztcbmNvbnN0IE5HX1BST0pFQ1RfQVMgPSAnbmdQcm9qZWN0QXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyc2VFbGVtZW50KGFzdDogSHRtbEVsZW1lbnRBc3QpOiBQcmVwYXJzZWRFbGVtZW50IHtcbiAgdmFyIHNlbGVjdEF0dHIgPSBudWxsO1xuICB2YXIgaHJlZkF0dHIgPSBudWxsO1xuICB2YXIgcmVsQXR0ciA9IG51bGw7XG4gIHZhciBub25CaW5kYWJsZSA9IGZhbHNlO1xuICB2YXIgcHJvamVjdEFzOiBzdHJpbmcgPSBudWxsO1xuICBhc3QuYXR0cnMuZm9yRWFjaChhdHRyID0+IHtcbiAgICBsZXQgbGNBdHRyTmFtZSA9IGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmIChsY0F0dHJOYW1lID09IE5HX0NPTlRFTlRfU0VMRUNUX0FUVFIpIHtcbiAgICAgIHNlbGVjdEF0dHIgPSBhdHRyLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAobGNBdHRyTmFtZSA9PSBMSU5LX1NUWUxFX0hSRUZfQVRUUikge1xuICAgICAgaHJlZkF0dHIgPSBhdHRyLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAobGNBdHRyTmFtZSA9PSBMSU5LX1NUWUxFX1JFTF9BVFRSKSB7XG4gICAgICByZWxBdHRyID0gYXR0ci52YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGF0dHIubmFtZSA9PSBOR19OT05fQklOREFCTEVfQVRUUikge1xuICAgICAgbm9uQmluZGFibGUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoYXR0ci5uYW1lID09IE5HX1BST0pFQ1RfQVMpIHtcbiAgICAgIGlmIChhdHRyLnZhbHVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcHJvamVjdEFzID0gYXR0ci52YWx1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBzZWxlY3RBdHRyID0gbm9ybWFsaXplTmdDb250ZW50U2VsZWN0KHNlbGVjdEF0dHIpO1xuICB2YXIgbm9kZU5hbWUgPSBhc3QubmFtZS50b0xvd2VyQ2FzZSgpO1xuICB2YXIgdHlwZSA9IFByZXBhcnNlZEVsZW1lbnRUeXBlLk9USEVSO1xuICBpZiAoc3BsaXROc05hbWUobm9kZU5hbWUpWzFdID09IE5HX0NPTlRFTlRfRUxFTUVOVCkge1xuICAgIHR5cGUgPSBQcmVwYXJzZWRFbGVtZW50VHlwZS5OR19DT05URU5UO1xuICB9IGVsc2UgaWYgKG5vZGVOYW1lID09IFNUWUxFX0VMRU1FTlQpIHtcbiAgICB0eXBlID0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU1RZTEU7XG4gIH0gZWxzZSBpZiAobm9kZU5hbWUgPT0gU0NSSVBUX0VMRU1FTlQpIHtcbiAgICB0eXBlID0gUHJlcGFyc2VkRWxlbWVudFR5cGUuU0NSSVBUO1xuICB9IGVsc2UgaWYgKG5vZGVOYW1lID09IExJTktfRUxFTUVOVCAmJiByZWxBdHRyID09IExJTktfU1RZTEVfUkVMX1ZBTFVFKSB7XG4gICAgdHlwZSA9IFByZXBhcnNlZEVsZW1lbnRUeXBlLlNUWUxFU0hFRVQ7XG4gIH1cbiAgcmV0dXJuIG5ldyBQcmVwYXJzZWRFbGVtZW50KHR5cGUsIHNlbGVjdEF0dHIsIGhyZWZBdHRyLCBub25CaW5kYWJsZSwgcHJvamVjdEFzKTtcbn1cblxuZXhwb3J0IGVudW0gUHJlcGFyc2VkRWxlbWVudFR5cGUge1xuICBOR19DT05URU5ULFxuICBTVFlMRSxcbiAgU1RZTEVTSEVFVCxcbiAgU0NSSVBULFxuICBPVEhFUlxufVxuXG5leHBvcnQgY2xhc3MgUHJlcGFyc2VkRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBQcmVwYXJzZWRFbGVtZW50VHlwZSwgcHVibGljIHNlbGVjdEF0dHI6IHN0cmluZywgcHVibGljIGhyZWZBdHRyOiBzdHJpbmcsXG4gICAgICAgICAgICAgIHB1YmxpYyBub25CaW5kYWJsZTogYm9vbGVhbiwgcHVibGljIHByb2plY3RBczogc3RyaW5nKSB7fVxufVxuXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5nQ29udGVudFNlbGVjdChzZWxlY3RBdHRyOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoaXNCbGFuayhzZWxlY3RBdHRyKSB8fCBzZWxlY3RBdHRyLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAnKic7XG4gIH1cbiAgcmV0dXJuIHNlbGVjdEF0dHI7XG59XG4iXX0=