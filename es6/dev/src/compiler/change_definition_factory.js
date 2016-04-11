import { ListWrapper, StringMapWrapper } from 'angular2/src/facade/collection';
import { isPresent } from 'angular2/src/facade/lang';
import { reflector } from 'angular2/src/core/reflection/reflection';
import { DirectiveIndex, BindingRecord, DirectiveRecord, ChangeDetectionStrategy, ChangeDetectorDefinition } from 'angular2/src/core/change_detection/change_detection';
import { PropertyBindingType, templateVisitAll } from './template_ast';
import { LifecycleHooks } from 'angular2/src/core/linker/interfaces';
export function createChangeDetectorDefinitions(componentType, componentStrategy, genConfig, parsedTemplate) {
    var pvVisitors = [];
    var visitor = new ProtoViewVisitor(null, pvVisitors, componentStrategy);
    templateVisitAll(visitor, parsedTemplate);
    return createChangeDefinitions(pvVisitors, componentType, genConfig);
}
class ProtoViewVisitor {
    constructor(parent, allVisitors, strategy) {
        this.parent = parent;
        this.allVisitors = allVisitors;
        this.strategy = strategy;
        this.nodeCount = 0;
        this.boundElementCount = 0;
        this.variableNames = [];
        this.bindingRecords = [];
        this.eventRecords = [];
        this.directiveRecords = [];
        this.viewIndex = allVisitors.length;
        allVisitors.push(this);
    }
    visitEmbeddedTemplate(ast, context) {
        this.nodeCount++;
        this.boundElementCount++;
        templateVisitAll(this, ast.outputs);
        for (var i = 0; i < ast.directives.length; i++) {
            ast.directives[i].visit(this, i);
        }
        var childVisitor = new ProtoViewVisitor(this, this.allVisitors, ChangeDetectionStrategy.Default);
        // Attention: variables present on an embedded template count towards
        // the embedded template and not the template anchor!
        templateVisitAll(childVisitor, ast.vars);
        templateVisitAll(childVisitor, ast.children);
        return null;
    }
    visitElement(ast, context) {
        this.nodeCount++;
        if (ast.isBound()) {
            this.boundElementCount++;
        }
        templateVisitAll(this, ast.inputs, null);
        templateVisitAll(this, ast.outputs);
        templateVisitAll(this, ast.exportAsVars);
        for (var i = 0; i < ast.directives.length; i++) {
            ast.directives[i].visit(this, i);
        }
        templateVisitAll(this, ast.children);
        return null;
    }
    visitNgContent(ast, context) { return null; }
    visitVariable(ast, context) {
        this.variableNames.push(ast.name);
        return null;
    }
    visitEvent(ast, directiveRecord) {
        var bindingRecord = isPresent(directiveRecord) ?
            BindingRecord.createForHostEvent(ast.handler, ast.fullName, directiveRecord) :
            BindingRecord.createForEvent(ast.handler, ast.fullName, this.boundElementCount - 1);
        this.eventRecords.push(bindingRecord);
        return null;
    }
    visitElementProperty(ast, directiveRecord) {
        var boundElementIndex = this.boundElementCount - 1;
        var dirIndex = isPresent(directiveRecord) ? directiveRecord.directiveIndex : null;
        var bindingRecord;
        if (ast.type === PropertyBindingType.Property) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostProperty(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementProperty(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Attribute) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostAttribute(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementAttribute(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Class) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostClass(dirIndex, ast.value, ast.name) :
                    BindingRecord.createForElementClass(ast.value, boundElementIndex, ast.name);
        }
        else if (ast.type === PropertyBindingType.Style) {
            bindingRecord =
                isPresent(dirIndex) ?
                    BindingRecord.createForHostStyle(dirIndex, ast.value, ast.name, ast.unit) :
                    BindingRecord.createForElementStyle(ast.value, boundElementIndex, ast.name, ast.unit);
        }
        this.bindingRecords.push(bindingRecord);
        return null;
    }
    visitAttr(ast, context) { return null; }
    visitBoundText(ast, context) {
        var nodeIndex = this.nodeCount++;
        this.bindingRecords.push(BindingRecord.createForTextNode(ast.value, nodeIndex));
        return null;
    }
    visitText(ast, context) {
        this.nodeCount++;
        return null;
    }
    visitDirective(ast, directiveIndexAsNumber) {
        var directiveIndex = new DirectiveIndex(this.boundElementCount - 1, directiveIndexAsNumber);
        var directiveMetadata = ast.directive;
        var outputsArray = [];
        StringMapWrapper.forEach(ast.directive.outputs, (eventName, dirProperty) => outputsArray.push([dirProperty, eventName]));
        var directiveRecord = new DirectiveRecord({
            directiveIndex: directiveIndex,
            callAfterContentInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterContentInit) !== -1,
            callAfterContentChecked: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterContentChecked) !== -1,
            callAfterViewInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterViewInit) !== -1,
            callAfterViewChecked: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.AfterViewChecked) !== -1,
            callOnChanges: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnChanges) !== -1,
            callDoCheck: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.DoCheck) !== -1,
            callOnInit: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnInit) !== -1,
            callOnDestroy: directiveMetadata.lifecycleHooks.indexOf(LifecycleHooks.OnDestroy) !== -1,
            changeDetection: directiveMetadata.changeDetection,
            outputs: outputsArray
        });
        this.directiveRecords.push(directiveRecord);
        templateVisitAll(this, ast.inputs, directiveRecord);
        var bindingRecords = this.bindingRecords;
        if (directiveRecord.callOnChanges) {
            bindingRecords.push(BindingRecord.createDirectiveOnChanges(directiveRecord));
        }
        if (directiveRecord.callOnInit) {
            bindingRecords.push(BindingRecord.createDirectiveOnInit(directiveRecord));
        }
        if (directiveRecord.callDoCheck) {
            bindingRecords.push(BindingRecord.createDirectiveDoCheck(directiveRecord));
        }
        templateVisitAll(this, ast.hostProperties, directiveRecord);
        templateVisitAll(this, ast.hostEvents, directiveRecord);
        templateVisitAll(this, ast.exportAsVars);
        return null;
    }
    visitDirectiveProperty(ast, directiveRecord) {
        // TODO: these setters should eventually be created by change detection, to make
        // it monomorphic!
        var setter = reflector.setter(ast.directiveName);
        this.bindingRecords.push(BindingRecord.createForDirective(ast.value, ast.directiveName, setter, directiveRecord));
        return null;
    }
}
function createChangeDefinitions(pvVisitors, componentType, genConfig) {
    var pvVariableNames = _collectNestedProtoViewsVariableNames(pvVisitors);
    return pvVisitors.map(pvVisitor => {
        var id = `${componentType.name}_${pvVisitor.viewIndex}`;
        return new ChangeDetectorDefinition(id, pvVisitor.strategy, pvVariableNames[pvVisitor.viewIndex], pvVisitor.bindingRecords, pvVisitor.eventRecords, pvVisitor.directiveRecords, genConfig);
    });
}
function _collectNestedProtoViewsVariableNames(pvVisitors) {
    var nestedPvVariableNames = ListWrapper.createFixedSize(pvVisitors.length);
    pvVisitors.forEach((pv) => {
        var parentVariableNames = isPresent(pv.parent) ? nestedPvVariableNames[pv.parent.viewIndex] : [];
        nestedPvVariableNames[pv.viewIndex] = parentVariableNames.concat(pv.variableNames);
    });
    return nestedPvVariableNames;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RlZmluaXRpb25fZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdEd3c2p6ZEwudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9jaGFuZ2VfZGVmaW5pdGlvbl9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbImNyZWF0ZUNoYW5nZURldGVjdG9yRGVmaW5pdGlvbnMiLCJQcm90b1ZpZXdWaXNpdG9yIiwiUHJvdG9WaWV3VmlzaXRvci5jb25zdHJ1Y3RvciIsIlByb3RvVmlld1Zpc2l0b3IudmlzaXRFbWJlZGRlZFRlbXBsYXRlIiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdEVsZW1lbnQiLCJQcm90b1ZpZXdWaXNpdG9yLnZpc2l0TmdDb250ZW50IiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdFZhcmlhYmxlIiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdEV2ZW50IiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdEVsZW1lbnRQcm9wZXJ0eSIsIlByb3RvVmlld1Zpc2l0b3IudmlzaXRBdHRyIiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdEJvdW5kVGV4dCIsIlByb3RvVmlld1Zpc2l0b3IudmlzaXRUZXh0IiwiUHJvdG9WaWV3VmlzaXRvci52aXNpdERpcmVjdGl2ZSIsIlByb3RvVmlld1Zpc2l0b3IudmlzaXREaXJlY3RpdmVQcm9wZXJ0eSIsImNyZWF0ZUNoYW5nZURlZmluaXRpb25zIiwiX2NvbGxlY3ROZXN0ZWRQcm90b1ZpZXdzVmFyaWFibGVOYW1lcyJdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxXQUFXLEVBQUUsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckUsRUFBQyxTQUFTLEVBQVUsTUFBTSwwQkFBMEI7T0FDcEQsRUFBQyxTQUFTLEVBQUMsTUFBTSx5Q0FBeUM7T0FFMUQsRUFDTCxjQUFjLEVBQ2QsYUFBYSxFQUNiLGVBQWUsRUFDZix1QkFBdUIsRUFDdkIsd0JBQXdC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U0EsQ0FBQ0EsUUFBUUEsRUFBRUEsZUFBZUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsRUFBRUEsU0FBU0EsQ0FBQ0EsY0FBY0EsRUFDdEZBLFNBQVNBLENBQUNBLFlBQVlBLEVBQUVBLFNBQVNBLENBQUNBLGdCQUFnQkEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFFckVBLENBQUNBLENBQUNBLENBQUNBO0FBQ0xBLENBQUNBO0FBRUQsK0NBQStDLFVBQThCO0lBQzNFQyxJQUFJQSxxQkFBcUJBLEdBQWVBLFdBQVdBLENBQUNBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQ3ZGQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxFQUFFQTtRQUNwQkEsSUFBSUEsbUJBQW1CQSxHQUNuQkEsU0FBU0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EscUJBQXFCQSxDQUFDQSxFQUFFQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUMzRUEscUJBQXFCQSxDQUFDQSxFQUFFQSxDQUFDQSxTQUFTQSxDQUFDQSxHQUFHQSxtQkFBbUJBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLENBQUNBO0lBQ3JGQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUNIQSxNQUFNQSxDQUFDQSxxQkFBcUJBLENBQUNBO0FBQy9CQSxDQUFDQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TGlzdFdyYXBwZXIsIFN0cmluZ01hcFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7cmVmbGVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZWZsZWN0aW9uL3JlZmxlY3Rpb24nO1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmVJbmRleCxcbiAgQmluZGluZ1JlY29yZCxcbiAgRGlyZWN0aXZlUmVjb3JkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uLFxuICBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZyxcbiAgQVNUV2l0aFNvdXJjZVxufSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9jaGFuZ2VfZGV0ZWN0aW9uL2NoYW5nZV9kZXRlY3Rpb24nO1xuXG5pbXBvcnQge0NvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSwgQ29tcGlsZVR5cGVNZXRhZGF0YX0gZnJvbSAnLi9kaXJlY3RpdmVfbWV0YWRhdGEnO1xuaW1wb3J0IHtcbiAgVGVtcGxhdGVBc3QsXG4gIEVsZW1lbnRBc3QsXG4gIEJvdW5kVGV4dEFzdCxcbiAgUHJvcGVydHlCaW5kaW5nVHlwZSxcbiAgRGlyZWN0aXZlQXN0LFxuICBUZW1wbGF0ZUFzdFZpc2l0b3IsXG4gIHRlbXBsYXRlVmlzaXRBbGwsXG4gIE5nQ29udGVudEFzdCxcbiAgRW1iZWRkZWRUZW1wbGF0ZUFzdCxcbiAgVmFyaWFibGVBc3QsXG4gIEJvdW5kRWxlbWVudFByb3BlcnR5QXN0LFxuICBCb3VuZEV2ZW50QXN0LFxuICBCb3VuZERpcmVjdGl2ZVByb3BlcnR5QXN0LFxuICBBdHRyQXN0LFxuICBUZXh0QXN0XG59IGZyb20gJy4vdGVtcGxhdGVfYXN0JztcbmltcG9ydCB7TGlmZWN5Y2xlSG9va3N9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9pbnRlcmZhY2VzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNoYW5nZURldGVjdG9yRGVmaW5pdGlvbnMoXG4gICAgY29tcG9uZW50VHlwZTogQ29tcGlsZVR5cGVNZXRhZGF0YSwgY29tcG9uZW50U3RyYXRlZ3k6IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIGdlbkNvbmZpZzogQ2hhbmdlRGV0ZWN0b3JHZW5Db25maWcsIHBhcnNlZFRlbXBsYXRlOiBUZW1wbGF0ZUFzdFtdKTogQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uW10ge1xuICB2YXIgcHZWaXNpdG9ycyA9IFtdO1xuICB2YXIgdmlzaXRvciA9IG5ldyBQcm90b1ZpZXdWaXNpdG9yKG51bGwsIHB2VmlzaXRvcnMsIGNvbXBvbmVudFN0cmF0ZWd5KTtcbiAgdGVtcGxhdGVWaXNpdEFsbCh2aXNpdG9yLCBwYXJzZWRUZW1wbGF0ZSk7XG4gIHJldHVybiBjcmVhdGVDaGFuZ2VEZWZpbml0aW9ucyhwdlZpc2l0b3JzLCBjb21wb25lbnRUeXBlLCBnZW5Db25maWcpO1xufVxuXG5jbGFzcyBQcm90b1ZpZXdWaXNpdG9yIGltcGxlbWVudHMgVGVtcGxhdGVBc3RWaXNpdG9yIHtcbiAgdmlld0luZGV4OiBudW1iZXI7XG4gIG5vZGVDb3VudDogbnVtYmVyID0gMDtcbiAgYm91bmRFbGVtZW50Q291bnQ6IG51bWJlciA9IDA7XG4gIHZhcmlhYmxlTmFtZXM6IHN0cmluZ1tdID0gW107XG4gIGJpbmRpbmdSZWNvcmRzOiBCaW5kaW5nUmVjb3JkW10gPSBbXTtcbiAgZXZlbnRSZWNvcmRzOiBCaW5kaW5nUmVjb3JkW10gPSBbXTtcbiAgZGlyZWN0aXZlUmVjb3JkczogRGlyZWN0aXZlUmVjb3JkW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGFyZW50OiBQcm90b1ZpZXdWaXNpdG9yLCBwdWJsaWMgYWxsVmlzaXRvcnM6IFByb3RvVmlld1Zpc2l0b3JbXSxcbiAgICAgICAgICAgICAgcHVibGljIHN0cmF0ZWd5OiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSkge1xuICAgIHRoaXMudmlld0luZGV4ID0gYWxsVmlzaXRvcnMubGVuZ3RoO1xuICAgIGFsbFZpc2l0b3JzLnB1c2godGhpcyk7XG4gIH1cblxuICB2aXNpdEVtYmVkZGVkVGVtcGxhdGUoYXN0OiBFbWJlZGRlZFRlbXBsYXRlQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubm9kZUNvdW50Kys7XG4gICAgdGhpcy5ib3VuZEVsZW1lbnRDb3VudCsrO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0Lm91dHB1dHMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXN0LmRpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFzdC5kaXJlY3RpdmVzW2ldLnZpc2l0KHRoaXMsIGkpO1xuICAgIH1cblxuICAgIHZhciBjaGlsZFZpc2l0b3IgPVxuICAgICAgICBuZXcgUHJvdG9WaWV3VmlzaXRvcih0aGlzLCB0aGlzLmFsbFZpc2l0b3JzLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0KTtcbiAgICAvLyBBdHRlbnRpb246IHZhcmlhYmxlcyBwcmVzZW50IG9uIGFuIGVtYmVkZGVkIHRlbXBsYXRlIGNvdW50IHRvd2FyZHNcbiAgICAvLyB0aGUgZW1iZWRkZWQgdGVtcGxhdGUgYW5kIG5vdCB0aGUgdGVtcGxhdGUgYW5jaG9yIVxuICAgIHRlbXBsYXRlVmlzaXRBbGwoY2hpbGRWaXNpdG9yLCBhc3QudmFycyk7XG4gICAgdGVtcGxhdGVWaXNpdEFsbChjaGlsZFZpc2l0b3IsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdEVsZW1lbnQoYXN0OiBFbGVtZW50QXN0LCBjb250ZXh0OiBhbnkpOiBhbnkge1xuICAgIHRoaXMubm9kZUNvdW50Kys7XG4gICAgaWYgKGFzdC5pc0JvdW5kKCkpIHtcbiAgICAgIHRoaXMuYm91bmRFbGVtZW50Q291bnQrKztcbiAgICB9XG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaW5wdXRzLCBudWxsKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5vdXRwdXRzKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5leHBvcnRBc1ZhcnMpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXN0LmRpcmVjdGl2ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFzdC5kaXJlY3RpdmVzW2ldLnZpc2l0KHRoaXMsIGkpO1xuICAgIH1cbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5jaGlsZHJlbik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2aXNpdE5nQ29udGVudChhc3Q6IE5nQ29udGVudEFzdCwgY29udGV4dDogYW55KTogYW55IHsgcmV0dXJuIG51bGw7IH1cblxuICB2aXNpdFZhcmlhYmxlKGFzdDogVmFyaWFibGVBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy52YXJpYWJsZU5hbWVzLnB1c2goYXN0Lm5hbWUpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmlzaXRFdmVudChhc3Q6IEJvdW5kRXZlbnRBc3QsIGRpcmVjdGl2ZVJlY29yZDogRGlyZWN0aXZlUmVjb3JkKTogYW55IHtcbiAgICB2YXIgYmluZGluZ1JlY29yZCA9XG4gICAgICAgIGlzUHJlc2VudChkaXJlY3RpdmVSZWNvcmQpID9cbiAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9ySG9zdEV2ZW50KGFzdC5oYW5kbGVyLCBhc3QuZnVsbE5hbWUsIGRpcmVjdGl2ZVJlY29yZCkgOlxuICAgICAgICAgICAgQmluZGluZ1JlY29yZC5jcmVhdGVGb3JFdmVudChhc3QuaGFuZGxlciwgYXN0LmZ1bGxOYW1lLCB0aGlzLmJvdW5kRWxlbWVudENvdW50IC0gMSk7XG4gICAgdGhpcy5ldmVudFJlY29yZHMucHVzaChiaW5kaW5nUmVjb3JkKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZpc2l0RWxlbWVudFByb3BlcnR5KGFzdDogQm91bmRFbGVtZW50UHJvcGVydHlBc3QsIGRpcmVjdGl2ZVJlY29yZDogRGlyZWN0aXZlUmVjb3JkKTogYW55IHtcbiAgICB2YXIgYm91bmRFbGVtZW50SW5kZXggPSB0aGlzLmJvdW5kRWxlbWVudENvdW50IC0gMTtcbiAgICB2YXIgZGlySW5kZXggPSBpc1ByZXNlbnQoZGlyZWN0aXZlUmVjb3JkKSA/IGRpcmVjdGl2ZVJlY29yZC5kaXJlY3RpdmVJbmRleCA6IG51bGw7XG4gICAgdmFyIGJpbmRpbmdSZWNvcmQ7XG4gICAgaWYgKGFzdC50eXBlID09PSBQcm9wZXJ0eUJpbmRpbmdUeXBlLlByb3BlcnR5KSB7XG4gICAgICBiaW5kaW5nUmVjb3JkID1cbiAgICAgICAgICBpc1ByZXNlbnQoZGlySW5kZXgpID9cbiAgICAgICAgICAgICAgQmluZGluZ1JlY29yZC5jcmVhdGVGb3JIb3N0UHJvcGVydHkoZGlySW5kZXgsIGFzdC52YWx1ZSwgYXN0Lm5hbWUpIDpcbiAgICAgICAgICAgICAgQmluZGluZ1JlY29yZC5jcmVhdGVGb3JFbGVtZW50UHJvcGVydHkoYXN0LnZhbHVlLCBib3VuZEVsZW1lbnRJbmRleCwgYXN0Lm5hbWUpO1xuICAgIH0gZWxzZSBpZiAoYXN0LnR5cGUgPT09IFByb3BlcnR5QmluZGluZ1R5cGUuQXR0cmlidXRlKSB7XG4gICAgICBiaW5kaW5nUmVjb3JkID1cbiAgICAgICAgICBpc1ByZXNlbnQoZGlySW5kZXgpID9cbiAgICAgICAgICAgICAgQmluZGluZ1JlY29yZC5jcmVhdGVGb3JIb3N0QXR0cmlidXRlKGRpckluZGV4LCBhc3QudmFsdWUsIGFzdC5uYW1lKSA6XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRWxlbWVudEF0dHJpYnV0ZShhc3QudmFsdWUsIGJvdW5kRWxlbWVudEluZGV4LCBhc3QubmFtZSk7XG4gICAgfSBlbHNlIGlmIChhc3QudHlwZSA9PT0gUHJvcGVydHlCaW5kaW5nVHlwZS5DbGFzcykge1xuICAgICAgYmluZGluZ1JlY29yZCA9XG4gICAgICAgICAgaXNQcmVzZW50KGRpckluZGV4KSA/XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9ySG9zdENsYXNzKGRpckluZGV4LCBhc3QudmFsdWUsIGFzdC5uYW1lKSA6XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRWxlbWVudENsYXNzKGFzdC52YWx1ZSwgYm91bmRFbGVtZW50SW5kZXgsIGFzdC5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKGFzdC50eXBlID09PSBQcm9wZXJ0eUJpbmRpbmdUeXBlLlN0eWxlKSB7XG4gICAgICBiaW5kaW5nUmVjb3JkID1cbiAgICAgICAgICBpc1ByZXNlbnQoZGlySW5kZXgpID9cbiAgICAgICAgICAgICAgQmluZGluZ1JlY29yZC5jcmVhdGVGb3JIb3N0U3R5bGUoZGlySW5kZXgsIGFzdC52YWx1ZSwgYXN0Lm5hbWUsIGFzdC51bml0KSA6XG4gICAgICAgICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRWxlbWVudFN0eWxlKGFzdC52YWx1ZSwgYm91bmRFbGVtZW50SW5kZXgsIGFzdC5uYW1lLCBhc3QudW5pdCk7XG4gICAgfVxuICAgIHRoaXMuYmluZGluZ1JlY29yZHMucHVzaChiaW5kaW5nUmVjb3JkKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdEF0dHIoYXN0OiBBdHRyQXN0LCBjb250ZXh0OiBhbnkpOiBhbnkgeyByZXR1cm4gbnVsbDsgfVxuICB2aXNpdEJvdW5kVGV4dChhc3Q6IEJvdW5kVGV4dEFzdCwgY29udGV4dDogYW55KTogYW55IHtcbiAgICB2YXIgbm9kZUluZGV4ID0gdGhpcy5ub2RlQ291bnQrKztcbiAgICB0aGlzLmJpbmRpbmdSZWNvcmRzLnB1c2goQmluZGluZ1JlY29yZC5jcmVhdGVGb3JUZXh0Tm9kZShhc3QudmFsdWUsIG5vZGVJbmRleCkpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHZpc2l0VGV4dChhc3Q6IFRleHRBc3QsIGNvbnRleHQ6IGFueSk6IGFueSB7XG4gICAgdGhpcy5ub2RlQ291bnQrKztcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB2aXNpdERpcmVjdGl2ZShhc3Q6IERpcmVjdGl2ZUFzdCwgZGlyZWN0aXZlSW5kZXhBc051bWJlcjogbnVtYmVyKTogYW55IHtcbiAgICB2YXIgZGlyZWN0aXZlSW5kZXggPSBuZXcgRGlyZWN0aXZlSW5kZXgodGhpcy5ib3VuZEVsZW1lbnRDb3VudCAtIDEsIGRpcmVjdGl2ZUluZGV4QXNOdW1iZXIpO1xuICAgIHZhciBkaXJlY3RpdmVNZXRhZGF0YSA9IGFzdC5kaXJlY3RpdmU7XG4gICAgdmFyIG91dHB1dHNBcnJheSA9IFtdO1xuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChcbiAgICAgICAgYXN0LmRpcmVjdGl2ZS5vdXRwdXRzLFxuICAgICAgICAoZXZlbnROYW1lOiBzdHJpbmcsIGRpclByb3BlcnR5OiBzdHJpbmcpID0+IG91dHB1dHNBcnJheS5wdXNoKFtkaXJQcm9wZXJ0eSwgZXZlbnROYW1lXSkpO1xuICAgIHZhciBkaXJlY3RpdmVSZWNvcmQgPSBuZXcgRGlyZWN0aXZlUmVjb3JkKHtcbiAgICAgIGRpcmVjdGl2ZUluZGV4OiBkaXJlY3RpdmVJbmRleCxcbiAgICAgIGNhbGxBZnRlckNvbnRlbnRJbml0OlxuICAgICAgICAgIGRpcmVjdGl2ZU1ldGFkYXRhLmxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJDb250ZW50SW5pdCkgIT09IC0xLFxuICAgICAgY2FsbEFmdGVyQ29udGVudENoZWNrZWQ6XG4gICAgICAgICAgZGlyZWN0aXZlTWV0YWRhdGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5BZnRlckNvbnRlbnRDaGVja2VkKSAhPT0gLTEsXG4gICAgICBjYWxsQWZ0ZXJWaWV3SW5pdDpcbiAgICAgICAgICBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyVmlld0luaXQpICE9PSAtMSxcbiAgICAgIGNhbGxBZnRlclZpZXdDaGVja2VkOlxuICAgICAgICAgIGRpcmVjdGl2ZU1ldGFkYXRhLmxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJWaWV3Q2hlY2tlZCkgIT09IC0xLFxuICAgICAgY2FsbE9uQ2hhbmdlczogZGlyZWN0aXZlTWV0YWRhdGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkNoYW5nZXMpICE9PSAtMSxcbiAgICAgIGNhbGxEb0NoZWNrOiBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkRvQ2hlY2spICE9PSAtMSxcbiAgICAgIGNhbGxPbkluaXQ6IGRpcmVjdGl2ZU1ldGFkYXRhLmxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuT25Jbml0KSAhPT0gLTEsXG4gICAgICBjYWxsT25EZXN0cm95OiBkaXJlY3RpdmVNZXRhZGF0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLk9uRGVzdHJveSkgIT09IC0xLFxuICAgICAgY2hhbmdlRGV0ZWN0aW9uOiBkaXJlY3RpdmVNZXRhZGF0YS5jaGFuZ2VEZXRlY3Rpb24sXG4gICAgICBvdXRwdXRzOiBvdXRwdXRzQXJyYXlcbiAgICB9KTtcbiAgICB0aGlzLmRpcmVjdGl2ZVJlY29yZHMucHVzaChkaXJlY3RpdmVSZWNvcmQpO1xuXG4gICAgdGVtcGxhdGVWaXNpdEFsbCh0aGlzLCBhc3QuaW5wdXRzLCBkaXJlY3RpdmVSZWNvcmQpO1xuICAgIHZhciBiaW5kaW5nUmVjb3JkcyA9IHRoaXMuYmluZGluZ1JlY29yZHM7XG4gICAgaWYgKGRpcmVjdGl2ZVJlY29yZC5jYWxsT25DaGFuZ2VzKSB7XG4gICAgICBiaW5kaW5nUmVjb3Jkcy5wdXNoKEJpbmRpbmdSZWNvcmQuY3JlYXRlRGlyZWN0aXZlT25DaGFuZ2VzKGRpcmVjdGl2ZVJlY29yZCkpO1xuICAgIH1cbiAgICBpZiAoZGlyZWN0aXZlUmVjb3JkLmNhbGxPbkluaXQpIHtcbiAgICAgIGJpbmRpbmdSZWNvcmRzLnB1c2goQmluZGluZ1JlY29yZC5jcmVhdGVEaXJlY3RpdmVPbkluaXQoZGlyZWN0aXZlUmVjb3JkKSk7XG4gICAgfVxuICAgIGlmIChkaXJlY3RpdmVSZWNvcmQuY2FsbERvQ2hlY2spIHtcbiAgICAgIGJpbmRpbmdSZWNvcmRzLnB1c2goQmluZGluZ1JlY29yZC5jcmVhdGVEaXJlY3RpdmVEb0NoZWNrKGRpcmVjdGl2ZVJlY29yZCkpO1xuICAgIH1cbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5ob3N0UHJvcGVydGllcywgZGlyZWN0aXZlUmVjb3JkKTtcbiAgICB0ZW1wbGF0ZVZpc2l0QWxsKHRoaXMsIGFzdC5ob3N0RXZlbnRzLCBkaXJlY3RpdmVSZWNvcmQpO1xuICAgIHRlbXBsYXRlVmlzaXRBbGwodGhpcywgYXN0LmV4cG9ydEFzVmFycyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgdmlzaXREaXJlY3RpdmVQcm9wZXJ0eShhc3Q6IEJvdW5kRGlyZWN0aXZlUHJvcGVydHlBc3QsIGRpcmVjdGl2ZVJlY29yZDogRGlyZWN0aXZlUmVjb3JkKTogYW55IHtcbiAgICAvLyBUT0RPOiB0aGVzZSBzZXR0ZXJzIHNob3VsZCBldmVudHVhbGx5IGJlIGNyZWF0ZWQgYnkgY2hhbmdlIGRldGVjdGlvbiwgdG8gbWFrZVxuICAgIC8vIGl0IG1vbm9tb3JwaGljIVxuICAgIHZhciBzZXR0ZXIgPSByZWZsZWN0b3Iuc2V0dGVyKGFzdC5kaXJlY3RpdmVOYW1lKTtcbiAgICB0aGlzLmJpbmRpbmdSZWNvcmRzLnB1c2goXG4gICAgICAgIEJpbmRpbmdSZWNvcmQuY3JlYXRlRm9yRGlyZWN0aXZlKGFzdC52YWx1ZSwgYXN0LmRpcmVjdGl2ZU5hbWUsIHNldHRlciwgZGlyZWN0aXZlUmVjb3JkKSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVDaGFuZ2VEZWZpbml0aW9ucyhwdlZpc2l0b3JzOiBQcm90b1ZpZXdWaXNpdG9yW10sIGNvbXBvbmVudFR5cGU6IENvbXBpbGVUeXBlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5Db25maWc6IENoYW5nZURldGVjdG9yR2VuQ29uZmlnKTogQ2hhbmdlRGV0ZWN0b3JEZWZpbml0aW9uW10ge1xuICB2YXIgcHZWYXJpYWJsZU5hbWVzID0gX2NvbGxlY3ROZXN0ZWRQcm90b1ZpZXdzVmFyaWFibGVOYW1lcyhwdlZpc2l0b3JzKTtcbiAgcmV0dXJuIHB2VmlzaXRvcnMubWFwKHB2VmlzaXRvciA9PiB7XG4gICAgdmFyIGlkID0gYCR7Y29tcG9uZW50VHlwZS5uYW1lfV8ke3B2VmlzaXRvci52aWV3SW5kZXh9YDtcbiAgICByZXR1cm4gbmV3IENoYW5nZURldGVjdG9yRGVmaW5pdGlvbihcbiAgICAgICAgaWQsIHB2VmlzaXRvci5zdHJhdGVneSwgcHZWYXJpYWJsZU5hbWVzW3B2VmlzaXRvci52aWV3SW5kZXhdLCBwdlZpc2l0b3IuYmluZGluZ1JlY29yZHMsXG4gICAgICAgIHB2VmlzaXRvci5ldmVudFJlY29yZHMsIHB2VmlzaXRvci5kaXJlY3RpdmVSZWNvcmRzLCBnZW5Db25maWcpO1xuXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfY29sbGVjdE5lc3RlZFByb3RvVmlld3NWYXJpYWJsZU5hbWVzKHB2VmlzaXRvcnM6IFByb3RvVmlld1Zpc2l0b3JbXSk6IHN0cmluZ1tdW10ge1xuICB2YXIgbmVzdGVkUHZWYXJpYWJsZU5hbWVzOiBzdHJpbmdbXVtdID0gTGlzdFdyYXBwZXIuY3JlYXRlRml4ZWRTaXplKHB2VmlzaXRvcnMubGVuZ3RoKTtcbiAgcHZWaXNpdG9ycy5mb3JFYWNoKChwdikgPT4ge1xuICAgIHZhciBwYXJlbnRWYXJpYWJsZU5hbWVzOiBzdHJpbmdbXSA9XG4gICAgICAgIGlzUHJlc2VudChwdi5wYXJlbnQpID8gbmVzdGVkUHZWYXJpYWJsZU5hbWVzW3B2LnBhcmVudC52aWV3SW5kZXhdIDogW107XG4gICAgbmVzdGVkUHZWYXJpYWJsZU5hbWVzW3B2LnZpZXdJbmRleF0gPSBwYXJlbnRWYXJpYWJsZU5hbWVzLmNvbmNhdChwdi52YXJpYWJsZU5hbWVzKTtcbiAgfSk7XG4gIHJldHVybiBuZXN0ZWRQdlZhcmlhYmxlTmFtZXM7XG59XG4iXX0=