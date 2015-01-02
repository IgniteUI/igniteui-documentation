<!--
|metadata|
{
    "fileName": "igtexteditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Editing","Styling","Theming"]
}
|metadata|
-->

# igTextEditor のスタイルおよびテーマ設定

## テキスト エディター スタイル オプション
`igTextEditor` コントロールは、`igEditor` を拡張する jQuery ベースのウィジェットであり、多くのスタイル設定オプションを公開します。数値エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールをコントロールに適用する必要があります。

## プログラムによるテーマの変更
次のコード リストは、マウスがコントロール上をホバーするときに、カスタム テーマ名、`customTheme` を設定する方法を示す例です。リスト 2 は、コントロールの初期化中にテーマを適用する方法を示し、リスト 3 は、コントロールの初期化後にテーマを適用する方法を示しています。どちらの場合も、リスト 1 の HTML が必要です。

>**注:** ご使用のテーマには、テキスト エディターの多くの要素にスタイル オーバーライドが含まれている場合があります。使用可能なクラスの完全なリストの詳細は、表 1 を参照してください。

###リスト 1: テキスト エディターのカスタム テーマの CSS への作成


**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-field
   { 
          outline:0; 
          border:1px solid #b09090;
          background: #EFE358;
   }
   .customTheme .ui-igedit-hover
   {
          background-color:#cccccc;
   }
   .customTheme .ui-igedit-focus
   {
          background-color:#000080;
   }
</style>
<body>
      <input type="text" id="textEditor" />
</body>
```

初期化中にテーマを変更するには、リスト 2 に示す方法を使用します。

###リスト 2: 初期化中のエディター テーマの設定



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme' ,
    renderInContainer: true
});
```

コントロールがすでに DOM に作成されている場合は、リスト 3 の方法を使って、いつでもテーマを変更できます。

###リスト 3: 初期化後のエディター テーマの設定



**JavaScript の場合:**

```
$('#textEditor').igEditor('option', 'theme', ' customTheme ');
```

>**注:** 初期化中にテーマが適用されない場合、テーマの変更はサポートされていません。また、ベース要素が INPUT 要素または TEXTAREA 要素で、`fieldInContainer` またはボタン オプションが有効でない場合、そのテーマはすでにコントロールに適用されているため変更することはできません。

## ThemeRoller の使用
`igTextEditor` コントロールも [jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用して全体のスタイルを設定できます。リスト 4 は、Theme Switcher ドロップダウンからコントロールのテーマを変更する方法を示しています。

###リスト 4: jQuery UI ThemeRoller を使用したエディター テーマの設定



**HTML の場合:**

```
<body>
     <input type="text" id="textEditor" />
     <div id="themeRoller"></div>
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme' ,
    renderInContainer: true
});
$('#themeRoller').themeswitcher();
```

## カスタム テーマの作成
次のセクションでは、カスタム テーマの作成時に使用できるクラスの詳細を説明します。まず、クラスとそのアプリケーションを示し、続いてサンプル CSS と初期化コードを示します。

### 編集フィールド

クラス名|適用される要素:
---|---
ui-igedit-field: |入力フィールド (INPUT または TEXTAREA)
ui-igedit |入力フィールド (INPUT または TEXTAREA)



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-field
   { 
          outline:0;
          border:1px solid #b09090;
          background: #EFE358;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme' ,
    renderInContainer: true
});
```

### テキスト領域

クラス名|適用される要素:
---|---
ui-igedit-textarea |フィールドと TEXTAREA



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-textarea
   { 
          resize:none; 
          overflow:auto; 
          color:#FF1105; 
          background: #f8f8b0;
   }
</style>
<body>
      <textarea id="textEditor"></textarea>
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme' ,
    renderInContainer: true
});
```

### ホバー

クラス名|適用される要素:
---|---
ui-igedit-hover|マウスのポインターをエディターの上に置いた場合の入力フィールド。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-field
   { 
          outline:0; 
          border:1px solid #b09090;
          background: #EFE358;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme',
    renderInContainer: true
});
```

### フォーカス

クラス名|適用される要素:
---|---
ui-igedit-focus |フォーカス中の入力フィールド。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-focus
   { 
          background: #C8BED3; 
          border-color:#454149; 
          color:#FF0000; 
          border-width:medium; 
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme',
    renderInContainer: true
});
```

### 境界線の色

クラス名|適用される要素:
---|---
ui-igedit-bordercolor|エディターがフォーカスを持たず、この要素の上をマウスが移動していない場合の入力フィールドおよびボタン。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-bordercolor
   { 
          border-color: #00FF3B;
          border-width:medium;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme',
    renderInContainer: true
});
```

### 無効な状態

クラス名|適用される要素:
---|---
ui-igedit-disabled|要素が無効になっている場合の入力フィールド。
ui-igedit-buttondisabled |無効な状態のボタン。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-disabled
   { 
          filter:alpha(opacity=80);
          opacity:0.8;
          color:#a09090;
          background-color:#5D5757;
          border-color:#A0A0A0;
   }
   .customTheme .ui-igedit-buttondisabled 
   { 
          filter:alpha(opacity=80);
          opacity:0.8;
          background:#5D5757;
          border-color: #A0A0A0;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    theme: 'customTheme',
    button: 'dropdown spin',
    disabled: true,
    renderInContainer: true
});
```

### 負の値

クラス名|適用される要素:
---|---
ui-igedit-negative|エディターのタイプが数値で負の値の場合の入力フィールド。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-negative
   { 
          color:#e00000;
          font-family:"Times New Roman", Times, serif;
          font-style:italic; background-color:#C4C4C4;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
       renderInContainer: true,
       type: 'numeric',
       theme: 'customTheme'
});
```

### Null 値

クラス名|適用される要素:
---|---
ui-igedit-nullvalue |エディターがフォーカスを持たず、値がない場合 (水位標) の入力フィールド。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-nullvalue{color: #0564FF;}
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
       renderInContainer: true,
       nullText: 'Enter Text', 
       theme: 'customTheme'
});
```

### コンテナーのフィールド

クラス名|適用される要素:
---|---
ui-igedit-fieldincontainer |ボタンが有効な場合など、要素がコンテナーに配置されている場合の入力フィールド。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-fieldincontainer{ height: 15px ; float:right; padding-top:0px; padding-bottom:1px; margin:2px; color: #0A22FF; background-color:#C0C4C1 }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
       renderInContainer: true,
       nullText: 'Enter Text', 
       theme: 'customTheme'
});
```

### ボタン画像状態のオーバーライド

クラス名|適用される要素:
---|---
ui-igedit-buttonsimagestateoverride |マウスのポインターをエディターの上に置いた場合、またはエディターがフォーカスを持っているが、マウスがボタンの上にない場合のボタンの画像。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-buttonsimagestateoverride
   {
          background-color:Red;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
   width: 160,
   theme: 'customTheme',
   listItems: ['Theme1', 'Theme2', 'Theme3', 'Theme4'],
   button: 'spin',
   spinRollOver: true, 
   renderInContainer: true,
   nullText: 'Select Value'
});
```

### ボタン

クラス名|適用される要素:
---|---
ui-igedit-button|エディターのドロップ ダウン ボタン。


**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-button 
   { 
          border-color: #FFC082;
          border-width:thin;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
   width: 160,
   theme: 'customTheme',
   listItems: ['Theme1', 'Theme2', 'Theme3', 'Theme4'],
   button: 'dropdown',
   spinRollOver: true, 
   renderInContainer: true,
   nullText: 'Select Value'
});
```

### ボタン ホバー

クラス名|適用される要素:
---|---
ui-igedit-buttonhover |マウスが上にある状態のボタン。



**HTML の場合:**

```
<style type="text/css">
   .customTheme .ui-igedit-buttonhover 
   {
          border-color:#272828;
          border-width:thin;
   }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
   width: 160,
   theme: 'customTheme',
   listItems: ['Theme1', 'Theme2', 'Theme3', 'Theme4'],
   button: 'dropdown',
   spinRollOver: true, 
   renderInContainer: true,
   nullText: 'Select Value'
});
```

### ボタン画像、デフォルト、プレスおよびフォーカス

クラス名|適用される要素:
---|---
ui-igedit-buttonimage |ドロップ ダウン ボタンの画像。
ui-igedit-buttondefault |デフォルト状態のボタン。
ui-igedit-buttonpressed |押した状態のボタン。
ui-igedit-buttonfocus |エディターがフォーカスを持っていない場合のボタン。



**HTML の場合:**

```
<style type="text/css">
    .customTheme .ui-igedit-buttonimage 
    { 
            background-position: 0 -192px; 
    }
    .customTheme .ui-igedit-buttondefault 
    { 
            border-color: #FFC082;
            border-width:thin;
    }
    .customTheme .ui-igedit-buttonpressed
    { 
            border-color: red;
            border-width:thin;
    }
    .customTheme .ui-igedit-buttonfocus 
    {
            border-color: Blue;
            border-width:thin;
    }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
   width: 160,
   theme: 'customTheme',
   listItems: ['Theme1', 'Theme2', 'Theme3', 'Theme4'],
   button: 'dropdown',
   renderInContainer: true,
   nullText: 'Select Value'
});
```

### リスト項目の状態

クラス名|適用される要素:
---|---
ui-igedit-listitem |ドロップ ダウン リストの項目。
ui-igedit-listitemhover |マウスを要素の上に置いた場合のドロップ ダウン リストの項目。
ui-igedit-listitemselected |ドロップ ダウン リストの選択項目。
ui-igedit-listitemcolumnborder |右側にある最後の列の横にあるドロップ ダウン リストのすべての列中の項目。

このコード スニペットは、以前適用したスタイルを有効にしたまま、各項目について HTML をスタイル設定する方法を示しています。(より複雑なデモンストレーションについては、オンライン サンプル ブラウザーをご覧ください。)



**HTML の場合:**

```
<style type="text/css">
    .customTheme .ui-igedit-listitem
    { 
            border-top: #D0B0A0 1px solid;
            font-size: 12px; 
    }
    .customTheme .ui-igedit-listitemhover 
    { 
            background-color: #757777;
    }
    .customTheme .ui-igedit-listitemselected 
    { 
            background-color: #FF4949;
    }
    .customTheme .ui-igedit-listitemcolumnborder 
    { 
            border-right: 2px groove #D09090 !important; 
    }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
   width: 160,
   theme: 'customTheme',
   button: 'dropdown',
   renderInContainer: true,
   nullText: 'Select Value',
   listColumns: 2,
   listWidth: 270,
   listItems: 
   [
    'String item',
    { text: 'Red SPAN', getHtml: function () {
    return '<span style="background:red;display:inline-block;width:10px;height:10px;">
</span> ' + this.text;
    }}
  ]
});
```

## スピン ボタンの状態

クラス名|適用される要素:
---|---
ui-igedit-spinbutton |スピン ボタン。
ui-igedit-spinlowerimage |下スピン ボタン。
ui-igedit-spinupperimage |上スピン ボタン。
ui-igedit-spinlowerimagehover |マウスのポインターが置かれた状態の下スピン ボタン。
ui-igedit-spinlowerimagepressed |押した状態の下スピン ボタン。
ui-igedit-spinupperimagehover |マウスのポインターが置かれた状態の上スピン ボタン。
ui-igedit-spinupperimagepressed |押した状態の上スピン ボタン。



**HTML の場合:**

```
<style type="text/css">
    .customTheme .ui-igedit-spinbutton 
    {
            border-color:#9090E0;
            border-width:thin;
    }
    .customTheme .ui-igedit-spinlowerimage 
    {
            background-position: -64px 0;
            background-color: #F0E0D0;
    }
    .customTheme .ui-igedit-spinupperimage 
    {
            background-position: 0 0;
            background-color: #A0E0A0;
    }
    .customTheme .ui-igedit-spinlowerimagehover 
    {
            background-color: #F0C0C0;
    }
    .customTheme .ui-igedit-spinlowerimagepressed 
    { 
            background-color: #FF9090;
    }
    .customTheme .ui-igedit-spinupperimagehover
    {
            background-color: #70E070;
    }
    .customTheme .ui-igedit-spinupperimagepressed
    {
            background-color: #00E000;
    }
</style>
<body>
      <input type="text"  id="textEditor"  />
</body>
```



**JavaScript の場合:**

```
$('#textEditor').igEditor(
{
    width: 160,
    button: 'spin',
    renderInContainer: true,
    theme: 'custom15',
    listItems: ['Theme1', 'Theme2', 'Theme3', 'Theme4'],
    nullText: 'Enter Text'
});
```
 

##関連トピック  

-   [igTextEditor の概要](igTextEditor-Overview.html)
-   [igTextEditor 既知の問題](igTextEditor-Known-Issues.html)

 

 


