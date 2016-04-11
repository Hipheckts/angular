import { IterableDiffers } from './differs/iterable_differs';
import { DefaultIterableDifferFactory } from './differs/default_iterable_differ';
import { KeyValueDiffers } from './differs/keyvalue_differs';
import { DefaultKeyValueDifferFactory } from './differs/default_keyvalue_differ';
import { CONST_EXPR } from 'angular2/src/facade/lang';
export { DefaultKeyValueDifferFactory, KeyValueChangeRecord } from './differs/default_keyvalue_differ';
export { DefaultIterableDifferFactory, CollectionChangeRecord } from './differs/default_iterable_differ';
export { ASTWithSource, AST, AstTransformer, PropertyRead, LiteralArray, ImplicitReceiver } from './parser/ast';
export { Lexer } from './parser/lexer';
export { Parser } from './parser/parser';
export { Locals } from './parser/locals';
export { DehydratedException, ExpressionChangedAfterItHasBeenCheckedException, ChangeDetectionError } from './exceptions';
export { ChangeDetectorDefinition, DebugContext, ChangeDetectorGenConfig } from './interfaces';
export { ChangeDetectionStrategy, CHANGE_DETECTION_STRATEGY_VALUES } from './constants';
export { DynamicProtoChangeDetector } from './proto_change_detector';
export { JitProtoChangeDetector } from './jit_proto_change_detector';
export { BindingRecord, BindingTarget } from './binding_record';
export { DirectiveIndex, DirectiveRecord } from './directive_record';
export { DynamicChangeDetector } from './dynamic_change_detector';
export { ChangeDetectorRef } from './change_detector_ref';
export { IterableDiffers } from './differs/iterable_differs';
export { KeyValueDiffers } from './differs/keyvalue_differs';
export { WrappedValue, SimpleChange } from './change_detection_util';
/**
 * Structural diffing for `Object`s and `Map`s.
 */
export const keyValDiff = CONST_EXPR([CONST_EXPR(new DefaultKeyValueDifferFactory())]);
/**
 * Structural diffing for `Iterable` types such as `Array`s.
 */
export const iterableDiff = CONST_EXPR([CONST_EXPR(new DefaultIterableDifferFactory())]);
export const defaultIterableDiffers = CONST_EXPR(new IterableDiffers(iterableDiff));
export const defaultKeyValueDiffers = CONST_EXPR(new KeyValueDiffers(keyValDiff));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlX2RldGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdEd3c2p6ZEwudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2NoYW5nZV9kZXRlY3Rpb24vY2hhbmdlX2RldGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLGVBQWUsRUFBd0IsTUFBTSw0QkFBNEI7T0FDMUUsRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1DQUFtQztPQUN2RSxFQUFDLGVBQWUsRUFBd0IsTUFBTSw0QkFBNEI7T0FDMUUsRUFDTCw0QkFBNEIsRUFFN0IsTUFBTSxtQ0FBbUM7T0FDbkMsRUFBQyxVQUFVLEVBQUMsTUFBTSwwQkFBMEI7QUFFbkQsU0FDRSw0QkFBNEIsRUFDNUIsb0JBQW9CLFFBQ2YsbUNBQW1DLENBQUM7QUFDM0MsU0FDRSw0QkFBNEIsRUFDNUIsc0JBQXNCLFFBQ2pCLG1DQUFtQyxDQUFDO0FBQzNDLFNBQ0UsYUFBYSxFQUNiLEdBQUcsRUFDSCxjQUFjLEVBQ2QsWUFBWSxFQUNaLFlBQVksRUFDWixnQkFBZ0IsUUFDWCxjQUFjLENBQUM7QUFFdEIsU0FBUSxLQUFLLFFBQU8sZ0JBQWdCLENBQUM7QUFDckMsU0FBUSxNQUFNLFFBQU8saUJBQWlCLENBQUM7QUFDdkMsU0FBUSxNQUFNLFFBQU8saUJBQWlCLENBQUM7QUFFdkMsU0FDRSxtQkFBbUIsRUFDbkIsK0NBQStDLEVBQy9DLG9CQUFvQixRQUNmLGNBQWMsQ0FBQztBQUN0QixTQUlFLHdCQUF3QixFQUN4QixZQUFZLEVBQ1osdUJBQXVCLFFBQ2xCLGNBQWMsQ0FBQztBQUN0QixTQUFRLHVCQUF1QixFQUFFLGdDQUFnQyxRQUFPLGFBQWEsQ0FBQztBQUN0RixTQUFRLDBCQUEwQixRQUFPLHlCQUF5QixDQUFDO0FBQ25FLFNBQVEsc0JBQXNCLFFBQU8sNkJBQTZCLENBQUM7QUFDbkUsU0FBUSxhQUFhLEVBQUUsYUFBYSxRQUFPLGtCQUFrQixDQUFDO0FBQzlELFNBQVEsY0FBYyxFQUFFLGVBQWUsUUFBTyxvQkFBb0IsQ0FBQztBQUNuRSxTQUFRLHFCQUFxQixRQUFPLDJCQUEyQixDQUFDO0FBQ2hFLFNBQVEsaUJBQWlCLFFBQU8sdUJBQXVCLENBQUM7QUFDeEQsU0FDRSxlQUFlLFFBSVYsNEJBQTRCLENBQUM7QUFDcEMsU0FBUSxlQUFlLFFBQThDLDRCQUE0QixDQUFDO0FBRWxHLFNBQVEsWUFBWSxFQUFFLFlBQVksUUFBTyx5QkFBeUIsQ0FBQztBQUVuRTs7R0FFRztBQUNILGFBQWEsVUFBVSxHQUNuQixVQUFVLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSw0QkFBNEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWpFOztHQUVHO0FBQ0gsYUFBYSxZQUFZLEdBQ3JCLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLDRCQUE0QixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakUsYUFBYSxzQkFBc0IsR0FBRyxVQUFVLENBQUMsSUFBSSxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztBQUVwRixhQUFhLHNCQUFzQixHQUFHLFVBQVUsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJdGVyYWJsZURpZmZlcnMsIEl0ZXJhYmxlRGlmZmVyRmFjdG9yeX0gZnJvbSAnLi9kaWZmZXJzL2l0ZXJhYmxlX2RpZmZlcnMnO1xuaW1wb3J0IHtEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5fSBmcm9tICcuL2RpZmZlcnMvZGVmYXVsdF9pdGVyYWJsZV9kaWZmZXInO1xuaW1wb3J0IHtLZXlWYWx1ZURpZmZlcnMsIEtleVZhbHVlRGlmZmVyRmFjdG9yeX0gZnJvbSAnLi9kaWZmZXJzL2tleXZhbHVlX2RpZmZlcnMnO1xuaW1wb3J0IHtcbiAgRGVmYXVsdEtleVZhbHVlRGlmZmVyRmFjdG9yeSxcbiAgS2V5VmFsdWVDaGFuZ2VSZWNvcmRcbn0gZnJvbSAnLi9kaWZmZXJzL2RlZmF1bHRfa2V5dmFsdWVfZGlmZmVyJztcbmltcG9ydCB7Q09OU1RfRVhQUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcblxuZXhwb3J0IHtcbiAgRGVmYXVsdEtleVZhbHVlRGlmZmVyRmFjdG9yeSxcbiAgS2V5VmFsdWVDaGFuZ2VSZWNvcmRcbn0gZnJvbSAnLi9kaWZmZXJzL2RlZmF1bHRfa2V5dmFsdWVfZGlmZmVyJztcbmV4cG9ydCB7XG4gIERlZmF1bHRJdGVyYWJsZURpZmZlckZhY3RvcnksXG4gIENvbGxlY3Rpb25DaGFuZ2VSZWNvcmRcbn0gZnJvbSAnLi9kaWZmZXJzL2RlZmF1bHRfaXRlcmFibGVfZGlmZmVyJztcbmV4cG9ydCB7XG4gIEFTVFdpdGhTb3VyY2UsXG4gIEFTVCxcbiAgQXN0VHJhbnNmb3JtZXIsXG4gIFByb3BlcnR5UmVhZCxcbiAgTGl0ZXJhbEFycmF5LFxuICBJbXBsaWNpdFJlY2VpdmVyXG59IGZyb20gJy4vcGFyc2VyL2FzdCc7XG5cbmV4cG9ydCB7TGV4ZXJ9IGZyb20gJy4vcGFyc2VyL2xleGVyJztcbmV4cG9ydCB7UGFyc2VyfSBmcm9tICcuL3BhcnNlci9wYXJzZXInO1xuZXhwb3J0IHtMb2NhbHN9IGZyb20gJy4vcGFyc2VyL2xvY2Fscyc7XG5cbmV4cG9ydCB7XG4gIERlaHlkcmF0ZWRFeGNlcHRpb24sXG4gIEV4cHJlc3Npb25DaGFuZ2VkQWZ0ZXJJdEhhc0JlZW5DaGVja2VkRXhjZXB0aW9uLFxuICBDaGFuZ2VEZXRlY3Rpb25FcnJvclxufSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuZXhwb3J0IHtcbiAgUHJvdG9DaGFuZ2VEZXRlY3RvcixcbiAgQ2hhbmdlRGV0ZWN0b3IsXG4gIENoYW5nZURpc3BhdGNoZXIsXG4gIENoYW5nZURldGVjdG9yRGVmaW5pdGlvbixcbiAgRGVidWdDb250ZXh0LFxuICBDaGFuZ2VEZXRlY3RvckdlbkNvbmZpZ1xufSBmcm9tICcuL2ludGVyZmFjZXMnO1xuZXhwb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ0hBTkdFX0RFVEVDVElPTl9TVFJBVEVHWV9WQUxVRVN9IGZyb20gJy4vY29uc3RhbnRzJztcbmV4cG9ydCB7RHluYW1pY1Byb3RvQ2hhbmdlRGV0ZWN0b3J9IGZyb20gJy4vcHJvdG9fY2hhbmdlX2RldGVjdG9yJztcbmV4cG9ydCB7Sml0UHJvdG9DaGFuZ2VEZXRlY3Rvcn0gZnJvbSAnLi9qaXRfcHJvdG9fY2hhbmdlX2RldGVjdG9yJztcbmV4cG9ydCB7QmluZGluZ1JlY29yZCwgQmluZGluZ1RhcmdldH0gZnJvbSAnLi9iaW5kaW5nX3JlY29yZCc7XG5leHBvcnQge0RpcmVjdGl2ZUluZGV4LCBEaXJlY3RpdmVSZWNvcmR9IGZyb20gJy4vZGlyZWN0aXZlX3JlY29yZCc7XG5leHBvcnQge0R5bmFtaWNDaGFuZ2VEZXRlY3Rvcn0gZnJvbSAnLi9keW5hbWljX2NoYW5nZV9kZXRlY3Rvcic7XG5leHBvcnQge0NoYW5nZURldGVjdG9yUmVmfSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rvcl9yZWYnO1xuZXhwb3J0IHtcbiAgSXRlcmFibGVEaWZmZXJzLFxuICBJdGVyYWJsZURpZmZlcixcbiAgSXRlcmFibGVEaWZmZXJGYWN0b3J5LFxuICBUcmFja0J5Rm5cbn0gZnJvbSAnLi9kaWZmZXJzL2l0ZXJhYmxlX2RpZmZlcnMnO1xuZXhwb3J0IHtLZXlWYWx1ZURpZmZlcnMsIEtleVZhbHVlRGlmZmVyLCBLZXlWYWx1ZURpZmZlckZhY3Rvcnl9IGZyb20gJy4vZGlmZmVycy9rZXl2YWx1ZV9kaWZmZXJzJztcbmV4cG9ydCB7UGlwZVRyYW5zZm9ybX0gZnJvbSAnLi9waXBlX3RyYW5zZm9ybSc7XG5leHBvcnQge1dyYXBwZWRWYWx1ZSwgU2ltcGxlQ2hhbmdlfSBmcm9tICcuL2NoYW5nZV9kZXRlY3Rpb25fdXRpbCc7XG5cbi8qKlxuICogU3RydWN0dXJhbCBkaWZmaW5nIGZvciBgT2JqZWN0YHMgYW5kIGBNYXBgcy5cbiAqL1xuZXhwb3J0IGNvbnN0IGtleVZhbERpZmY6IEtleVZhbHVlRGlmZmVyRmFjdG9yeVtdID1cbiAgICBDT05TVF9FWFBSKFtDT05TVF9FWFBSKG5ldyBEZWZhdWx0S2V5VmFsdWVEaWZmZXJGYWN0b3J5KCkpXSk7XG5cbi8qKlxuICogU3RydWN0dXJhbCBkaWZmaW5nIGZvciBgSXRlcmFibGVgIHR5cGVzIHN1Y2ggYXMgYEFycmF5YHMuXG4gKi9cbmV4cG9ydCBjb25zdCBpdGVyYWJsZURpZmY6IEl0ZXJhYmxlRGlmZmVyRmFjdG9yeVtdID1cbiAgICBDT05TVF9FWFBSKFtDT05TVF9FWFBSKG5ldyBEZWZhdWx0SXRlcmFibGVEaWZmZXJGYWN0b3J5KCkpXSk7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0SXRlcmFibGVEaWZmZXJzID0gQ09OU1RfRVhQUihuZXcgSXRlcmFibGVEaWZmZXJzKGl0ZXJhYmxlRGlmZikpO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdEtleVZhbHVlRGlmZmVycyA9IENPTlNUX0VYUFIobmV3IEtleVZhbHVlRGlmZmVycyhrZXlWYWxEaWZmKSk7XG4iXX0=