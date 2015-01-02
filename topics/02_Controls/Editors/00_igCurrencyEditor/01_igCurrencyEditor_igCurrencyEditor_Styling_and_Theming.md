<!--
|metadata|
{
    "fileName": "igcurrencyeditor-igcurrencyeditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Styling","Theming"]
}
|metadata|
-->

# igCurrencyEditor のスタイルおよびテーマ設定

`igCurrencyEditor` コントロールは、`igEditor` を拡張する jQuery ベースのウィジェットであり、多くのスタイル設定オプションを公開します。数値エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールをコントロールに適用する必要があります。

## プログラムによるテーマの変更

次のコード リストは、マウスがコントロール上をホバーするときに、カスタム テーマ名、*"customTheme"* を設定する方法を示す例です。リスト 2 は、コントロールの初期化中にテーマを適用する方法を示し、リスト 3 は、コントロールの初期化後にテーマを適用する方法を示しています。どちらの場合も、リスト 1 の HTML が必要です。

**リスト 1:** 通貨エディターをインスタンス化するためのベース HTML 構造 CSS スタイル


HTML の場合:

```
<style type="text/css">
    .customTheme .ui-igedit-hover{ background: #f0ffff; border-color:#a0a0a0; }
    .customTheme .ui-igedit-fieldincontainer { 
		height:18px; float:left; padding-top:0px; padding-bottom:0px; margin:0px; color:#1CC2FF
	}
</style>
<body>
     <input type="text"  id="currencyEditor"  />
</body>
```

初期化中にテーマを変更するには、リスト 2 に示す方法を使用します。

**リスト 2:** 初期化中のエディター テーマの設定

JavaScript の場合:

```
$('#currencyEditor').igCurrencyEditor({
    width: 160,
    theme: 'customTheme'
});
```

コントロールがすでに DOM に作成されている場合は、リスト 3 の方法を使って、いつでもテーマを変更できます。

**リスト 3:** 初期化後のエディター テーマの設定

JavaScript の場合:

```
$('# currencyEditor').igCurrencyEditor('option', 'theme', 'customTheme');
```

サポートされるカスタマイズ可能な CSS クラスの完全なリストについてはこちらをご覧ください:

## ThemeRoller の使用
igCurrencyEditor コントロールも [jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用して完全にスタイルできます。リスト 4 は、Theme Switcher ドロップダウンからコントロールのテーマを変更する方法を示しています。

**リスト 4:** jQuery UI ThemeRoller を使用したエディター テーマの設定

HTML の場合:

```
<body>
     <input type="text"  id="currencyEditor"  />
     <div id="themeRoller" />
</body>
```



JavaScript の場合 - パーセント エディターの初期化:

```
$('#currencyEditor').igCurrencyEditor({
    width: 160,
    listItems: [1234, 2567, 3367, 2578, 5373567, 23475245742],
    button: 'dropdown'
});
$('#themeRoller').themeswitcher();
```

## 関連トピック

-   [igCurrencyEditor の概要](igCurrencyEditor-igCurrencyEditor-Overview.html)
-   [igCurrencyEditor 既知の問題](igCurrencyEditor-igCurrencyEditor-Known-Issues.html)

 

 


