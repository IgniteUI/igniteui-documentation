<!--
|metadata|
{
    "fileName": "igdateeditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Editing","Styling","Theming"]
}
|metadata|
-->

# igDateEditor のスタイル設定とテーマ設定

`igDateEditor` コントロールは、`igEditor` を拡張する jQuery ベースのウィジェットであり、多くのスタイル設定オプションを公開します。数値エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールをコントロールに適用する必要があります。

## プログラムによるテーマの変更

次のコード リストは、マウスがコントロール上をホバーするときに、*customTheme* と呼ばれるカスタム テーマを設定する方法を示す例です。リスト 2 は、コントロールの初期化中にテーマを適用する方法を示し、リスト 3 は、コントロールの初期化後にテーマを適用する方法を示しています。どちらの場合も、リスト 1 の HTML が必要です。

**リスト 1:** 日付エディターをインスタンス化するためのベース HTML 構造 CSS スタイル

**HTML の場合:**

```
<style type="text/css">
     .customTheme .ui-igedit-hover
     { 
          background: #f0ffff;
          border-color:#a0a0a0; 
     }
</style>
<body>
     <input type="text"  id="dateEditor"  />
</body>
```

初期化中にテーマを変更するには、リスト 2 に示す方法を使用します。

**リスト 2:** 初期化中のエディター テーマの設定

**JavaScript の場合:**

```
$('#dateEditor'). igDateEditor(
{
    width: 160,
    theme: 'customTheme' ,
    renderInContainer: true
});
```

コントロールがすでに DOM に作成されている場合は、リスト 3 の方法を使って、いつでもテーマを変更できます。

**リスト 3:** 初期化後のエディター テーマの設定

**JavaScript の場合:**

```
$('#dateEditor').igDateEditor('option', 'theme', 'customTheme');
```

サポートされるカスタマイズ可能な CSS クラスの完全なリストについてはこちらをご覧ください:

[**API ドキュメント CSS クラス リスト**](%%jQueryApiUrl%%/ui.igdateeditor#theming)

## ThemeRoller の使用

`igDateEditor` コントロールも [jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用して完全にスタイルできます。リスト 4 は、Theme Switcher ドロップダウンからコントロールのテーマを変更する方法を示しています。

**リスト 4:** jQuery UI ThemeRoller を使用したエディター テーマの設定

**HTML の場合:**

```
<body>
     <input type="text"  id="dateEditor"  />
     <div id="themeRoller"></div>
</body>
```

**JavaScript の場合:**

```
$('#dateEditor'). igDateEditor({
    width: 160,
    renderInContainer: true,
    button: 'spin', 
    dateInputFormat: 'MMM/yy'
});
$('#themeRoller').themeswitcher();
```

## 関連トピック

-   [igDateEditor の概要](igDateEditor-Overview.html)
-   [igDateEditor の既知の問題](igDateEditor-Known-Issues.html)

 

 


