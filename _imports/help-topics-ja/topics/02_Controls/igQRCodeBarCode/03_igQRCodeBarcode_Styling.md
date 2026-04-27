<!--
|metadata|
{
    "fileName": "igqrcodebarcode-styling",
    "controlName": "igBarcode",
    "tags": ["How Do I","Styling"]
}
|metadata|
-->

# igQRCodeBarcode のスタイル設定

## トピックの概要
### 目的

このトピックでは、`igQRCodeBarcode`™ コントロールのスタイルを設定する方法を説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igQRCodeBarcode の概要](igQRCodeBarcode-Overview.html): このトピックでは、主要機能、最小要件など、`igQRCodeBarcode` コントロールの概念的情報を提供します。

- [igQRCodeBarcode の追加](igQRCodeBarcode-Adding.html): このトピック グループでは、`igQRCodeBarcode` コントロールを HTML ページと ASP.NET MVC アプリケーションに追加する方法を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
    -   [igQRCodeBarcode の外観構成の概要](#summary)
    -   [igQRCodeBarcode の外観構成の概要表](#summary-chart)
-   [igQRCodeBarcode コントロールの外観の構成](#config-appearance)
    -   [プロパティ設定](#property-settings)
    -   [例](#example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a>概要
### <a id="summary"></a>igQRCodeBarcode の外観構成の概要

`igQRCodeBarcode` は、バーの色を調整する API を公開しているため、コントロールの境界線を色付けしたりカスタム境界線の太さを指定して、ユニークでトレンディな外観を作成できます。

### <a id="summary-chart"></a>igQRCodeBarcode の外観構成の概要表

以下の表は、`igQRCodeBarcode` コントロールの外観に関連する構成可能な要素を示しています。

構成可能な項目|詳細|プロパティ
---|---|---
バーコードのバーの色|バーコードの色を設定できます。|<ul><li>[barBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:barBrush)</li></ul>
背景色|バーコードのバーの背景領域の色を指定できます。|<ul><li>[backingBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingBrush)</li></ul>
境界線の太さと色|バーコードの境界線の太さと色をカスタマイズできます。|<ul><li>[backingOutline](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingOutline)</li><li>[backingStrokeThickness](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingStrokeThickness)</li></ul>


## <a id="config-appearance"></a>igQRCodeBarcode コントロールの外観の構成
### <a id="property-settings"></a>プロパティ設定

以下の表は、要求ビヘイビアーをプロパティ設定にマップしています。

目的:|使用するプロパティ:設定の選択肢:
---|---|---
背景色の構成|[backingBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingBrush)|任意の色
バーコードのバーの色の構成|[barBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:barBrush)|任意の色
境界線の太さの構成|[backingStrokeThickness](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingStrokeThickness)|任意の値
境界線の色の構成|[backingOutline](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingOutline)|任意の色



### <a id="example"></a>例

以下のスクリーンショットは、以下の設定の結果、`igQRCodeBarcode` の外観がどのようになるか示しています。

プロパティ|値
---|---
[backingBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingBrush)|“yellow”
[barBrush](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:barBrush)|“blue”
[backingStrokeThickness](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingStrokeThickness)|“5”
[backingOutline](%%jQueryApiUrl%%/ui.igQRCodeBarcode#options:backingOutline)|“green”



![](images/igQRCodeBarcode_Styling_igQRCodeBarcode_1.png)

以下のコードはこの例を実装します。

**HTML の場合:**

```html
<head>
...
    <script type="text/jscript">
        $(function () {                        
          $("#barcode").igQRCodeBarcode({
                width: "150px",
                height: "150px",
                data: "http://www.infragistics.com",
                backingBrush: "yellow",
                barBrush: "blue",
                backingStrokeThickness:"5",
                backingOutline: "green"
           });
       });
    </script>
</head>
<body>
	<div id="barcode">
	</div>
</body>
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igQRCodeBarcode の構成](igQRCodeBarcode-Configuring.html): このトピック グループでは、`igQRCodeBarcode` コントロールのディメンション、文字エンコード、QR コード固有の設定を構成する方法を説明します。

- [アクセシビリティの遵守 (igQRCodeBarcode)](igQRCodeBarcode-Accessibility-Compliance.html): このトピックは、`igQRCodeBarcode` コントロールのアクセシビリティ機能を説明し、バーコードを含むページのアクセシビリティ遵守を実現する方法を説明します。

- [既知の問題と制限 (igQRCodeBarcode)](igQRCodeBarcode-Known-Issues-and-Limitations.html): このトピックでは、`igQRCodeBarcode` コントロールの既知の問題と制限に関する情報を提供します。

- [jQuery および MVC API リファレンス リンク (igQRCodeBarcode)](igQRCodeBarcode-API-Links.html): このトピックでは、`igQRCodeBarcode` コントロールと ASP.NET MVC ヘルパーに関する API ドキュメントへのリンクを提供します。



### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [色の構成](%%SamplesUrl%%/barcode/configuring-colors): このサンプルは、バーコードで使用する色を構成して `igQRCodeBarcode` コントロールをスタイル設定する方法を紹介します。





 

 


