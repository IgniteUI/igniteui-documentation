<!--
|metadata|
{
    "fileName": "igcombo-knockoutjs-support",
    "controlName": "igCombo",
    "tags": ["Data Binding","Data Presentation","Editing"]
}
|metadata|
-->

# Knockout サポートの構成 (igCombo)



## トピックの概要


### 目的

このトピックは、[Knockout ライブラリ](http://knockoutjs.com/) により管理される VIew-Model のオブジェクトをバインドするために `igCombo` コントロールを構成する方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックと外部リソースの一覧です。


**トピック**


-	[igCombo の概要](igCombo-Overview.html) : このトピックでは、機能、データ ソースへのバインド、要件、およびテンプレートに関する情報を含めて、`igCombo` コントロールの概要を示します。

-	[igCombo の追加](igCombo-Getting-Started.html): このヘルプ トピックは、クライアント上では JSON データにバインドし、サーバー上でビジネス オブジェクトのコレクションにバインドするなど異なるアプリケーションのシナリオにおいて基本的な `igCombo` コントロールをセットアップする方法について説明します。


**外部リソース**

-   [Knockout インタラクティブ チュートリアル](http://learn.knockoutjs.com/)



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [Knockout のサポートによる igCombo 構成](#igCombo-knockout-support)
-   [コード例](#code-examples)
-   [コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [リソース](#resources)



## <a id="introduction"></a>概要


### Knockout サポートの概要

`igCombo` コントロールにおける Knockout ライブラリのサポートは、開発者が Knockout ライブラリとその宣言構文を使用してツリー コントロールを初期化し構成するための簡単な方法を提供することを目的としています。

Knockout のサポートは、Knockout バインディングがページに適用されるときに最初に呼び出されるKnockout 拡張機能として、ページの存続期間中 (View-Model への外部更新が起こったとき) に実装されます。

Knockout マネージのデータ構造にバインドされる `igCombo` をインスタンス化するには、`igCombo` 構成オプションをdiv、input、span または select の要素の data-bind 属性に指定する必要があります。コンボは、JavaScript を使用してコントロールを作成する場合同様に div の場所で描画されます。この点において最も重要な `igCombo` 構成オプションについては、以下の「[Knockout による構成](#igCombo-knockout-support)」セクションを参照してください。data-bind 属性においては、ビジネス事例に関係するその他の `igCombo` オプションのいずれにも指定できます。

`igCombo` コントロールの Knockout 拡張機能を使用すると、ドロップダウンから新しい値を選択することにより `igCombo` 選択項目が変更されるたびに、この拡張機能は監視可能機能に通知し、対応するすべてのビューを更新します。また、外部ビューが更新されると、拡張機能の監視可能機能は `igCombo` 選択項目を更新します。(これは、その他のKnockout 拡張機能から予想されるビヘイビアです)

それに加え、`igCombo` のKnockout 機能拡張は、`igCombo` ドロップダウンがバインドされるデータ ソースの変更に対して反応するように構成できます。これは、データ ソースで追加、削除または編集されデータ ソースが監視可能として構成されると、拡張機能は要素の追加および削除を追跡し、その結果ドロップダウン リストを更新できるようになります。詳細については、「[コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound)」を参照してください。

>**注:** `igCombo` バージョン 14.2 以前の Knockout サポートと異なり、この拡張機能ではオプションと View-Model にバインドされる方法が異なります。これらの変更は、バージョン 15.1 で公開される新しい `igCombo` コントロールのニーズに合わせて導入されました。後述の [Knockout を使用した構成](#igCombo-knockout-support) のセクションと、[新しいコンボへの移行](igCombo-Migrating-To-The-New-Combo.html) のトピックを参照してください。

##<a id="igCombo-knockout-support"></a>Knockout のサポートによる igCombo 構成


### Knockout のサポートによる igCombo 構成の概要表

以下の表は、これらのタスクを管理する各プロパティに対し Knockout 使用シナリオに関連する `igCombo` コントロールの構成タスクをマップします。いくつかの実際の実装コード例は、表の下に示します。


<table class="table table-bordered">
	<thead>
		<tr>
			<th>構成タスク</th>
			<th>必須ですか？</th>
			<th>詳細</th>
			<th>プロパティ</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>ビュー モデル オブジェクトのフィールドを igCombo の選択されている項目にバインド</td>
			<td>必須</td>
			<td>igCombo で選択されている項目の配列。selectedItems プロパティを構成すると、コンボの選択した項目およびビュー モデルの間のデータ交換を有効にします。</td>
			<td><ul><li> `selectedItems` </li></ul><br>利用可能な値:<ul><li>プリミティブの配列</li><li>オブジェクトの配列</li></ul><br>**注:** value プロパティは igCombo で利用可能ではありません。Knockout 拡張機能のみに利用可能です。</td>
		</tr>
		<tr>
			<td>igCombo のデータ ソースの構成</td>
			<td>必須</td>
			<td>$.ig.DataSource が受け入れる有効なデータ ソース、または $.ig.DataSource 自身のインスタンスを設定します。</td>
			<td><ul><li> [`dataSource`](%%jQueryApiUrl%%/ui.igcombo#options:dataSource)</li></ul></td>
		</tr>
		<tr>
			<td>項目の表示テキストを含むデータ ソース フィールドを構成</td>
			<td>必須</td>
			<td>項目の表示テキストを含むデータ ソース フィールドの名前を設定します。項目が選択されている場合、各項目のテキストがドロップダウン リストおよびコンボ ボックスで表示されます。同じテキストが text オプションにも保存されます。</td>
			<td><ul><li>[`textKey`](%%jQueryApiUrl%%/ui.igcombo#options:textKey)</li></ul></td>
		</tr>
		<tr>
			<td>項目の値を含むデータ ソース フィールドを構成</td>
			<td>必須</td>
			<td>項目の値を含むデータ ソース フィールド (ID フィールド) の名前を設定します。igCombo 項目の値がこのフィールドにマップされます。</td>
			<td><ul><li>[`valueKey`](%%jQueryApiUrl%%/ui.igcombo#options:valueKey)</li></ul></td>
		</tr>
		<tr>
			<td>選択した項目のタイプを定義</td>
			<td>オプション</td>
			<td>配列の選択されている項目のタイプを primitive または object に設定します。拡張機能が選択した項目のタイプを自動的に定義するため、このオプションは必須ではありません。項目が選択されていないため、拡張機能が自動的にタイプを定義できない場合に `selectedItemType` オプションを使用できます。</td>
			<td><ul><li>`selectedItemType`</li></ul><br>利用可能な値:<ul><li>"primitive"</li><li>"object"</li></ul> <br>**注:** value プロパティは igCombo で利用できません。Knockout 拡張機能でのみ利用可能です。</td>
		</tr>
	</tbody>
</table>


## <a id="code-examples"></a>コード例


### コード例の概要

以下の表は、このトピックで使用したコード例を示しています。


-	[Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound): この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる `igCombo` コントロールの基本構成を示します。

## <a id="basic-combo-box-bound"></a>コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス


この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる `igCombo` コントロールの基本構成を示します。Knockout の宣言構文を使用して、span 要素の data-bind 属性からコンボをインスタンス化し View-Model 監視可能プロパティにバインドします。


### View-Model オブジェクトを作成する

以下のコードは、Knockout により管理される監視可能プロパティを宣言するビューモデル オブジェクトを示します。

**JavaScript の場合:**

```js
var model = [
    { name: "Adam Sandler", id: "1" },
    { name: "Brooke Shields", id: "2" },
    { name: "Charles Chaplin", id: "3" },
    . . .
];
var viewModel = new ViewModel(model);
function ViewModel(actorsList) {
    var self = this;
    this.actorsList = actorsList;
    //  The array of actor objects to be bound to the drop down list
    this.actors = ko.observableArray(self.actorsList);
    //  Select the first actor, using his id.
    this.selectedActor = ko.observableArray([self.actors()[0].id]);
    // Alternative way to select an actor, using the whole object, containing value and text
    // this.selectedActor = ko.observableArray([self.actors()[0]]);
    this.isVisible = true;
}
```
>**注:** 選択した値を含むプリミティブの配列を渡すことにより、または項目の値とテキストを含むオブジェクトの配列を渡すことにより、`igCombo` 項目を選択できます。HTML 選択要素に加えて View-Model がアタッチされ、同時に `igCombo` がアタッチされる場合には、プリミティブ値の使用を推奨します。理由は、HTML 選択が View-Model にアタッチされている場合、KnockoutJS ライブラリはプリミティブの配列で動作するためです。

#### 宣言された Knockout バインディングをページに適用

以下のコード スニペットは、宣言されたKnockout バインディングをページに適用する方法を示します。`ko.applyBindings()` 呼び出しは、[Infragistics Loader の使用](Using-Infragistics-Loader.html) の即時コールバック内で出される点にご注意ください。これは、Knockout のコンボ拡張機能はバインディングが適用される前にページに読み込まなければならないため必要です。

**JavaScript の場合:**

```js
$.ig.loader({
    scriptPath: "http://localhost/ig_ui/js/",
    cssPath: "http://localhost/ig_ui/css/",
    resources: "igCombo,extensions/infragistics.ui.combo.knockout-extensions.js",
    ready: function () {
        ko.applyBindings(viewModel);
    }
});
```

#### View 内の igCombo のバインディング プロパティを宣言

##### igCombo ハンドラー

以下のコードは、ビュー内に `igCombo` のバインディング プロパティを宣言する方法を示します。最も重要なのは、対応する span 要素の data-bind 属性におけるインスタンス化プロパティの宣言部分です。

**HTML の場合:**

```html
<span id="comboActors" data-bind="igCombo: {
        dataSource: actors,
        textKey: 'name',
        valueKey: 'id',
        selectedItems: selectedActor
    }"></span>
```

View-Model オブジェクトの `selectedItems` プロパティと `dataSource` プロパティの両方が監視可能である点にご注意ください。selectedItems プロパティでは、View-Model オブジェクトは `igCombo` 選択項目を動的に更新でき、逆も同様です。`igCombo` は View-Model オブジェクトを更新できるようになります。`dataSource` を監視可能配列に構成すると、`igCombo` は要素の追加と削除を追跡し、結果としてドロップダウン リストを更新できるようになります。これらのプロパティのいずれかを監視不可能として宣言できます。これは、対応する機能を失うことを意味します。監視可能として定義される View-Model オブジェクトがないと、`igCombo` に Knockout サポートはなく、宣言構文および Knockout バインディング拡張機能を使用することは意味がありません。

##### igComboVisible ハンドラー

以下のコードは `igComboVisible` バインディングを宣言する方法を紹介します。Knockout の visible バインディングと同じ機能があります。

**JavaScript の場合:**
```js
function viewModel() {
    this.isVisible =  ko.observable(true);
}
```

**HTML の場合:**

```html
<span id="comboActors" data-bind="igCombo: { ... }, igComboVisible: isVisible"></span>
```

`igCombo` コントロールは inline-block プロパティを持つ HTML 要素に表示されます。Knockout の visible バインディングが要素の表示を block に設定するため、`igCombo` の外観が崩れます。カスタム `igComboVisible` バインディングを使用すると、正しく `igCombo` を表示し、Knockout の visible バインディングの機能を提供します。

##### igComboDisable ハンドラー

以下のコードは `igComboDisable` バインディングを宣言する方法を紹介します。Knockout の [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) バインディングと同じ機能があります。

**JavaScript の場合:**

```js
function viewModel() {
    this.isDisabled =  ko.observable(false);
}
```

**HTML の場合:**

```html
<span id="comboActors" data-bind="igCombo: { ... }, igComboDisable: isDisabled"></span>
```

igCombo にコントロールの有効化/無効化を処理する特別なロジックがあるため、Knockout の [`disabled`](http://knockoutjs.com/documentation/disable-binding.html) バインディング ハンドラーが動作しません。

## <a id="related-content"></a>関連コンテンツ


### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[Knockout サポート (エディター)](Configuring-Knockout-Support-%28Editors%29.html): このトピックは、[Knockout ライブラリ](http://knockoutjs.com/)により管理されるビューモデル オブジェクトをバインドするために %%ProductName%% エディター コントロールを構成する方法について説明します。
-	[新しいコンボへの移行](igCombo-Migrating-To-The-New-Combo.html#ko_changes): このトピックは、古いコンボから新しいコンボへの移行を支援することを目的としています。ドキュメントには、igCombo の Knockout 統合での変更点が含まれます。

### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

以下のサンプルでは、KnockoutJS データ バインディングによって処理されるデータを igCombo にバインドする方法を紹介します。コンボのドロップダウンに配列をバインドし、model プロパティをコンボの選択項目にバインドします。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/combo/bind-combo-with-ko](%%SamplesEmbedUrl%%/combo/bind-combo-with-ko)
</div>

>**注:**  Knockout 拡張子が %%ProductNameMVC%% との互換性がありません。

### <a id="resources"></a> リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

-	[Knockout](http://knockoutjs.com/): これは、Knockout ライブラリのホーム ページです。ライブラリには、完全なドキュメントとサンプルが含まれます。




