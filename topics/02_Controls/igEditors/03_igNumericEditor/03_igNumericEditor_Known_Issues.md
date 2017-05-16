<!--
|metadata|
{
    "fileName": "ignumericeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igNumericEditor の既知の問題


## 既知の制約事項

- 数値エディターは編集モードでは、グループ、または 1000 のセパレーターおよび記号をサポートしません。
- [`minValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:minValue) または [`maxValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxValue) オプションを設定せずに [`spinWrapAround`](%%jQueryApiUrl%%/ui.ignumericeditor#options:spinWrapAround) を true に設定した場合、データモードで設定したデフォルトの上限に達したときにスピンをラップできません。これは [`dataMode`](%%jQueryApiUrl%%/ui.ignumericeditor#options:dataMode) オプションを float、long、または double の値に設定した場合です。
この動作の原因は、JavaScript でデータモードの最大値が指数表記で表される大きな数値であることです。
この制限を回避するには、[`maxValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxValue) および [`minValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:minValue) を JavaScript の指数表記を使用しない数値に設定します。あるいは、数値エディター、パーセント エディター、または通貨エディターで [`scientificFormat`](%%jQueryApiUrl%%/ui.ignumericeditor#options:scientificFormat) オプションを有効にしてください。

## Limitations on numeric values
The Numeric editors process and store values as JavaScript numbers. The ECMAScript standard defines those values as based on the [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point#Basic_and_interchange_formats) double-precision [64-bit binary format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) which allows for a significand of 15-17 digits while also relying on floating point arithmetic which is not always 100% accurate.
Despite some measures in place, certain functions of the editors can only operate within the limits of the platform. 

This includes representation of very large integers or high precision floating-point format, both limited by the maximum significant digits that can be stored and are usually subject to rounding and loss of precision on operations.
For example the standard maximum `long` value of `9223372036854775807` which is well above limit of stored digits, therefore is rounded to the closest supported:
```bash
> 9223372036854775807
9223372036854776000
```
Note the rounding at the 17th digit. This can cause a value to be considered at the [`maxValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxValue) much sooner despite the obvious difference in the last 3 digits, because:
```bash
> 9223372036854775807 === 9223372036854775500
true
```
With floating-point numbers the limited significant digits similarly cause rounding to occur, irregardless of the place of the decimal point. For example:
```bash
> 1.2345678912345678912345
1.234567891234568
> 1234.5678912345678912345
1234.567891234568
```
With just the point changing position, the representation cuts off at relatively the same amount of digits. This is why options like [`minDecimals`](%%jQueryApiUrl%%/ui.ignumericeditor#options:minDecimals) and [`maxDecimals`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxDecimals) while limited to 15 cannot always guarantee such values as the limit applies to the whole significant part and digits before the radix point limit the precision of the decimal side.
Formatting for the minimum can still add to the set digits, but those would be an approximation rather than the actual value.

Note that since all numbers are stored in the same format, same applies to scientific E-notation numbers regardless of the value of the exponent (if any). Furthermore, with JavaScript's `toFixed()` limited to 20 digits, values with higher exponent simply cannot be formatted to fixed-point notation (however impractical that may be).
For example `1e+21` and larger can only be presented in scientific notation even if the [`scientificFormat`](%%jQueryApiUrl%%/ui.ignumericeditor#options:scientificFormat) option has not been specifically set. Values with negative exponent (smaller than 1) do expand to fixed with rounding and are likely to evaluate to `0`, which is why `scientificFormat` should be set if support for such values is required.

## 関連リンク
- [igNumericEditor の概要](igNumericEditor-Overview.html)
