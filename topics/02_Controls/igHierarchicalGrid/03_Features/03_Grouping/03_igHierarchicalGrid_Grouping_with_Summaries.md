<!--
|metadata|
{
    "fileName": "ighierarchicalgrid-grouping-with-summaries",
    "controlName": "igHierarchicalGrid",
    "tags": []
}
|metadata|
-->

# 集計を使用したグループ化 (igHierarchicalGrid)



集計を使用したグループ化の構成 (igHierarchicalGrid)

## トピックの概要
### 目的

*igHierarchicalGrid* コントロールのグループ化機能を使用して集計値計算を構成する各種の方法をコード例で示します。

### 前提条件

以下は、このトピックを理解するための前提条件として必要なトピックを示しています。

- [igHierarchicalGrid の概要](igHierarchicalGrid-Overview.html): 機能、データ ソースへのバインド、要件、テンプレート、および相互作用などの情報を含む、igHierarchicalGrid™ コントロールの概念情報を説明します。
- [igHierarchicalGrid の初期化](igHierarchicalGrid-Initializing.html): jQuery と MVCの両方を用いた *igHierarchicalGrid* を初期化する方法を説明します。
- [igHierarchicalGrid GroupBy の概要](igHierarchicalGrid-Grouping-Overview.html): igHierarchicalGrid™ コントロールのグループ化機能を紹介し、この機能の設定項目に関する概要を示します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [集計を使用したグループ化の構成 - 概要](#configuring)
-   [コード例: デリミター、値フォーマット、および定義済みカスタム関数を使用した集計の構成](#code-example)
-   [関連コンテンツ](#related-content)


## <a id="configuring"></a> 集計を使用したグループ化の構成 - 概要

#### 集計を使用したグループ化の構成 - 表

*igHierarchicalGrid* での使用に関連する *igGridGroupBy* コントロールの構成可能な項目。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
構成可能な要素
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
集計デリミター文字
			</td>

            <td>
グループ行に表示される各種集計関数間のデリミターとなる 1 つ以上の文字の定義に使用します。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [summarySettings.multiSummaryDelimiter](%%jQueryApiUrl%%/ui.iggridgroupby_hg#options)
					</li>

                    <li>
MVC: [**GroupBySummarySettings.MultiSummaryDelimiter**](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GroupBySummarySettings~MultiSummaryDelimiter.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
集計書式
			</td>

            <td>
集計関数の出力の値の書式文字列の定義に使用します。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [summarySettings.summaryFormat](%%jQueryApiUrl%%/ui.iggridgroupby_hg#options)
					</li>

                    <li>
MVC: [**GroupBySummarySettings.SummaryFormat**](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GroupBySummarySettings~SummaryFormat.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
集計の前の集計テキスト
			</td>

            <td>
集計値の前のグループ行に表示するカスタム テキストの定義に使用します。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [columnSettings.summaries.text](%%jQueryApiUrl%%/ui.iggridgroupby_hg#options)
					</li>

                    <li>
MVC: [**GroupBySummaryWrapper.Text**](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GroupBySummaryWrapper~Text.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
集計関数
			</td>

            <td>
行、カウント、合計、平均、最小、最大など各種の定義済み集計関数を設定できます。さらに、グリッドで個別グループを作成するとき使用するカスタム グループ化比較関数の名前を構成することができます。
			</td>

            <td>
                <ul>
                    <li>
jQuery (ビルトイン): [columnSettings.summaries.summaryFunction](%%jQueryApiUrl%%/ui.iggridgroupby_hg#options)
					</li>

                    <li>
jQuery (カスタム): [columnSettings.summaries.customSummary](%%jQueryApiUrl%%/ui.iggridgroupby_hg#options)
					</li>
                </ul>

                <ul>
                    <li>
MVC (ビルトイン): [**GroupBySummaryWrapper. SummaryFunction**](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GroupBySummaryWrapper~SummaryFunction.html)
					</li>

                    <li>
MVC (カスタム): [**GroupBySummaryWrapper.CustomSummary**](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GroupBySummaryWrapper~CustomSummary.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="code-example"></a> コード例: デリミター、値フォーマット、および定義済みカスタム関数を使用した集計の構成
#### 説明

以下のコードは、igHierarchicalGrid のレイアウトの Grouping 機能を起動し、集計値計算および表示に関する以下の設定を適用します。

-   コンマと空白のデリミター (例 A, B)
-   集計値を小数点の右に 1 桁、小数点の左に先行ゼロを持つ固定小数点 10 進数として書式設定します。値が 1 より小さい場合: summaryFormat: "#0.0"。
-   Quantity 列では 2 つの集計関数が計算されます。
-   -   テキスト プレフィックス「Max:」でグループ内の最大値 (例 Max: 55.0): summaryFunction: "max", text: "Max:"。
    -   テキスト プレフィックス「Delta:」で集計値に使用する summaryDelta()used というカスタム関数: summaryFunction: "custom", customSummary: summaryDelta, text: "Delta:"。

#### コード: HTML および jQuery

**JavaScript の場合:**

```js
Code: HTML and jQuery
...
features: [{
    name: 'GroupBy',
    inherit: true,
    summarySettings: { 
        multiSummaryDelimiter: ", ", 
        summaryFormat: "#0.0" 
    },
    columnSettings: [
        { columnKey: "Bin", isGroupBy: true },
        {
            columnKey: "Quantity",
            summaries: [{
                summaryFunction: "max",
                text: "Max:"
            }, {
                summaryFunction: "custom",
                text: "Delta:",
                customSummary: summaryDelta
            }]
        }
    ]
}]
...
```

#### コード: ASP.NET MVC

**ASPX の場合:**

```csharp
Code: ASP.NET MVC
...
.Features(feature => {
    feature.GroupBy().Inherit(true)
    .SummarySettings(new GroupBySummarySettings { 
        SummaryFormat = "#0.0",
        MultiSummaryDelimiter = ","
    })
    .ColumnSettings(setting =>
    {
        setting.ColumnSetting().ColumnKey("Bin").IsGroupBy(true);
        setting.ColumnSetting().ColumnKey("Quantity").Summaries(summary =>
        {
            summary.Summary()
                .Text("Max").SummaryFunction(SummaryFunction.Max);
            summary.Summary()
                .Text("Delta").SummaryFunction(SummaryFunction.Custom).CustomSummary("summaryDelta");
        });
    });
});
...
```



## <a id="related-content"></a> 関連コンテンツ

- [グループ化の有効化と設定 (igHierarchicalGrid)](igHierarchicalGrid-Grouping-Enabling-and-Configuring.html): jQuery と MVC 両方で igHierarchicalGrid™ コントロールにグループ化機能を追加する方法を示します。





 

 


