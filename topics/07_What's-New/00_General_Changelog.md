<!--
|metadata|
{
    "fileName": "general-changelog",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# Changelog

- **Released Versions**
    - July 2025
        - [24.2.12](#24212)
        - [24.1.16](#24116)
        - [24.2.10](#24210)
    - May 2025
        - [24.2.8](#2428)
        - [24.1.14](#24114)
    - April 2025
        - [24.2.7](#2427)
        - [24.1.12](#24112)
    - February 2025
        - [24.2.6](#2426)
        - [24.1.11](#24111)
        - [23.2.60](#23260)
    - January 2025
        - [24.2.3](#2423)
    - September 2024
        - [24.1.9](#2419)
        - [23.2.58](#23258)

## <a id="24212"></a> 24.2.12

### Fixed

- Bug #36448 - Radial label format properties do not work. (eg. Title, SubTitles)
- Bug #37244 - Excel Library - Custom DataValidation not working
- Bug #37023 - DataChart - Tooltips are cut-off/offscreen if overflow is set to hidden
- Bug #37685 - Spreadsheet - Poor rendering of numbers formatted with Arial font

## <a id="24116"></a> 24.1.16

### Fixed

- Bug #36448 - Radial label format properties do not work. (eg. Title, SubTitles)
- Bug #37244 - Excel Library - Custom DataValidation not working

## <a id="24210"></a> 24.2.10

### Refactored

- Separated `igTemplating` into two modules. The original `igTemplating` no longer allows conditions and iterations (`{{if}}` and `{{each}}` clauses). This allows it to be CSP-compliant as it doesn't rely on the creation of dynamic functions. To use conditions and iterations, you need to include the new `igAdvancedTemplating` in your loader config or as a file `infragistics.templating.advanced.js`. The `infragistics.core.js` bundle continues to include both modules and therefore the full functionality of `igTemplating`.

## <a id="2428"></a> 24.2.8

### Fixed

- Replaced usage of left-over deprecated jQuery API functions
- String functions such as `startsWith` and `endsWith` are now not replaced by a polyfill in modern browsers

## <a id="24114"></a> 24.1.14

### Fixed

- Replaced usage of left-over deprecated jQuery API functions
- String functions such as `startsWith` and `endsWith` are now not replaced by a polyfill in modern browsers

## <a id="2427"></a> 24.2.7

### Fixed

- Replaced usage of additional deprecated jQuery API functions such as
    - setting `outline` to 0 through `jQuery.css`
    - `jQuery.isArray`
    - shorthand functions such as `keydown`, `mousedown`, `dblclick`, `focus`, `select`

## <a id="24112"></a> 24.1.12

### Fixed

- Replaced usage of additional deprecated jQuery API functions such as
    - setting `outline` to 0 through `jQuery.css`
    - `jQuery.isArray`
    - shorthand functions such as `keydown`, `mousedown`, `dblclick`, `focus`, `select`

## <a id="2426"></a> 24.2.6

### Fixed

- Replaced usage of deprecated jQuery API from various 3.x releases

## <a id="24111"></a> 24.1.11

### Fixed

- Replaced usage of deprecated jQuery API from various 3.x releases

## <a id="23260"></a> 23.2.60

### Fixed

- Replaced usage of deprecated jQuery API from various 3.x releases

## <a id="2423"></a> 24.2.3

### Added

- Infragistics %%ProductNameASPNETCore%% now supports ASP.NET Core for .NET 9 projects. For more information see the [Using %%ProductNameASPNETCore%%](Using-IgniteUI-Controls-in-ASP.NET-Core-project.html) topic.

- Infragistics %%ProductName%% now supports the recently released jQuery 3.7 and jQuery UI 1.14.

- igGrid and igHierarchicalGrid
   - new property `rowAttributeTemplate` allows for adding arbitrary attributes to rows [#2249](https://github.com/IgniteUI/ignite-ui/issues/2249)

- igGridFiltering
   - new property `filterCellLabelTemplate` (overridable per column through the corresponding column setting) allows for displaying visual labels in header cells providing additional information regarding the column filter [#2244](https://github.com/IgniteUI/ignite-ui/issues/2244)

## <a id="2419"></a> 24.1.9

### Fixed

- Grid Filtering - Conditions dropdown can now be navigated when using an accessibility tool [#2245](https://github.com/IgniteUI/ignite-ui/issues/2245)

### Added

- Grid Filtering - ARIA attributes indicating expand/collapse state of the conditions dropdown [#2241](https://github.com/IgniteUI/ignite-ui/issues/2241), [#2243](https://github.com/IgniteUI/ignite-ui/issues/2243)
- Grid Filtering - ARIA roles for buttons in the filtering row [#2240](https://github.com/IgniteUI/ignite-ui/issues/2240)
- Grid Filtering - more verbose ARIA label for filter inputs [#2242](https://github.com/IgniteUI/ignite-ui/issues/2242)

### Changed

- Grid - the grid's container element is no longer focusable [#2251](https://github.com/IgniteUI/ignite-ui/issues/2251)


## <a id="23258"></a> 23.2.58

### Fixed

- Grid Filtering - Conditions dropdown can now be navigated when using an accessibility tool [#2245](https://github.com/IgniteUI/ignite-ui/issues/2245)

### Added

- Grid Filtering - ARIA attributes indicating expand/collapse state of the conditions dropdown [#2241](https://github.com/IgniteUI/ignite-ui/issues/2241), [#2243](https://github.com/IgniteUI/ignite-ui/issues/2243)
- Grid Filtering - ARIA roles for buttons in the filtering row [#2240](https://github.com/IgniteUI/ignite-ui/issues/2240)
- Grid Filtering - more verbose ARIA label for filter inputs [#2242](https://github.com/IgniteUI/ignite-ui/issues/2242)

### Changed

- Grid - the grid's container element is no longer focusable [#2251](https://github.com/IgniteUI/ignite-ui/issues/2251)


