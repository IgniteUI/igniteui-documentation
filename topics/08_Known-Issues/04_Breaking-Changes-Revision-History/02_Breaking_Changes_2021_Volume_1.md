<!--
|metadata|
{
    "fileName": "breaking-changes-2021-volume-1",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# Breaking Changes 2021 Volume 1

## Charts

### Redesigned Chart Defaults
- All types of charts/series have new colors for brush/fill and outlines 

Old series brushes outlines  | New series outline brushes 
------------- | -------------
`Color_001=#7446B9`  | `Color_001=#8bdc5c`
`Color_002=#9FB328`  | `Color_002=#8b5bb1` 
`Color_003=#F96232`  | `Color_003=#6db1ff` 
`Color_004=#2E9CA6`  | `Color_004=#f8a15f` 
`Color_005=#DC3F76`  | `Color_005=#ee5879` 
`Color_006=#FF9800`  | `Color_006=#735656` 
`Color_007=#3F51B5`  | `Color_007=#f7d262` 
`Color_008=#439C47`  | `Color_008=#8ce7d9` 
`Color_009=#795548`  | `Color_009=#e051a9` 
`Color_010=#9A9A9A`  | `Color_010=#a8a8b7` 

- All types of charts/series have marker outlines with 2px thickness  

- Bar/Column/Waterfall series have outlines with 1px thickness (other series have 2px thickness) 

- Bar/Column/Waterfall series have square corners instead of rounded corners anymore 

- Point/Bubble/ScatterSeries/PolarScatter series have markers with 70% transparent fill 

- Point/Bubble/ScatterSeries/PolarScatter series have markers with fill that matches marker outline. To revert to the previous styling behavior for these series a new property has been added to the series, `MarkerFillMode`, which can be set to normal to mimic the prior behavior. 

- Scatter High Density series has new colors for min/max heat properties 

Old heat min color  | New heat min color
------------- | -------------
`#FF7446B9` | `#ff8b5bb1`

Old heat max color  | New heat max color  
------------- | -------------
`#FFC62828`  | `#ffee5879`

- Financial/Waterfall series have new colors for negative fill of their visuals 

Old negative brush | new negative brush  
------------- | -------------
`#FFC62828`  | `#ffee5879`
