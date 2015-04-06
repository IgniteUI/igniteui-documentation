<!--
|metadata|
{
    "fileName": "igcurrencyeditor-igcurrencyeditor-options",
    "controlName": "igEditors",
    "tags": ["API"]
}
|metadata|
-->

# igCurrencyEditor プロパティ参照

## 通貨エディター オプション

`igCurrencyEditor` は通貨編集機能を可能にするエディタ コントロールで、さまざまな外観および動作ベースのプロパティを提供します。`igCurrencyEditor` コントロールは `igNumericEditor` を拡張し、`igNumericEditor` のオプションに加えて、多数の異なる通貨関連オプションを公開しています。

## 地域オプション

プロパティ名|タイプ|デフォルト値
---|---|---
regional|Object、String|null

regional オプションでは、エディターの各種オプションのカルチャ関連の値を定義できます。そのオプションの値が String (「bg」または「fr」など) の場合、エディターは `$.ui.igEditor.regional[valueOfOption]` オブジェクトを見つけて使用しようとします。オブジェクトの値にはキー/値のペアまたはキー:値のメンバーが含まれます。これらは、エディターが `currencyGroups`、`currencyDecimalSeparator` などの対応するカルチャ関連機能およびコントロールのその他のカルチャ依存属性を調整する場合に使用します。

デフォルトでは `igCurrencyEditor` コントロールは `$.ig.regional.defaults` オブジェクトからカルチャ関連のオプションを取得します。たとえば、`$.ig.regional.defaults.currencySymbol` は記号文字列を定義します。すべてのエディターのデフォルト値を変更するには、`$.ig.setRegionalDefault(objectOrString)` を使用できます。

**リスト 1:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="regionalCurrency" type="text" value="1234.56"/>
```

**リスト 2:** 初期化中の地域設定

JavaScript の場合:

```
$('#regionalCurrency').igCurrencyEditor(
{    
    width: 100, 
       regional: "en-US"
});
```

**リスト 3:** 初期化後の地域設定

JavaScript の場合:

```
$('#regionalCurrency').igCurrencyEditor('option', 'regional', 'bg');
```

## 下位オプション

Regional オプションも多数の下位オプションをサポートします。各オプションの詳細を以下に説明します。

### currencySymbol

プロパティ名|タイプ|デフォルト値
---|---|---
currencySymbol|String|“$”

`currencySymbol` オプションでは、コントロールのカスタム通貨記号を設定できます。通貨記号を設定すると、regional オプションで設定されたデフォルト通貨記号が上書きされます。通貨記号は表示モードで使用されます。

**リスト 4:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="customCurrencySymbolEditor" type="text" value="1234.56"/>
```

**リスト 5:** 初期化中の地域設定

jQueryUI - 初期化後に **currencySymbol** オプションを設定します。

```
$('#customCurrencySymbolEditor').igCurrencyEditor(
{
	width: 100,
	currencyPositivePattern: "$ n",
	currencySymbol: "£"
});
```

**リスト 6:** 初期化後の地域設定

jQueryUI - 初期化後に **currencySymbol** オプションを設定します。

```
$('#customCurrencySymbolEditor').igCurrencyEditor('option', 'currencySymbol', "$");
```

### currencyPositivePattern

プロパティ名|タイプ|デフォルト値
---|---|---
currencyPositivePattern|String|“$n”

その `currencyPositivePattern` オプションは、正の数値の表示モード パターンを定義します。「$」フラグは `currencySymbol` を表し、「n」フラグは数値を表します。これら 2 つのフラグを使用すると、ニーズに最も合ったカスタム パターンをビルドできます。

> **注:** `currencySymbol` フラグと「n」フラグ両方ともパターンで 1 回しか使用できません。次に使用した「n」フラグは、文字「n」として表示されます。それぞれ次に使用した「$」は、パターンで「$」として表示されます。通貨記号と数値の順序を変更したり、当然のことながらパターンにスペースやカスタム文字を追加することもできます。

**リスト 7:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="positivePatternCurrency" type="text" value="1234.56"/>
```

**リスト 8:** 初期化中の地域設定

JavaScript の場合:

```
$('#positivePatternCurrency').igCurrencyEditor(
{
    width: 100,
    currencyPositivePattern: "$ n"
});
```

**リスト 9:** 初期化後の地域設定

JavaScript の場合:

```
$('#positivePatternCurrency').igCurrencyEditor('option', 'currencyPositivePattern', "$ n");
```

### currencyNegativePattern

プロパティ名|タイプ|デフォルト値
---|---|---
currencyNegativePattern|String|“$(n)”

その `currencyNegativePattern` オプションは、負の数値の表示モード パターンを定義します。「$」フラグは `currencySymbol` を表し、「n」フラグは数値を表します。「-」および「()」フラグは、パターンの静的部分です。

> **注:** `currencySymbol` フラグと「n」フラグ両方ともパターンで 1 回しか使用できません。次に使用した「n」フラグは、文字「n」として表示されます。それぞれ次に使用した「$」は、パターンで「$」として表示されます。通貨記号と数値の順序を変更したり、当然のことながらパターンにスペースやカスタム文字を追加することもできます。

**リスト 10:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="negativePatternCurrency" type="text" value="-1234.56"/>
```

**リスト 11:** 初期化中の地域設定

JavaScript の場合:

```
$('#negativePatternCurrency').igCurrencyEditor(
{
    width: 100,
    currencyNegativePattern: "$ -n"
});
```

**リスト 12:** 初期化後の地域設定

JavaScript の場合:

```
$('#positivePatternCurrency').igCurrencyEditor('option', 'currencyPositivePattern', "$ -n");
```

### currencyDecimalSeparator
プロパティ名|タイプ|デフォルト値
---|---|---
currencyDecimalSeparator|String|“.”

`currencyDecimalSeparator` オプションでは、`igCurrencyEditor` コントロールのカスタム小数点区切り記号を設定できます。

**リスト 13:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="decimalCurrencySeparator" type="text" value="1234.56"/>
```

**リスト 14:** 初期化中の地域設定

JavaScript の場合:

```
$('#decimalCurrencySeparator').igCurrencyEditor(
{    
    width: 100,
    currencyDecimalSeparator: "."
});
```

**リスト 15:** 初期化中の地域設定

JavaScript の場合:

```
$('#decimalCurrencySeparator').igCurrencyEditor('option', 'currencyDecimalSeparator', ",");
```

### currencyGroupSeparator

プロパティ名|タイプ|デフォルト値
---|---|---
currencyGroupSeparator|String|“,”

`currencyGroupSeparator` オプションは、千の単位などグループのセパレーターとして使用されている文字を定義します。

>**注:** このオプションは、表示モードでのみ表示されます。

**リスト 16:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="currencyGroupSeparator" type="text" value="12345678.56"/>
```

**リスト 17:** 初期化中の地域設定

JavaScript の場合:

```
$('#currencyGroupSeparator').igCurrencyEditor(
{    
    width: 100,
       currencyGroupSeparator: ","
});
```

**リスト 18:** 初期化後の地域設定

JavaScript の場合:

```
$('#currencyGroupSeparator').igCurrencyEditor('option', 'currencyGroupSeparator', ".");
```

### currencyGroups

プロパティ名|タイプ|デフォルト値
---|---|---
currencyGroups|Number オブジェクトの配列。|[3]

`currencyGroups` オプションは、グループに分割される数字の整数部分の桁数を定義します。`currencyGroupSeparator` はグループの間に挿入されます。配列のすべての値の合計が整数部分の長さより小さい場合、以降のグループすべてについて、配列の最後の項目が使用されます。グループのカウントは小数点記号から (右から左へ) 始まります。

> **注:** このオプションは、表示モードでのみ表示されます。

**リスト 19:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="currencyGroup" type="text" value="12345678.56"/>
```

**リスト 20:** 初期化中の地域設定

JavaScript の場合:

```
$('#currencyGroup').igCurrencyEditor(
{    
    width: 100,
    currencyGroups: [4]
});
```

**リスト 21:** 初期化後の地域設定

JavaScript の場合:

```
$('#currencyGroup').igCurrencyEditor('option', 'currencyGroups' , [6]);
```

### currencyMaxDecimals

プロパティ名|タイプ|デフォルト値
---|---|---
currencyMaxDecimals|数値|2

`currencyMaxDecimals` オプションは、表示モードで使用されている小数点以下の最大桁数を定義します。小数部分の桁数が定義されている桁数より多い場合、エディターは値を四捨五入します。たとえば、`currencyMaxDecimals` がデフォルト値で値 12.573 をコントロールに入力すると、12.57 という結果になります。または、入力した値が 12.576 の場合は 12.58 という結果になります。

**リスト 22:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="maxDecimalCurrencyEditor" type="text" value="1234.56768696"/>
```

**リスト 23:** 初期化中の地域設定

JavaScript の場合:

```
$('#maxDecimalCurrencyEditor').igCurrencyEditor(
{    
    width: 150,
       currencyMaxDecimals: 2
});
```

**リスト 24:** 初期化後の地域設定

JavaScript の場合:

```
$('#maxDecimalCurrencyEditor').igCurrencyEditor('option', 'currencyMaxDecimals' , 4);
```

### currencyMinDecimals

プロパティ名|タイプ|デフォルト値
---|---|---
currencyMinDecimals|数値|2

`currencyMinDecimals` オプションは、表示モードで使用されている小数点以下の最小桁数を定義します。小数部分の桁数がこのオプションの値より少ない場合、「0」記号を使用して欠けている桁数を埋めます。

**リスト 25:** 地域オプションの描画に使用する HTML 要素

HTML の場合:

```
<input id="minDecimalCurrencyEditor" type="text" value="1234.5"/>
```

**リスト 26:** 初期化中の地域設定

JavaScript の場合:

```
$('#minDecimalCurrencyEditor').igCurrencyEditor(
{    
    width: 150,
       currencyMinDecimals: 2
});
```

**リスト 27:** 初期化後の地域設定

JavaScript の場合:

```
$('#minDecimalCurrencyEditor').igCurrencyEditor('option', 'currencyMinDecimals', 4);
```

