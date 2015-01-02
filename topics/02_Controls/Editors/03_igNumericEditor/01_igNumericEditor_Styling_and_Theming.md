<!--
|metadata|
{
    "fileName": "ignumericeditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Styling","Theming"]
}
|metadata|
-->

# igNumericEditor のスタイル設定とテーマ設定



##igNumericEditor のスタイル設定とテーマ設定


`igNumericEditor` コントロールは、`igEditor` を拡張する jQuery ベースのウィジェットであり、多くのスタイル設定オプションを公開します。数値エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールをコントロールに適用する必要があります。

##プログラムによるテーマの変更


次のコード リストは、マウスがコントロール上をホバーするときに、カスタム テーマ名、`customTheme` を設定する方法を示す例です。リスト 2 は、コントロールの初期化中にテーマを適用する方法を示し、リスト 3 は、コントロールの初期化後にテーマを適用する方法を示しています。どちらの場合も、リスト 1 の HTML が必要です。

###リスト 1: 数値エディターをインスタンス化する基本 HTML 構造 CSS スタイル

**HTML の場合:**

```
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
        color:#1CC2FF
    }
</style>
<body>
     <input type="text"  id="numericEditor"  />
</body>
```

初期化中にテーマを変更するには、リスト 2 に示す方法を使用します。

###リスト 2: 初期化中のエディター テーマの設定

**JavaScript の場合:**

```
$('#numericEditor').igNumericEditor({
    width: 160,
       dataMode: 'int',
       theme: 'customTheme'
});
```

コントロールがすでに DOM に作成されている場合は、リスト 3 の方法を使って、いつでもテーマを変更できます。

###リスト 3: 初期化後のエディター テーマの設定

jQueryUI – 初期化後にテーマ オプションを設定します。
```
$('#numericEditor').igNumericEditor ('option', 'theme', 'customTheme');
```
サポートされているカスタマイズ可能な CSS クラス一式のリストについては、[CSS クラス リスト](%%jQueryApiUrl%%/ui.igNumericEditor#!theming) をご覧ください。

##ThemeRoller の使用

`igNumericEditor` コントロールも [jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用して全体のスタイルを設定できます。リスト 4 は、Theme Switcher ドロップダウンからコントロールのテーマを変更する方法を示しています。

###リスト 4: jQuery UI ThemeRoller を使用したエディター テーマの設定

**HTML の場合:**

```
<body>
     <input type="text"  id="numericEditor"  />
     <div id="themeRoller"></div>
</body>
```

**C# の場合:**

```
$('#numericEditor').igNumericEditor({
     width: 160,
     dataMode: 'int',
     listItems: ['1234', '2567', '3367', '2578', '5373567', '623475245742'],
     button: 'dropdown'
 });
```

##関連トピック

-   [igNumericEditor の概要](igNumericEditor-Overview.html)
-   [igNumericEditor の既知の問題](igNumericEditor-Known-Issues.html)

 

 


