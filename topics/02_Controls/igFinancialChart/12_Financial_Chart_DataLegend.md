# Data Legend

The `igDataLegend` is a component that works much like the `Legend`, but it shows values of series and provides many configuration properties for filtering series rows and values columns, styling and formatting values. This legend updates when moving the mouse inside of the plot area of the `igFinancialChart` and has a persistent state that remembers the last hovered point when the user's mouse pointer exits the plot area. It displays this content using a set of three type of rows and four types of columns.

## Data Legend Rows

The rows of the `igDataLegend` include the header row, series row(s), and the summary row.

The header row displays the axis label of the point that is hovered, and can be changed using the `headerText` property.

The series row can actually be a set of rows corresponding to each series plotted in the chart. These rows will display the legend badge, series title, actual/abbreviated value of the the series, and abbreviation symbol and unit, if specified.

Finally, there is a summary row that displays the total of all series values. The default summary title can be changed using the `summaryTitleText` property of the legend. Also, you can use the `summaryType` property to customize whether you display the Total, Min, Max, or Average of series values in the summary row.

The following code snippet demonstrates setting the properties mentioned above to have a `igDataLegend` with a *Total* summary type with a custom title for the summary and a custom header:

<!-- CODE SNIPPET -->

## Data Legend Columns

The columns of the `igDataLegend` from left to right include the title column, value column, and units column.

The title column displays legend badges and series titles, which come from the `title` property of the different `Series` plotted in the chart.

The value column displays series values as abbreviated text which can be formatted using the `valueFormatAbbreviation` property to apply the same abbreviation for all numbers by setting this property to `Auto` or `Shared`. Alternatively, a user can select other abbreviations such as `Independent`, `Kilo`, `Million`, etc. Procession of abbreviated values is controlled using the `valueFormatMinFractions` and `valueFormatMaxFractions` for minimum and maximum digits, respectively.

The units column displays an abbreviation symbol and/or unit text, which can be set on the `igDataLegend` by setting the `UnitText` property.
    
The following code snippet demonstrates the `unitText` and the minimum/maximum fractions set on the `igDataLegend`:

<!-- CODE SNIPPET -->

## Data Legend Styling

The `igDataLegend` provides properties for styling each type of column. Each of these properties begins with Title, Label, Value, or Units, and you can style the text's color, font, and margin. For example, if you wanted to set the text color of each of these, you would set the `titleTextColor`, `labelTextColor`, `valueTextColor`, and `unitsTextColor` properties.

The following code snippet demonstrates how to set the styling properties mentioned above:

<!-- CODE SNIPPET -->

## Data Legend Value Formatting

The `igDataLegend` provides automatic abbreviation of large numbers using its `valueFormatAbbreviation` property. This adds a multiplier in the units column such as kilo, million, billion, etc.

You can customize the number of fractional digits that are displayed by setting the `valueFormatMinFractions` and `valueFormatMaxFractions`. This will allow you to determine the minimum and maximum number of digits that appear after the decimal point, respectively.

The following code snippet demonstrates how to set the minimum and maximum fractions of the `igDataLegend`:

<!-- CODE SNIPPET -->

## Data Legend Value Mode

You have the ability to change the default decimal display of values within the `igDataLegend` to be currency by changing the `valueFormatMode` property of the control. The `igDataLegend` also exposes the ability to modify the culture of the displayed currency symbol by using its `valueFormatCulture` property and setting it to its corresponding culture tag.

For example, the following code snippet will create a `igDataLegend` with the `valueFormatCulture` set to "en-GB" and the `valueFormatMode` set to "Currency":

<!-- CODE SNIPPET -->

## Data Legend Styling Events

The `igDataLegend` has three events that fire when rendering their corresponding row. These events are listed below with a description of what they are designed to be used for:

- `styleHeaderRow`: This event fires once when rendering the header row.
- `styleSeriesRow`: This event fires once for each series row which allows conditional styling of the values of the series.
- `styleSummaryRow`: This event fires once when rendering the summary row.

Each of the above events exposes a `DataLegendStylingRowEventArgs` parameter as its arguments, which lets you customize each item's text, text color, and the overall visibility of the row. The event arguments also expose event-specific properties. For example, since the `styleSeriesRow` event fires for each series, the event arguments will return the series index and series title for the row that represents the series.

The following code snippet demonstrates usage of the above events:

<!-- CODE SNIPPET -->