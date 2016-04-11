'use strict';var metadata_1 = require('./metadata');
var decorators_1 = require('../util/decorators');
/**
 * Factory for creating {@link InjectMetadata}.
 */
exports.Inject = decorators_1.makeParamDecorator(metadata_1.InjectMetadata);
/**
 * Factory for creating {@link OptionalMetadata}.
 */
exports.Optional = decorators_1.makeParamDecorator(metadata_1.OptionalMetadata);
/**
 * Factory for creating {@link InjectableMetadata}.
 */
exports.Injectable = decorators_1.makeDecorator(metadata_1.InjectableMetadata);
/**
 * Factory for creating {@link SelfMetadata}.
 */
exports.Self = decorators_1.makeParamDecorator(metadata_1.SelfMetadata);
/**
 * Factory for creating {@link HostMetadata}.
 */
exports.Host = decorators_1.makeParamDecorator(metadata_1.HostMetadata);
/**
 * Factory for creating {@link SkipSelfMetadata}.
 */
exports.SkipSelf = decorators_1.makeParamDecorator(metadata_1.SkipSelfMetadata);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtTXkwS1lVODEudG1wL2FuZ3VsYXIyL3NyYy9jb3JlL2RpL2RlY29yYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUJBT08sWUFBWSxDQUFDLENBQUE7QUFDcEIsMkJBQWdELG9CQUFvQixDQUFDLENBQUE7QUFrRHJFOztHQUVHO0FBQ1EsY0FBTSxHQUFrQiwrQkFBa0IsQ0FBQyx5QkFBYyxDQUFDLENBQUM7QUFFdEU7O0dBRUc7QUFDUSxnQkFBUSxHQUFvQiwrQkFBa0IsQ0FBQywyQkFBZ0IsQ0FBQyxDQUFDO0FBRTVFOztHQUVHO0FBQ1Esa0JBQVUsR0FBeUMsMEJBQWEsQ0FBQyw2QkFBa0IsQ0FBQyxDQUFDO0FBRWhHOztHQUVHO0FBQ1EsWUFBSSxHQUFnQiwrQkFBa0IsQ0FBQyx1QkFBWSxDQUFDLENBQUM7QUFFaEU7O0dBRUc7QUFDUSxZQUFJLEdBQWdCLCtCQUFrQixDQUFDLHVCQUFZLENBQUMsQ0FBQztBQUVoRTs7R0FFRztBQUNRLGdCQUFRLEdBQW9CLCtCQUFrQixDQUFDLDJCQUFnQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBJbmplY3RNZXRhZGF0YSxcbiAgT3B0aW9uYWxNZXRhZGF0YSxcbiAgSW5qZWN0YWJsZU1ldGFkYXRhLFxuICBTZWxmTWV0YWRhdGEsXG4gIEhvc3RNZXRhZGF0YSxcbiAgU2tpcFNlbGZNZXRhZGF0YVxufSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7bWFrZURlY29yYXRvciwgbWFrZVBhcmFtRGVjb3JhdG9yfSBmcm9tICcuLi91dGlsL2RlY29yYXRvcnMnO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBJbmplY3RNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSW5qZWN0RmFjdG9yeSB7XG4gICh0b2tlbjogYW55KTogYW55O1xuICBuZXcgKHRva2VuOiBhbnkpOiBJbmplY3RNZXRhZGF0YTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgT3B0aW9uYWxNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9uYWxGYWN0b3J5IHtcbiAgKCk6IGFueTtcbiAgbmV3ICgpOiBPcHRpb25hbE1ldGFkYXRhO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBJbmplY3RhYmxlTWV0YWRhdGF9LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEluamVjdGFibGVGYWN0b3J5IHtcbiAgKCk6IGFueTtcbiAgbmV3ICgpOiBJbmplY3RhYmxlTWV0YWRhdGE7XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIFNlbGZNZXRhZGF0YX0uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZkZhY3Rvcnkge1xuICAoKTogYW55O1xuICBuZXcgKCk6IFNlbGZNZXRhZGF0YTtcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgSG9zdE1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIb3N0RmFjdG9yeSB7XG4gICgpOiBhbnk7XG4gIG5ldyAoKTogSG9zdE1ldGFkYXRhO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBTa2lwU2VsZk1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTa2lwU2VsZkZhY3Rvcnkge1xuICAoKTogYW55O1xuICBuZXcgKCk6IFNraXBTZWxmTWV0YWRhdGE7XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIEluamVjdE1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBJbmplY3Q6IEluamVjdEZhY3RvcnkgPSBtYWtlUGFyYW1EZWNvcmF0b3IoSW5qZWN0TWV0YWRhdGEpO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBPcHRpb25hbE1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBPcHRpb25hbDogT3B0aW9uYWxGYWN0b3J5ID0gbWFrZVBhcmFtRGVjb3JhdG9yKE9wdGlvbmFsTWV0YWRhdGEpO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBJbmplY3RhYmxlTWV0YWRhdGF9LlxuICovXG5leHBvcnQgdmFyIEluamVjdGFibGU6IEluamVjdGFibGVGYWN0b3J5ID0gPEluamVjdGFibGVGYWN0b3J5Pm1ha2VEZWNvcmF0b3IoSW5qZWN0YWJsZU1ldGFkYXRhKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciBjcmVhdGluZyB7QGxpbmsgU2VsZk1ldGFkYXRhfS5cbiAqL1xuZXhwb3J0IHZhciBTZWxmOiBTZWxmRmFjdG9yeSA9IG1ha2VQYXJhbURlY29yYXRvcihTZWxmTWV0YWRhdGEpO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIGNyZWF0aW5nIHtAbGluayBIb3N0TWV0YWRhdGF9LlxuICovXG5leHBvcnQgdmFyIEhvc3Q6IEhvc3RGYWN0b3J5ID0gbWFrZVBhcmFtRGVjb3JhdG9yKEhvc3RNZXRhZGF0YSk7XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgY3JlYXRpbmcge0BsaW5rIFNraXBTZWxmTWV0YWRhdGF9LlxuICovXG5leHBvcnQgdmFyIFNraXBTZWxmOiBTa2lwU2VsZkZhY3RvcnkgPSBtYWtlUGFyYW1EZWNvcmF0b3IoU2tpcFNlbGZNZXRhZGF0YSk7Il19