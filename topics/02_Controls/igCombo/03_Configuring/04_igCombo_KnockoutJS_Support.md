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



##トピックの概要


### 目的

このトピックは、[Knockout ライブラリ](http://knockoutjs.com/) により管理される VIew-Model のオブジェクトをバインドするために `igCombo` コントロールを構成する方法について説明します。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要なトピックと外部リソースの一覧です。


**トピック**


-	[igCombo の概要](igCombo-Overview.html) : このトピックでは、機能、データ ソースへのバインド、要件、およびテンプレートに関する情報を含めて、`igCombo` コントロールの概要を示します。

-	[igCombo の追加](igCombo-Getting-Started.html): このヘルプ トピックは、クライアント上では JSON データにバインドし、サーバー上でビジネス オブジェクトのコレクションにバインドするなど異なるアプリケーションのシナリオにおいて基本的な `igCombo` コントロールをセットアップする方法について説明します。


**外部リソース**

-   [Knockout インタラクティブ チュートリアル](http://knockoutjs.com/)



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [Knockout のサポートによる igCombo 構成](#igCombo-knockout-support)
-   [コード例](#code-examples)
-   [コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound)
-   [コード例: 階層データ ソースのあるカスケード コンボ ボックス](#cascaded-combo-boxes)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)
    -   [リソース](#resources)



##<a id="introduction"></a>概要


### Knockout サポートの概要

`igCombo` コントロールにおける Knockout ライブラリのサポートは、開発者が Knockout ライブラリとその宣言構文を使用してツリー コントロールを初期化し構成するための簡単な方法を提供することを目的としています。

Knockout のサポートは、Knockout バインディングがページに適用されるときに最初に呼び出されるKnockout 拡張機能として、ページの存続期間中 (View-Model への外部更新が起こったとき) に実装されます。

Knockout マネージのデータ構造にバインドされる `igCombo` をインスタンス化するには、`igCombo` 構成オプションをdiv、input、span または select  の要素の data-bind 属性に指定する必要があります。コンボは、JavaScript を使用してコントロールを作成する場合同様に div の場所で描画されます。この点において最も重要な `igCombo` 構成オプションについては、以下の「[Knockout による構成](#igCombo-knockout-support)」セクションを参照してください。data-bind 属性においては、ビジネス事例に関係するその他の `igCombo` オプションのいずれにも指定できます。

`igCombo` コントロールにKnockout 機能拡張を使用すると、`igCombo` 入力値が変更されるたびにドロップダウンから新しい値を選択するか入力フィールドにこの新しい値を直接書き込むことにより、機能拡張により監視可能であることが示され、すべての対応するビューが更新されます。また、いくつかの外部ビューが更新されると、拡張機能の監視可能機能により `igCombo` 入力値が更新されるようになります。(これは、その他のKnockout 拡張機能から予想されるビヘイビアです)

それに加え、`igCombo` のKnockout 機能拡張は、`igCombo` ドロップダウンがバインドされるデータ ソースの変更に対して反応するように構成できます。これは、データ ソースで追加、削除または編集されデータ ソースが監視可能として構成されると、拡張機能は要素の追加および削除を追跡し、その結果ドロップダウン リストを更新できるようになります。詳細については、「[コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound)」を参照してください。



##<a id="igCombo-knockout-support"></a>Knockout のサポートによる igCombo 構成


### Knockout のサポートによる igCombo 構成の概要表

以下の表は、これらのタスクを管理する各プロパティに対し Knockout 使用シナリオに関連する `igCombo` コントロールの構成タスクをマッピングします。いくつかの実際の実装コード例は、表の後ろにあります。


<table class="table">
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
			<td>ビュー モデル オブジェクトのフィールドを igCombo コントロールのテキストにバインド</td>
			<td>必須</td>
			<td>Knockout を使用してデータにバインドする場合、最小要件は text または value プロパティを構成することです。これにより、コンボ テキストとビュー モデルの間でデータを交換できます。</td>
			<td><ul><li> [text](%%jQueryApiUrl%%/ui.igcombo)</li></ul></td>
		</tr>
		<tr>
			<td>ビュー モデル オブジェクトのフィールドを igCombo コントロールの値にバインド</td>
			<td>オプション</td>
			<td>value プロパティを監視可能として構成すると、コンボ値およびビュー モデルの間のデータ交換を有効にします。</td>
			<td><ul><li>value</li></ul><br>**注:** value プロパティは igCombo で利用可能ではありません。Knockout 拡張機能のみに利用可能です。</td>
		</tr>
		<tr>
			<td>コンボ ボックスのドロップダウン リストにデータ ソースを指定する</td>
			<td>必須</td>
			<td>ドロップダウン リストのデータ ソースを構成するためのプロパティは dataSource です。ただし、子 igCombo がカスケード データ ソースを持つカスケード コンボは例外です。後者の場合は cascadingDataSource プロパティが使用されます。<br>**注:** dataSource プロパティおよび cascadingDataSource プロパティは相互に排他的であり、いずれか片方しか設定できません。</td>
			<td><ul><li> [dataSource](%%jQueryApiUrl%%/ui.igcombo)</li><li>[cascadingDataSource](%%jQueryApiUrl%%/ui.igcombo)</li></ul><br>**注:** [cascadingDataSource](%%jQueryApiUrl%%/ui.igcombo) プロパティは初期化時にのみ構成できます。</td>
		</tr>
		<tr>
			<td>ドロップダウン データ ソースで表示テキスト フィールドの名前を構成する</td>
			<td>必須</td>
			<td>ドロップダウン リストのデータ ソースからの表示フィールド名が必要です。これにより、項目が選択される場合にコンボに正しいテキストを表示できます。同じテキストは text オプションにもストアされます。</td>
			<td><ul><li>[textKey](%%jQueryApiUrl%%/ui.igcombo)</li></ul></td>
		</tr>
		<tr>
			<td>ドロップダウン データ ソースで値フィールドの名前を設定する</td>
			<td>必須</td>
			<td>ドロップダウン リストのデータ ソースからの値 (または ID) フィールド名が必要です。選択された項目の値をコンボが提供できます。</td>
			<td><ul><li>[valueKey](%%jQueryApiUrl%%/ui.igcombo)</li></ul></td>
		</tr>
		<tr>
			<td>コンボのテキスト フィールドに、ドロップダウン リストに表示されない値の承諾を許可する</td>
			<td>オプション</td>
			<td>一部のアプリケーション シナリオでは、コンボのドロップダウン リストには候補値が含まれ、テキストフィールド内のその他の手動入力が承諾されます。</td>
			<td><ul><li>[allowCustomValue](%%jQueryApiUrl%%/ui.igcombo)</li></ul></td>
		</tr>
		<tr>
			<td>View-Model オブジェクトのカスタム更新</td>
			<td>オプション</td>
			<td>デフォルトでは、フォーカスを失うとき、つまり onBlur イベント発生時はコンボ ボックスは View-Model を更新します。このデフォルト設定に加えて、ドロップダウン リストからの各選択および/または各キーストロークにおいて更新が行われるよう選択できます。(これらのカスタム更新のトリガーが構成されても、更新は再び onBlur でトリガーされます)</td>
			<td><ul><li>enableSelectionChangedUpdate</li><li>enableTextChangedUpdate</li></ul><br>**注:** どちらのプロパティも初期化時にのみ構成できます。両方のプロパティは igCombo で利用可能ではありません。Knockout 拡張機能のみに利用可能です。</td>
		</tr>
	</tbody>
</table>


##<a id="code-examples"></a>コード例


#### コード例の概要

以下の表は、このトピックで使用したコード例をまとめたものです。


-	[Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス](#basic-combo-box-bound): この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる `igCombo` コントロールの基本構成を示します。

-	[階層データ ソースのあるカスケード コンボ ボックス](#cascaded-combo-boxes): この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる 2 つのカスケード `igCombo` コントロールの構成方法を示します。


##<a id="basic-combo-box-bound"></a>コード例: Knockout ビューモデル オブジェクトにバインドされる基本的なコンボ ボックス


###### 説明

この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる `igCombo` コントロールの基本構成を示します。Knockout の宣言構文を使用して、span 要素の data-bind 属性からコンボをインスタンス化し View-Model 監視可能プロパティにバインドします。

###### コード

### View-Model オブジェクトを作成する

以下のコードは、Knockout により管理される監視可能プロパティを宣言するビューモデル オブジェクトを示します。

**JavaScript の場合:**

```
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
    //  The name of the currently selected actor.
    this.actorName = ko.observable(self.actors()[0].name);    this.isVisible = true;
}
```

#### 宣言された Knockout バインディングをページに適用

以下のコード スニペットは、宣言されたKnockout バインディングをページに適用する方法を示します。`ko.applyBindings()` 呼び出しは、[Infragistics Loader の使用](Using-Infragistics-Loader.html) の即時コールバック内で出される点にご注意ください。これは、Knockout のコンボ拡張機能はバインディングが適用される前にページに読み込まなければならないため必要です。

**JavaScript の場合:**

```
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

以下のコードは、ビュー内に `igCombo` のバインディング プロパティを宣言する方法を示します。最も重要なのは、対応する span 要素の data-bind 属性におけるインスタンス化プロパティの宣言部分です。

**HTML の場合:**

```
<span id="comboActors" data-bind="igCombo: { 
        text: actorName,
        dataSource: actors,
        textKey: 'name',
        valueKey: 'id',
        allowCustomValue: true,
        enableSelectionChangedUpdate: true
    }"></span>
```

View-Model オブジェクトの `text` プロパティと `dataSource` プロパティの両方が監視可能である点にご注意ください。text プロパティの場合、View-Model オブジェクトは `igCombo` テキストを動的に更新でき、逆も同様です。`igCombo` は View-Model オブジェクトを更新できるようになります。dataSource を監視可能配列に構成すると、`igCombo` は要素の追加と削除を追跡し、結果としてドロップダウン リストを更新できるようになります。これらのプロパティのいずれかを監視不可能として宣言できます。これは、対応する機能を失うということです。監視可能として定義される View-Model オブジェクトがないと、`igCombo` に Knockout サポートはなく、宣言構文および Knockout バインディング拡張機能を使用することは意味をなしません。

以下のコードは `igComboVisible` バインディングを宣言する方法を紹介します。Knockout の visible バインディングと同じ機能があります。

**HTML の場合:**

```
<span id="comboActors" data-bind="igCombo: { ... }, igComboVisible: isVisible"></span>
```

`igCombo` コントロールは inline-block プロパティを持つ HTML 要素に表示されます。Knockout の visible バインディングが要素の表示を block に設定するため、`igCombo` の外観が崩れます。カスタム `igComboVisible` バインディングを使用すると、正しく `igCombo` を表示し、Knockout の visible バインディングの機能を提供します。



###<a id="cascaded-combo-boxes"></a>コード例: 階層データ ソースのあるカスケード コンボ ボックス


###### 説明

この例は、Knockout 監視可能 View-Model オブジェクトにバインドされる 2 つのカスケード `igCombo` コントロールの構成方法を示します。例では、カスケード シナリオを表すために国と地域のコンテキストを使用します。このシナリオでは、階層データ ソースを定義し、最初と 2 番目のレベルを対応する `igCombo` コントロールにバインドします。第 2 レベルのコンボは、最初のコンボ ボックスで選択された項目に基づいてドロップ ダウン リストをフィルタリングします。

###### コード

**階層データ ソースを定義する**

以下のコードは、2 つの JavaScript 配列を定義し、それらを 2 つの Knockout 管理監視可能配列にマッピングします。第 1 レベル配列には、ID と名前付きで国の項目を格納します。第 2 レベルの配列には、親の国、地域名および ID をポイントする `countryID` プロパティで国の地域に対する項目を格納します。

**JavaScript の場合:**

```
var countries = [
    { countryName: "United States", countryID: "US" },
    { countryName: "Bulgaria", countryID: "BG" }
];
var districts = [
    { countryID: "US", districtName: "New Jersey", districtID: "NJ" },
    { countryID: "US", districtName: "California", districtID: "CA" },
    { countryID: "US", districtName: "Illinois", districtID: "IL" },
    { countryID: "US", districtName: "New York", districtID: "NY" },
    { countryID: "US", districtName: "Florida", districtID: "FL" },
    { countryID: "BG", districtName: "Sofia", districtID: "SA" },
    { countryID: "BG", districtName: "Plovdiv", districtID: "PV" },
    { countryID: "BG", districtName: "Varna", districtID: "V" },
    { countryID: "BG", districtName: "Yambol", districtID: "Y" }
];
var countriesKO = ko.mapping.fromJS(countries);
var districtsKO = ko.mapping.fromJS(districts);
```

#### カスケード igCombo コントロールをインスタンス化しデータにバインドする

以下のコードは、2 つの `igCombo` コントロールをインスタンス化し、それらを第 1 レベルおよび第 2 レベルの監視可能配列 (countriesKO および districtsKO) にバインドします。子コンボ (`comboDistrict`) において`parentCombo` と `parentComboKey` のオプションがどのように親コンボをポイントし親 ID フィールドを指定するかご注意ください。これは、子コンボではフィルターとして機能します。項目が親コンボで選択される場合はいつも、子コンボは親 ID フィールドを使用して独自のドロップダウン リストをフィルタリングします。

**HTML の場合:**

```
<span id="comboCountry" data-bind="igCombo: 
    {
        text: cascadingValue,
        textKey: 'countryName',
        valueKey: 'countryID',
        dataSource: countriesKO,   
    }
"></span>
<span id="comboDistrict" data-bind="igCombo: 
    {
        text: cascadingChildValue,
        valueKey: 'districtID',
        textKey: 'districtName',
        dataSource: districtsKO,
        parentComboKey: 'countryID',
        parentCombo: '#comboCountry' 
    }
"></span>
```



##<a id="related-content"></a>関連コンテンツ


###<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[Knockout サポート (エディター)](Configuring-Knockout-Support-%28Editors%29.html): このトピックは、[Knockout ライブラリ](http://knockoutjs.com/)により管理されるビューモデル オブジェクトをバインドするために Ignite UI エディター コントロールを構成する方法について説明します。

###<a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

-	[KnockoutJS のバインド](%%SamplesUrl%%/combo/bind-combo-with-ko): このサンプルでは、KnockoutJS データ バインディングによって処理されるデータを `igCombo` にバインドする方法を紹介します。

###<a id="resources"></a> リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

-	[Knockout](http://knockoutjs.com/): これは、Knockout ライブラリのホーム ページです。ライブラリには、完全なドキュメントとサンプルが含まれます。

 

 


