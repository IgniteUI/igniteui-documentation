<!--
|metadata|
{
    "fileName": "adding-igspreadsheet",
    "controlName": "igSpreadsheet",
    "tags": []
}
|metadata|
-->

# igSpreadsheet の追加

## トピックの概要 
### 目的

`igSpreadsheet`™ は、最新のあらゆるブラウザーで Excel ドキュメントを視覚化する jQuery ウィジェットです。このトピックは、このコントロールをプロジェクトに追加する手順を提供します。

### 前提条件

このトピックを理解するために [Infragistics JavaScript Excel Library](javascript-excel-library.html) の概念とトピックは前提条件です。

始まる前に、すべての必要なリソースを読み込みます。最初に jQuery リソースを読み込み、次に必要な Ignite UI リソースを読み込みます。Ignite UI リソースをプロジェクトに追加する方法が 2 つあります。`igLoader` を使用するか、必要なモジュールを読み込むことができます。このトピックで `igLoader` を使用します。

```js
$.ig.loader({
    scriptPath: "../../igniteui/js/",
    cssPath: "../../igniteui/css/",
    resources: "igSpreadsheet"
});
```
ファイルを読み込む代わりに新しい Excel ファイルを作成する場合に `igSpreadsheet` のみを読み込む必要があります。しかし、外部のファイルを読み込むには、`igExcel.LoadSaveXlsx` リソースも読み込む必要があります。
次のトピックは、`igLoader` についての使用方法を説明します。 

[Infragistics Loader による必要なリソースを自動で追加する](using-infragistics-loader.html)

## 基本的な igSpreadsheet 実装を作成する


リソースを読み込んだ後、コントロールを初期化します。以下のコードは、空のスプレッドシートを読み込む基本ウィジェットを作成する方法を紹介します。 

```js
$("#spreadsheet").igSpreadsheet({
    height: "600",
    width: "100%"
});
```

注: 空の `igSpreadsheet` を初期化する場合、初期化コードですべての利用可能なオプションを使用できます。`igSpreadsheet` で開いて表示される外部のファイルを読み込む場合、[`areGridlinesVisible`](%%jQueryApiUrl%%/ui.igspreadsheet#options:areGridlinesVisible)、[`zoomLevel`](%%jQueryApiUrl%%/ui.igspreadsheet#options:zoomLevel) などの初期設定が適用されません。読み込んだファイルの視覚的な外観はファイルの視覚的な外観と同じなります。外部のファイルの読み込みがコントロールの最初描画の後に実行されます。つまり、外部のファイルにオプションを適用するには、ファイルを読み込んだ後 (ランタイム) にオプションを呼び出します。

```js
$("#spreadsheet").igSpreadsheet({
    height: "600",
    width: "100%"
});

var workbook = null;
var xhr = new XMLHttpRequest();
xhr.open('GET', '../../data-files/FormattingData.xlsx', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function (e) {
    // response is unsigned 8 bit integer
    var responseArray = new Uint8Array(this.response);
    $.ig.excel.Workbook.load(responseArray, function () {
        workbook = arguments[0];
        //as the workbook is loaded you can call the options that you want to apply to the excel file here
        $("#spreadsheet").igSpreadsheet("option", "workbook", workbook);
    }, function () {
        console.log("fail");
    })
};

xhr.send();
```

## 関連リンク
 -   [igSpreadsheet の概要](igSpreadsheet-Overview.html)
 -   [igSpreadsheet のアクティベーションとナビゲーションのインタラクション](igSpreadsheet-Activation-and-Navigation-Interactions.html)
 -   [igSpreadsheet のビジュアル要素](igSpreadsheet-Visual-Elements.html)
 -   [igSpreadsheet の機能の概要](igSpreadsheet-Feature-Overview.html)
 -   [igSpreadsheet の選択](igSpreadsheet-Selection.html)
