<!--
|metadata|
{
    "fileName": "igsparkline-binding-to-data",
    "controlName": "igSparkline",
    "tags": ["Charting","Data Binding","Data Presentation"]
}
|metadata|
-->

# igSparkline をデータにバインド

## トピックの概要
### 目的

本トピックでは、`igSparkline`™ コントロールを各種データ ソース (JavaScript 配列、`IQueryable<T>`、Web サービス) にバインドする方法について説明します。

### 前提条件

以下の表は、このトピックを理解するために必要な、前提条件となる情報を示しています。

**概念**

-   データ バインディング
-   JSON
-   Web サービス
-   WCF サービス
-   ASP.NET MVC

**トピック**

- [igDataSource の概要](igDataSource-igDataSource-Overview.html): データ バインドされたコントロールと実際のデータ ソースとの中間層として機能する `igDataSource` コントロールに関する全般的な説明。

- [igSparkline の概要](igSparkline-Overview.html): このトピックは、`igSparkline` コントロールおよびその主要機能についての概念的情報を提供します。


## データ ソースにバインド
### サポートされるデータ ソース

`igDataChart` コントロールは以下のデータ ソースに対応しています。

データ ソース|バインディング
---|---
`igDataSource`|データ操作を管理するために、コントロールで内部で使用されます。
`IEnumerable<T>`|MVC コントローラー メソッドからデータを提供するために使用されます。



#### バインドの要件

`igDataSource` コントロールにバインドするための要件は、データ ソース毎に異なります。以下の表に、各要件カテゴリを示します。

<table class="table">
	<thead>
		<tr>
            <th>
要件のカテゴリ
			</th>

            <th>
要件の一覧
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
データ構造
			</td>

            <td>
                <ul>
                    <li>
JSON (クライアント側、あるいは Web または WCF サービスから)
					</li>

                    <li>
XML (クライアント側、あるいは Web または WCF サービスから)
					</li>

                    <li>
JavaScript 配列
					</li>

                    <li>
ASP.NET MVC の `IEnumerable<T>`
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
データ型
			</td>

            <td>
                <ul>
                    <li>
文字列値 (カテゴリ軸のデータ型)
					</li>

                    <li>
数値
					</li>

                    <li>
日付
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

#### データ ソースの要約

`igSparkline` コントロールのデータ バインドは、%%ProductName%% ライブラリの他のコントロールと同じです。データのバインドは、`dataSource` オプションにデータ ソースを割り当てるという方法で行い、データが Web または WCF サービスによって提供される場合は `dataSourceUrl` に URL を指定するという方法で行います。

データ構造|関連トピック/サンプル:
---|---
JavaScript 配列へのデータ バインド|**関連トピック**<br>[igSparkline を HTML ドキュメントに追加](igSparkline-Adding-igSparkline-to-an-HTML-Document.html)
`IEnumerable<T>` にデータ バインド|**関連トピック**<br>[igSparkline を ASP.NET MVC ビューに追加](igSparkline-Adding-igSparkline-to-an-ASPNET-MVC-View.html)
リモート データへのデータ バインド|**以下のサンプルを参照してください**<br>

#### リモート データにバインド
<div class="embed-sample">
   [%%SamplesEmbedUrl%%/sparkline/bind-to-remote-data](%%SamplesEmbedUrl%%/sparkline/bind-to-remote-data)
</div>

## 関連コンテンツ
### トピック

以下のトピックでは、このトピックに関連する追加情報を提供しています。

- [jQuery と MVC API リンク (igSparkline)](igSparkline-jQuery-and-ASPNET-MVC-API.html): このトピックでは、`igSparkline` コントロールの jQuery および ASP.NET MVC ヘルパー クラスの API ドキュメントへのリンクを提供します。


### サンプル

このトピックについては、以下のサンプルも参照してください。

- [JSON データにバインド](%%SamplesUrl%%/sparkline/bind-json): このサンプルは、`igSparkline` を JavaScript 配列にバインドする基本的な実装を示します。








