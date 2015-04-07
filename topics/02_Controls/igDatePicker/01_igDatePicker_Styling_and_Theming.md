<!--
|metadata|
{
    "fileName": "igdatepicker-styling-and-theming",
    "controlName": "igDatePicker",
    "tags": ["Styling","Theming"]
}
|metadata|
-->

# igDatePicker のスタイルおよびテーマ設定


`igDatePicker` コントロールは、igDateEditor を拡張する jQuery ベースのウィジェットであり、多くのスタイル設定オプションを公開します。数値エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールをコントロールに適用する必要があります。

> **注:** `igDatePicker` コントロールは、`jQuery.datepicker` のドロップダウン カレンダーを再利用するので、`jQuery.datepicker` で使用可能なスタイル オプションを使用する必要があります。

## プログラムによるテーマの変更

次のコード リストは、マウスがコントロール上をホバーするときに、*customTheme* と呼ばれるカスタム テーマを設定する方法を示す例です。リスト 2 は、コントロールの初期化中にテーマを適用する方法を示し、リスト 3 は、コントロールの初期化後にテーマを適用する方法を示しています。どちらの場合も、リスト 1 の HTML が必要です。

**リスト 1:** 日付の選択をインスタンス化するためのベース HTML 構造 CSS スタイル

**HTML の場合:**

```html
<style type="text/css">
    .customTheme .ui-igedit-hover
    { 
        background: #f0ffff; 
        border-color:#a0a0a0; 
    }

    .customTheme .ui-igedit-fieldincontainer
    { 
        height:18px; 
        float:left; 
        padding-top:0px; 
        padding-bottom:0px; 
        margin:0px; 
        color:#1CC2FF;
    }
</style>
<body>
     <input type="text"  id="datepicker"  />
</body>
```

初期化中にテーマを変更するには、リスト 2 に示す方法を使用します。

**リスト 2:** 初期化中のピッカー テーマの設定



**JavaScript の場合:**

```js
$('#datepicker').igDatePicker({
     width: 160,
     regional: 'en-US', 
        theme: 'customTheme'
});
```

コントロールがすでに DOM に作成されている場合は、リスト 3 の方法を使って、いつでもテーマを変更できます。

**リスト 3:** 初期化後のピッカー テーマの設定



**JavaScript の場合:**

```js
$('#datepicker').igDatePicker('option', 'theme', 'customTheme');
```

サポートされるカスタマイズ可能な CSS クラスの完全なリストについてはこちらをご覧ください:

## ThemeRoller の使用

`igDatePicker` コントロールも [jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用して完全にスタイルできます。リスト 4 は、Theme Switcher ドロップダウンからコントロールのテーマを変更する方法を示しています。

**リスト 4:** jQuery UI ThemeRoller を使用したピッカー テーマの設定



**HTML の場合:**

```html
<body>
     <input type="text"  id="datepicker"  />
     <div id="themeRoller" />
</body>
```



**JavaScript の場合 - igDatePicker の初期化:**

```js
$('#datepicker').igDatePicker({
    width: 160,
    regional: 'en-US'
});
$('#themeRoller').themeswitcher();
```

 

**関連トピック**

-   [igDateEditor の概要](igDateEditor-Overview.html)
-   [igDatePicker の概要](igDatePicker-Overview.html)
-   [igDatePicker 既知の問題](igDatePicker-Known-Issues.html)

 

 


