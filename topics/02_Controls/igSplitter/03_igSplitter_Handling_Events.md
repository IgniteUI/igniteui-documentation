<!--
|metadata|
{
    "fileName": "igsplitter-handling-events",
    "controlName": "igSplitter",
    "tags": ["Events","How Do I","Layouts"]
}
|metadata|
-->

# イベントの処理



## トピックの概要
### 目的

このトピックは、イベント ハンドラーを `igSplitter`™ にアタッチする方法をコード例を用いて説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [igSplitter の概要](igSplitter-Overview.html): このトピックでは、機能、ユーザー機能性など、`igSplitter` コントロールに関する概念的な情報を提供します。

- [igSplitter の追加](Adding-igSplitter.html): このトピックは、JavaScript および ASP.NET MVC のいずれかで `igSplitter` コントロールを HTML ページへ追加する方法をコード例を用いて説明します。


### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [イベントの処理 - 概要](#overview)
    -   [イベント処理の概要](#summary)
    -   [イベント処理ケースの概要表](#summary-chart)
-   [コード例](#code-example)
-   [コード例: jQuery の初期化時に resizeStarted イベントを処理する](#init-jquery)
    -   [説明](#jquery-description)
    -   [コード](#jquery-code)
-   [コード例: ASP.NET MVCで実行時に resizeStarted イベントを処理する](#run-time-mvc)
    -   [説明](#mvc-description)
    -   [コード](#mvc-code)
-   [スプリッター API およびイベント サンプル](#demo)
-   [関連コンテンツ](#related-content)



## <a id="overview"></a>イベントの処理 - 概要
### <a id="summary"></a>イベント処理の概要

イベント ハンドラー関数の `igSplitter` コントロールへのアタッチは、一般的にコントロールの初期化時に行われます。このイベントが発生すると、処理関数を呼び出します。

HTML ヘルパー内ではイベント ハンドラーを定義できないので、%%ProductNameMVC%% を使用するときは、実行時にイベント ハンドラーを割り当てる必要があります。

jQuery はイベント ハンドラーの割り当てるための以下のメソッドをサポートします。

-   bind()
-   delegate()
-   live()
-   on()

この中では delegate() メソッドをお勧めします。これは、このメソッドがパフォーマンスに優れ、コントロール インスタンスが破棄されて、再作成しなければならない状況でもイベント ハンドラーを自動的に再アタッチできるためです。

`igSplitter` は、以下のイベントをサポートします:

-   collapsed - パネルの折りたたみが完了すると処理されます。どのパネルが折りたたまれたかを示します。
-   expanded - パネルの展開が終了すると処理されます。どのパネルが展開されたかを示します。
-   resizeStarted - スプリッターが移動を開始するとサイズ変更パネルに対して発生します。
-   resizing - スプリッターがコンテナー内で移動していると継続して発生します。スプリッターの移動をキャンセルするために使用します。
-   resizeEnded - スプリッターが移動を停止するとサイズ変更パネルに対して発生します。
-   layoutRefreshed - ブラウザーのサイズ変更のため、パネルが更新された後に発生します。
-   layoutRefreshing - ブラウザーのサイズ変更のため、パネルが更新される前に発生します。

### <a id="summary-chart"></a>イベント処理ケースの概要表

以下の表は、`igSplitter` に関係するイベント処理ケースを簡単に説明します。詳細は、表の後に記載されています。

<table class="table">
	<thead>
		<tr>
            <th>
イベント処理ケース
			</th>
            <th>
詳細
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
jQuery における初期化時のイベント処理
			</td>
            <td>
                ウィジェット初期化時にイベントへバインドすると、以下の形式でオプションを使用してイベントをサブスクライブします。
                `eventName`: <handler>
                </handler>
                `eventName` オプションの有効な設定
                <ul>
                    <li>
collapsed
					</li>
                    <li>
expanded
					</li>
                    <li>
resizeStarted
					</li>
                    <li>
resizing
					</li>
                    <li>
resizeEnded
					</li>
                    <li>
layoutRefreshed
					</li>
                    <li>
layoutRefreshing
					</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>
jQuery および ASP.NET MVC で実行時にイベントを処理
			</td>

            <td>
コントロール初期化の外側でハンドラーを実装するために、イベント ハンドラーを関数名に割り当てることができます。
			</td>
        </tr>
    </tbody>
</table>



## <a id="code-example"></a>コード例
### コード例の概要

以下の表は、このトピックで使用したコード例をまとめたものです。

例|説明
---|---
[jQuery の初期化時に resizeStarted イベントを処理する](#init-jquery)|初期化時に resizeStarted イベントにイベント処理関数を割り当てる例。
[ASP.NET MVC で実行時に resizeStarted イベントを処理する](#run-time-mvc)|このコード例では、実行時にイベント ハンドラーを割り当てます。


## <a id="init-jquery"></a>コード例: jQuery の初期化時に resizeStarted イベントを処理する
### <a id="jquery-description"></a>説明

この例は、初期化時に `resizeStarted` イベントにイベント処理関数を割り当てます。

### <a id="jquery-code"></a>コード

**JavaScript の場合:**

```js
$(".selector").igSplitter({
    resizeStarted: function(evt, ui) {
          // Handle event
    }
});
```



## <a id="run-time-mvc"></a>コード例: ASP.NET MVCで実行時に resizeStarted イベントを処理する
### <a id="mvc-description"></a>説明

この例では、実行時に `resizeStarted` イベントにイベント ハンドラーを割り当てます。

### <a id="mvc-code"></a>コード

**JavaScript の場合:**

```js
$(document).delegate(".selector", "igsplitterresizestarted", function(evt, ui) {
   // Handle event
});
```

## <a id="demo"></a>スプリッター API およびイベント サンプル

以下のサンプルでは、スプリッター コントロールのイベントを処理する方法を紹介し、API を使用する方法を紹介します。

<div class="embed-sample">
	   [%%SamplesEmbedUrl%%/splitter/api-events-splitter](%%SamplesEmbedUrl%%/splitter/api-events-splitter)
</div>

## <a id="related-content"></a>関連コンテンツ
### サンプル

このトピックについては、以下のサンプルも参照してください。

- [ベーシック垂直スプリッター](%%SamplesUrl%%/splitter/basic-vertical-splitter): このサンプルでは、スプリッター コントロールを使用してページの垂直レイアウトを管理する方法を紹介します。最初のコンテナーは大陸および国を含むツリー コントロールを表示します。左の垂直パネルはサイズ変更の最大値および最小値があります。ノードをクリックすると、選択した項目の説明が右パネルに表示されます。

- [ベーシック水平スプリッター](%%SamplesUrl%%/splitter/basic-horizontal-splitter): このサンプルでは、スプリッター コントロールを使用して水平レイアウトのマスター/詳細グリッドを管理する方法を紹介します。最初のコンテナーは顧客データを含むマスター グリッドを含みます。マスター グリッドの行がクリックした後に 2 つ目のコンテナーにこの顧客の注文を含むグリッドを表示します。

- [ネスト スプリッター](%%SamplesUrl%%/splitter/nested-splitters): このサンプルでは、ネスト スプリッターのレイアウトを管理する方法を紹介します。パネルは大陸、国、および都市を含むツリーを表示します。ノードをクリックすると、2 つ目のスプリッターにあるマップはノードの座標によって中央揃えます。国が選択した場合、その国の都市を含むグリッドはマップの下に表示されます。パネルはデフォルトでサイズ変更できません。

- [ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/splitter/aspnet-mvc-helper-splitter): このサンプルでは、 `igSplitter` の ASP.NET MVC ヘルパーを使用する方法を紹介します。

- [スプリッター API およびイベント](%%SamplesUrl%%/splitter/api-events-splitter): このサンプルでは、`igSplitter` コントロールのイベントを処理する方法を紹介し、API を使用する方法を紹介します。








