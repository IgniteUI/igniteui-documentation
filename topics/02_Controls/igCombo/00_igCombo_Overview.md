<!--
|metadata|
{
    "fileName": "igcombo-overview",
    "controlName": "igCombo",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igCombo の概要



##トピックの概要


###目的


このトピックでは、機能、データ ソースへのバインド、要件、およびテンプレートに関する情報を含めて、`igCombo`™ コントロールの概要を示します。

###このトピックの内容


このトピックは、以下のセクションで構成されます。

- [主要機能](#main-features)

- [データ ソースにバインド](#binding-to-data-source)

- [最低必要条件](#minimum-requirements)

- [テンプレートの使用および選択](#template-use-and-selection)

### 前提条件


以下の表は、このトピックを理解するために必要な前提条件です。

**トピック**

最初に、以下のトピックを読む必要があります。

-	[%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

-	[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

-	[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

-	[igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)のデータ ソース コントロール セクション

**外部リソース**

あらかじめ [jQuery ウィジェットの使用](http://learn.jquery.com/jquery-ui/getting-started/) を読んでおくことをお勧めします。

##<a id="main-features"></a>主要機能


###機能の概要


下の表は、`igCombo` の主な機能の概要を説明します。

<table class="table">
    <tbody>
        <tr>
            <th>機能</th>

            <th>説明</th>
        </tr>
        <tr>
            <td>仮想化</td>

            <td>igCombo コントロールは、大量のデータをバインドする際に HTML 要素を再利用してパフォーマンスを高めることができます。</td>
        </tr>
		<tr>
            <td>オート コンプリート</td>

            <td>この機能を有効にすると、igCombo コントロールは、候補リストの先頭にある一致文字列から予測して残りの入力テキストを自動的に埋めていきます。</td>
        </tr>
        <tr>
            <td>自動補完</td>

            <td>igCombo コントロールは入力ボックスに入力されたテキストに基づいて候補リストを絞り込むことができます。</td>
        </tr>
        <tr>
            <td>複数選択</td>

            <td>ユーザーは 1 つまたは複数の項目を選択することができ、チェックボックスを使用して複数選択を実行することもできます。</td>
        </tr>
        <tr>
            <td>キーボード ナビゲーション</td>

            <td>ユーザーは、igCombo がサポートする豊富なキーボード ナビゲーションにより、簡単な操作で項目間を迅速に移動でき、選択する項目や強調表示する項目を変更することができます。</td>
        </tr>

        <tr>
            <td>ロード オン デマンド</td>

            <td>igCombo コントロールは、ロード オン デマンド機能をサポートしています。ロード オン デマンドを有効にすると、サーバーとクライアントの両方で帯域幅と処理のオーバーヘッドが大幅に削減されます。</td>
        </tr>
        <tr>
            <td>強調表示</td>

            <td>igCombo 入力でユーザーがテキストを入力すると、ドロップダウン項目で一致する結果が強調表示で表示されます。</td>
        </tr>
        <tr>
            <td>%%ProductNameMVC%%</td>

            <td>サポートされる .NET コードで igCombo コントロールを構成できるようになります。</td>
        </tr>
    </tbody>
</table>

### 仮想化


仮想化を有効にすると、メモリの消費を低いレベルに抑えながら `igCombo` コントロールを数百の項目にバインドできるようになります。このコンボでは、コンボのスクロール可能領域を埋める必要な量の HTML 要素のみが作成され、ユーザーがデータをスクロールする際にはそうした要素が再利用されます。

#### 関連トピック


-	[パフォーマンスの最適化 (igCombo)](igCombo-Optimize-Performance.html)

#### 関連サンプル

- [igCombo 仮想化](%%SamplesUrl%%/combo/virtualization)

### オートコンプリート


オートコンプリート機能を使用すると、すでに候補リストに含まれている文字列をすばやく入力できるようになります。このコンボでは、最初の文字が入力されると、候補リストの先頭にある一致項目から残りの文字列が予測され、その文字列が残りの入力テキストとして埋められていきます。

![](images/igCombo_Auto_Complete.png)

#### 関連トピック

-	[igCombo の追加](igCombo-Getting-Started.html)

### 自動補完


ドロップダウン リストから特定の値を素早く見つけ出すには、自動補完機能を有効にします。入力ボックスに入力されたテキストに基づきドロップダウン リストの項目選択肢が絞り込まれます。「～を含む」や「～から始まる」といった演算子を使用した絞り込みなど、条件の異なる絞り込みができます。

![](images/igCombo_Auto_Suggest.png.png)

#### 関連トピック

-	[自動補完の構成 (igCombo)](igCombo-Configure-Auto-Suggest.html)


### 複数選択

`igCombo` コントロールでは、単一選択と複数選択が利用できます。複数選択が有効な場合、ドロップダウン リストから複数の項目を選択できます。データを入力する際には、入力ボックスで複数の値をコンマ (,) で区切ってタイピングする方法で複数の値を選択することもできます。

![](images/igCombo_multiple_selection.png)

#### 関連トピック

-	[選択の構成 (igCombo)](igCombo-Configure-Selection.html)


#### 関連サンプル

- [igCombo の複数選択](%%SamplesUrl%%/combo/selection-and-checkboxes)

### ロード オン デマンド

ロード オン デマンドを有効にすると、最初にドロップダウン コンテナーにスクロールバーが表示され、リスト項目の最初のページが表示されます。リストの最後までスクロールすると、非同期コールバックを通じて次の項目ページが取得され、リストの一番下に追加されます。

#### 関連トピック
- [ロード オン デマンドの構成 ](igCombo-Load-on-Demand.html)

#### 関連サンプル

- [ロード オン デマンド](%%SamplesUrl%%/combo/load-on-demand)

### キーボード ナビゲーション

コンボはキーボードでナビゲートできます。これは重要なユーザー補助機能です。この機能は、エンドユーザーがドロップダウン 項目間を簡単かつ迅速に移動できるようにして、時間を節約します。これはユーザー エクスペリエンスを向上させます。

#### 関連トピック
- [igCombo キーボード ナビゲーション](igCombo-Keyboard-Navigation.html)

#### 関連サンプル

- [キーボード ナビゲーション](%%SamplesUrl%%/combo/keyboard-navigation)

### %%ProductNameMVC%%


ASP.NET MVC ヘルパーを使用すると、サポートされるコード言語で %%ProductNameMVC%% `igCombo` コントロールを構成できるようになります。再利用可能な View または ViewModel を ASP.NET MVC アプリケーションに作成すると、このコンボとのインターフェイスを確保できます。ASP.NET で IQueryable オブジェクトへのバインドもできます。さらに、ヘルパーによりクライアント側で使用する `igCombo` コントロールの JSON データが生成されます。

### 関連トピック


-	[igCombo の追加](igCombo-Getting-Started.html)

-	[自動補完の構成 (igCombo)](igCombo-Configure-Auto-Suggest.html)

#### 関連サンプル

- [%%ProductNameMVC%% Combo](%%SamplesUrl%%/combo/aspnet-mvc-helper)


##<a id="minimum-requirements"></a>最低必要条件


###概要


`igCombo` コントロールは jQuery UI ウィジェットの 1 つであるため、jQuery コアと jQuery UI JavaScript ライブラリに依存します。また、`igCombo` コントロールが機能の共有やデータのバインドに使用する %%ProductName%%™ JavaScript リソースもいくつかあります。JavaScript の参照は、`igCombo` コントロールを純粋な JavaScript コンテキストのみで使用する場合もASP.NET MVC で使用する場合も必要になります。ASP.NET MVC で `igCombo` を使用する場合に、.NET 言語で `igCombo` を構成するには、Infragistics.Web.Mvc アセンブリが必要です。

###要件


以下の表は、`igCombo` コントロールの要件を示しています。

<table class="table">
	<thead>
		<tr>
			<th>要件</th>
			<th>説明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>jQuery および jQuery UI JavaScript リソース</td>
			<td>%%ProductName%% は、これらのフレームワークの最上位にビルドされます。
				<ul>
					<li>[jQuery](http://jquery.com) (igCombo では jQuery バージョン 1.8.3 が必要です)</li>
					<li>[jQuery UI](http://jqueryui.com/) (igCombo では jQuery UI バージョン 1.9.2 が必要です)</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>%%ProductName%% の共用 JavaScript リソース</td>
			<td>%%ProductName%% には、ほとんどのウィジェットが使用する共用 JavaScript リソースがいくつかあります:
				<ul>
					<li>infragistics.util.js</li>
					<li>infragistics.util.jquery.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igDataSource JavaScript リソース</td>
			<td>igCombo は igDataSource を内部で使用してデータを操作します。
				<ul>
					<li>infragistics.dataSource.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igTemplating JavaScript リソース</td>
			<td>igCombo は igTemplating を内部で使用して項目を描画します。
				<ul>
					<li>infragistics.templating.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igCombo JavaScript リソース</td>
			<td>igCombo ウィジェット用の JavaScript ファイル:
				<ul>
					<li>infragistics.ui.combo.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>IG テーマ</td>
			<td>このテーマには、%%ProductName%% 向けに作成されたカスタム ビジュアル スタイルが含まれています。</td>
		</tr>
		<tr>
			<td>ベース テーマ</td>
			<td>基本テーマには、主に各ウィジェットのフォームと機能を定義するスタイルが含まれています。</td>
		</tr>
	</tbody>
</table>

##<a id="binding-to-data-source"></a>データ ソースにバインド


以下の表は、`igCombo` コントロールとデータ ソースとのバインドに関する要件をカテゴリ別に示します。

<table class="table">
    <tbody>
        <tr>
            <th>要件のカテゴリ</th>

            <th>要件の一覧</th>
        </tr>

        <tr>
            <td>データ構造</td>

            <td>
               以下のいずれかの形態を使用できます。
				<ul>
                <li>ローカルまたは Web サーバーから提供される適格な JSON または XML</li>

                <li>JavaScript 配列</li>

                <li>HTML SELECT 要素</li>

                <li>KnockoutJS</li>

                <li>JSONP</li>

                <li>ASP.NET MVC における IQueryable</li>
				</ul>
            </td>
        </tr>

        <tr>
            <td>データ型</td>

            <td><ul>
                <li>String</li>
				<li>Number</li>
				<li>Boolean</li>
				<li>Date</li>
				</ul>
            </td>
        </tr>
    </tbody>
</table>

###サポートされるデータ ソース


以下の表は、サポートされるデータ ソース、および各データ ソースのバインドに関する基本情報を示します。


<table class="table">
	<thead>
		<tr>
            <th>
データ ソース
			</th>
            <th>
バインディング
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
igDataSource
			</td>
            <td>
`igDataSource` は、`igCombo` コントロールによって内部的に使用され、データ操作を管理します。このデータ ソースは、さまざまなタイプのローカル データやリモート データを受け入れます。
			</td>
        </tr>
        <tr>
            <td>
[igCombo をデータにバインド](igCombo-Binding-to-Data.html)
			</td>
            <td>
`igCombo` コントロールの jQuery セレクターから SELECT 要素を選択すると、その SELECT 要素は自動的に `igCombo` コントロールに変換され、元の SELECT 要素のオプションが継承されます。
			</td>
        </tr>
        <tr>
            <td>
IQueryable
			</td>
            <td>
ASP.NET MVC では、igCombo のデータソースとして IQueryable を指定します。そのコレクションは、ブラウザーでの使用に合わせて JSON にシリアル化されて View と共に返されます。
			</td>
        </tr>
        <tr>
            <td>
[KnockoutJS](igcombo-knockoutjs-support.html)
			</td>
            <td>
`igCombo` コントロールにおける Knockout ライブラリのサポートは、開発者が Knockout ライブラリとその宣言構文を使用してツリー コントロールを初期化し構成するための簡単な方法を提供することを目的としています。
			</td>
        </tr>
    </tbody>
</table>

### データ ソースへのバインドに関する概要


ほとんどの場合、`igCombo` の `dataSource` または `dataSourceUrl` オプションを使用してデータをバインドします。このオプションは、サポートされるさまざまなデータ形式を処理できる `igDataSource` にデータを提供します。ただし、SELECT 要素を使用して `igCombo` のインスタンスを作成する場合は例外で、このオプションは使用しません。この場合、`igCombo` は元の SELECT 要素のデータおよびオプションを継承します。ASP.NET MVC では、%%ProductNameMVC%% ヘルパーに IQueryable を供給すると、サーバーからのデータを簡単にシリアル化して、View と共にクライアントに渡せるようになります。そのページがブラウザーに渡されると、`igCombo` の `dataSource` オプションが設定され、クライアント側での操作に使用されます。


##<a id="template-use-and-selection"></a>テンプレートの使用および選択

### 概要


テンプレートを使用して `igCombo` コントロールのレイアウトをカスタマイズできる場所がいくつかあります。ヘッダーやフッターを、それぞれドロップダウン リストの最上部または最下部に付けておくと、ユーザーの選択肢に関するコンテキスト情報を増やすことができます。また、項目テンプレートを定義しておくこともできます。これにより、それぞれの選択肢について、カスタマイズされたレイアウトで複数の情報を表示できるようになります。

### テンプレート使用チャート

下の表は、`igCombo` のテンプレートと各テンプレートの用途をまとめたものです。

<table class="table">
    <tbody>
        <tr>
            <th>テンプレート</th>

            <th>igCombo での使用</th>
        </tr>

        <tr>
            <td>ヘッダー</td>

            <td>headerTemplate オプションをセットすると、ドロップダウン リストの最上部に表示するカスタムの HTML を定義できるようになります。</td>
        </tr>

        <tr>
            <td>フッター</td>

            <td>footerTemplate オプションをセットすると、カスタムの HTML がドロップダウン リストの最下部に表示されます。スクロールバーが必要な大きなリストの場合、フッター テンプレートは常にスクロール可能領域の下に表示されます。</td>
        </tr>

        <tr>
            <td>項目</td>

            <td>itemTemplate オプションにはカスタムの HTML を設定することができます。バインドされた各項目に関するデータはそのテンプレートを使用して表示されます。項目ごとに画像およびカスタム レイアウトを表示することができます。</td>
        </tr>
    </tbody>
</table>

### テンプレート選択チャート

下の表は、予想されるユーザーのニーズと、個々のニーズに適したテンプレートをリストしたものです。

<table class="table">
	<thead>
		<tr>
			<th>用途</th>
			<th>使用テンプレート</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>ドロップダウン リストの最上部にヘッダーを表示します</td>
			<td>headerTemplate</td>
		</tr>
		<tr>
			<td>ドロップダウン リストの最下部にフッターを表示します</td>
			<td>footerTemplate</td>
		</tr>
		<tr>
			<td>項目選択肢ごとに画像またはアイコンを表示します</td>
			<td>itemTemplate</td>
		</tr>
		<tr>
			<td>カスタム レイアウトで各項目に複数の情報を表示します</td>
			<td>itemTemplate</td>
		</tr>
	</tbody>
</table>


##<a id=""></a>関連トピック


以下は、その他の役立つトピックです。

- [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

- [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

- [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

- [igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)

- [igCombo の追加](igCombo-Getting-Started.html)

- [igCombo をデータにバインド](igCombo-Binding-to-Data.html)

- [igCombo の構成](igCombo-Configuring.html)

- [igCombo のスタイル設定](igCombo-Using-Themes.html)

- [キーボード ナビゲーション](igCombo-Keyboard-Navigation.html)

- [アクセシビリティ準拠 (igCombo)](igCombo-Accessibility-Compliance.html)

- [既知の問題と制限 (igCombo)](igCombo-Known-Limitations.html)

- [jQuery および MVC API リファレンス リンク (igCombo)](igCombo-jQuery-And-ASP-NET-MVC-Helper-API-Links.html)

 