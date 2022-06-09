# Chart Data Tooltip

The `DataToolTipLayer` displays values and titles of series as well as legend badges of series in a tooltip. In addition, it provides many configuration properties of the `igDataLegend` for filtering series rows and values columns, styling, and formatting values. This tooltip type updates while moving the mouse inside of the plot area of the `igCategoryChart`, `igFinancialChart`, and `igDataChart` components.

## Data Tooltip Properties

All properties of `DataToolTipLayer` are prefixed with *DataToolTip* and exposed on API of `igCategoryChart` and `igFinancialChart` components. However, you will need to create an instance of `DataToolTipLayer` and add it to series collection of `igDataChart` component if you want to use it with Radial Charts, Polar Charts, Scatter Charts.

## Data Tooltip Elements

The `DataToolTipLayer` displays content using a set of three types of rows and four types of columns. 

### Data Tooltip Rows

The rows of the `DataToolTipLayer` include the header row, series row(s), and the summary row.

The header row displays the axis label of the point that is hovered, and can be changed using the `headerText` property.

The series row can actually be a set of rows corresponding to each series plotted in the chart. These rows will display the legend badge, series title, actual/abbreviated value of the the series, and abbreviation symbol and unit, if specified.

Finally, there is a summary row that displays the total of all series values. The default summary title can be changed using the `summaryText` property of the series. Also, you can use the `summaryType` property to customize whether you display the Total, Min, Max, or Average of series values in the summary row.

The following code snippet demonstrates setting the properties mentioned above to have a `DataToolTipLayer` with a `Total` summary type with a custom title for the summary and a custom header:

<!-- CODE SNIPPET -->

### Data Tooltip Columns

The columns of the `DataToolTipLayer` from left to right include the title column, value column, and units column.

The title column displays legend badges and series titles, which come from the `title` property of the different `series` plotted in the chart.

The value column displays series values as abbreviated text which can be formatted using the `valueFormatAbbreviation` property to apply the same abbreviation for all numbers by setting this property to `Auto` or `Shared`. Alternatively, a user can select other abbreviations such as `Independent`, `Kilo`, `Million`, etc. Procession of abbreviated values is controlled using the `valueFormatMinFractions` and `valueFormatMaxFractions` for minimum and maximum digits, respectively.

The units column displays an abbreviation symbol and/or unit text, which can be set either on the `DataToolTipLayer` by setting the `unitText` for all columns or using the following properties on each series in the chart:

* Category Series (e.g. ColumnSeries)
    ** ValueMemberAsLegendUnit="K"

* Financial Price Series:
    ** OpenMemberAsLegendUnit="K"
    ** LowMemberAsLegendUnit="K"
    ** HighMemberAsLegendUnit="K"
    ** CloseMemberAsLegendUnit="K"
    
* Range Series:
    ** LowMemberAsLegendUnit="K"
    ** HighMemberAsLegendUnit="K"
        
* Radial Series:
    ** ValueMemberAsLegendUnit="km"
    ** AngleMemberAsLegendUnit="degrees" 

* Polar Series:
    ** RadiusMemberAsLegendUnit="km"
    ** AngleMemberAsLegendUnit="degrees"
    
The following code snippet demonstrates a pair of `ColumnSeries` with the `valueMemberAsLegendUnit` properties set and the minimum/maximum fractions set on the `DataToolTipLayer`:
    
<!-- CODE SNIPPET -->

## Data Tooltip Styling

The `DataToolTipLayer` provides properties for styling each type of column. Each of these properties begins with Title, Label, Value, or Units, and you can style the text's color, font, and margin. For example, if you wanted to set the text color of each of these, you would set the `titleTextColor`, `labelTextColor`, `valueTextColor`, and `unitsTextColor` properties.

The following code snippet demonstrates how to set the styling properties mentioned above:

<!-- CODE SNIPPET -->

## Data Tooltip Grouping & Positioning

You can set the `groupingMode` property to either `Grouped` or `Individual` to group content for multiple series into single tooltip or separate content for each series in multiple tooltips. In the `Grouped` mode, you can customize where the tooltip is shown by setting the `groupedPositionModeX` and `groupedPositionModeY` properties. This essentially allows you to customize the horizontal and vertical alignments of the tooltip and whether you want it to track to the closest series points to the mouse position or pin the tooltip to edge of plot area.

The following code snippet demonstrates a `DataToolTipLayer` that will be pinned to the top-left of the chart as you scroll:

<!-- CODE SNIPPET -->

## Data Tooltip Value Formatting

The `DataToolTipLayer` provides automatic abbreviation of large numbers using its `valueFormatAbbreviation` property. This adds a multiplier in the units column such as kilo, million, billion, etc. You can customize the number of fractional digits that are displayed by setting the `valueFormatMinFractions` and `valueFormatMaxFractions`. This will allow you to determine the minimum and maximum number of digits that appear after the decimal point, respectively.

The following code snippet demonstrates how to set the minimum and maximum fractions of the `DataToolTipLayer`:

<!-- CODE SNIPPET -->

## Data Tooltip Value Mode

You can change the default decimal display of values within the `DataToolTipLayer` to be currency by changing the `valueFormatMode` property of the layer. The `DataToolTipLayer` also exposes the ability to modify the culture of the displayed currency symbol by using its `valueFormatCulture` property and setting it to its corresponding culture tag.

For example, the following code snippet will create a `DataToolTipLayer` with the `valueFormatCulture` set to "en-GB" and the `valueFormatMode` set to "Currency":

<!-- CODE SNIPPET -->