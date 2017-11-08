<!--
|metadata|
{
    "fileName": "igdialog-header-and-footer",
    "controlName": "igDialog",
    "tags": ["API","How Do I"]
}
|metadata|
-->

# igDialog  のヘッダーとフッター

## トピックの概要

### 目的

このトピックでは、`igDialog`™ のフッターとヘッダーを有効にする方法、およびそれらをカスタマイズする方法を示しています。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [***igDialog* の概要**](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。

- [***igDialog*** の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**コントロールの構成の概要**](#configuration-summary)
-   [**igDialog ヘッダーの有効化と構成**](#header)
    -   [プロパティの設定](#header-property-settings)
    -   [例](#header-example)
-   [**igDialog フッターの有効化と構成**](#footer)
    -   [プロパティの設定](#footer-property-settings)
    -   [例](#footer-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="configuration-summary"></a> コントロールの構成の概要

以下の表は、`igDialog` の*ヘッダーおよびフッター* コントロールの構成可能な要素を示しています。このメソッドについては、表の下にある解説も参照してください。

<table class="table">
	<tbody>
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

		<tr>
			<td>
				`igDialog` ヘッダーの有効化と構成
			</td>

			<td>
				`igDialog` を有効にし、その要素のカスタマイズを可能にするために構成する必要があるプロパティ。
			</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:showHeader" target="_blank">showHeader</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:headerText" target="_blank">headerText</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.closeButtonTitle" target="_blank">closeButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.minimizeButtonTitle" target="_blank">minimizeButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.maximizeButtonTitle" target="_blank">maximizeButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.pinButtonTitle" target="_blank">pinButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.unpinButtonTitle" target="_blank">unpinButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:locale.restoreButtonTitle" target="_blank">restoreButtonTitle</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:imageClass" target="_blank">imageClass</a></li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				`igDialog` フッターの有効化と構成
			</td>

			<td>
				`igDialog` を有効にし、その要素のカスタマイズを可能にするために構成する必要があるプロパティ。
			</td>

			<td>
				<ul>
					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:showFooter" target="_blank">showFooter</a></li>

					<li><a href="%%jQueryApiUrl%%/ui.igDialog#options:footerText" target="_blank">footerText</a></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

ヘッダー ボタンを有効/無効にする方法については、[**最小化/最大化および固定**](igDialog-Maximize-and-Minimize.html)トピックを参照してください。



## <a id="header"></a> igDialog ヘッダーの有効化と構成

`igDialog` API は、そのヘッダーを修正するための、いくつかの API プロパティを提案します。

### <a id="header-property-settings"></a> プロパティの設定

以下の表では、目的のヘッダーをプロパティ設定にマップしています。

目的:|使用するプロパティ:|設定の選択肢:
--- | --- | ---
igDialog ヘッダーを表示します|[showHeader](%%jQueryApiUrl%%/ui.igDialog#options:showHeader) |true
igDialog ヘッダーのタイトルを設定します|[headerText](%%jQueryApiUrl%%/ui.igDialog#options:headerText) |“HEADER”
igDialog ヘッダーの画像を設定します|[imageClass](%%jQueryApiUrl%%/ui.igDialog#options:imageClass) |clsImage
igDialog ヘッダーの閉じるボタンを設定します|[closeButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.closeButtonTitle) |“X”
igDialog の最小化ボタンのタイトルを設定します|[minimizeButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.minimizeButtonTitle) |“MIN”
igDialog の最大化ボタンのタイトルを設定します|[maximizeButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.maximizeButtonTitle) |“MAX”
igDialog の固定ボタンのタイトルを設定します|[pinButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.pinButtonTitle) |“PIN”
igDialog の固定解除ボタンのタイトルを設定します|[unpinButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.unpinButtonTitle) |“UNPIN”
igDialog の復元ボタンのタイトルを設定します|[restoreButtonTitle](%%jQueryApiUrl%%/ui.igDialog#options:locale.restoreButtonTitle) |“RESTORE”


### <a id="header-example"></a> 例

下のスクリーンショットは、上記の設定を行った場合に表示される `igDialog` です。

![](images/04_5_igDialog_HeaderAndFooter_1.png)

> **注:**CSS で定義される `clsImage` のため、赤い四角形が上部にあります。
> `.clsImage { background-color: red; width: 5px; height: 5px; }`



## <a id="footer"></a> igDialog フッターの有効化と構成

`igDialog` API は、そのフッターを修正するための、2 つの API プロパティを提案します。

### <a id="footer-property-settings"></a> プロパティの設定

以下の表は、目的のヘッダー機能とプロパティ設定の対応表です。

目的:|使用するプロパティ:|設定の選択肢:
--- | --- | ---
`igDialog` フッターを表示します|[showFooter](%%jQueryApiUrl%%/ui.igDialog#options:showFooter) |true
`igDialog` フッター タイトルを設定する|[footerText](%%jQueryApiUrl%%/ui.igDialog#options:footerText) |“FOOTER”


### <a id="footer-example"></a> 例

以下のスクリーンショットは、上の設定、および前の項でのヘッダー設定の結果、`igDialog` がどのように表示されるかを示しています。

![](images/04_5_igDialog_HeaderAndFooter_2.png)



## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [***igDialog* の概要**](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。

- [***igDialog*** の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。

### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [アイコン](%%SamplesUrl%%/dialog-window/icons): `igDialog` のアイコンの表示方法を示すサンプル。





 

 


