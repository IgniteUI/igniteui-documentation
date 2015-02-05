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

まず以下のトピックを読む必要があります。

-	[Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)

-	[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

-	[Ignite UI のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

-	[igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)のデータ ソース  コントロール セクション

**外部リソース**

あらかじめ [jQuery ウィジェットの使用](http://learn.jquery.com/jquery-ui/getting-started/) を読んでおくことをお勧めします。

##<a id="main-features"></a>主要機能


###機能の概要


下の表は、`igCombo` の主な機能の内容を簡潔にまとめたものです。

`igCombo` コントロールは、大量のデータをバインドする際に HTML 要素を再利用してパフォーマンスを高めることができます。
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

            <td>igCombo コントロールが入力ボックスに入力されたテキストに基づいて候補リストを絞り込めるようになります。</td>
        </tr>

        <tr>
            <td>複数選択</td>

            <td>ユーザーは 1 つまたは複数の項目を選択することができ、チェックボックスを使用して複数選択を実行することもできます。</td>
        </tr>

        <tr>
            <td>ASP.NET MVC ヘルパー</td>

            <td>サポートされる .NET コードで igCombo コントロールを構成できるようになります。</td>
        </tr>

        </tr>
    </tbody>
</table>

###仮想化


仮想化を有効にすると、メモリの消費を低いレベルに抑えながら `igCombo` コントロールを数百の項目にバインドできるようになります。このコンボでは、コンボのスクロール可能領域を埋めるために必要な量だけ HTML 要素が作成され、ユーザーがデータをスクロールするときにはそうした要素が再利用されます。

###関連トピック


-	[パフォーマンスの最適化 (igCombo)](igCombo-Optimize-Performance.html)

##オート コンプリート


オートコンプリート機能を使用すると、すでに候補リストに含まれている文字列を素早く入力できるようになります。このコンボでは、最初の文字が入力されると、候補リストの先頭にある一致項目から残りの文字列が予測され、その文字列が残りの入力テキストとして埋められていきます。

![](images/igCombo_igCombo_Overview_01.png)

###関連トピック


-	[igCombo の追加](igCombo-Getting-Started.html)

###自動補完


ドロップダウン リストから特定の値を素早く見つけ出せるようにするには、自動補完機能を有効にします。入力ボックスに入力されたテキストに基づいてドロップダウン リストの項目選択肢が絞り込まれていきます。「～を含む」や「～から始まる」といった演算子を使用した絞り込みなど、タイプの異なる絞り込みが行えるようになっています。

![](images/igCombo_igCombo_Overview_02.png)

###関連トピック


-	[自動補完の構成 (igCombo)](igCombo-Configure-Auto-Suggest.html)

##複数選択


`igCombo` コントロールでは、単一選択と複数選択が利用できます。複数選択の場合、Ctrl キーを押しながらドロップダウン リストから複数の項目を選択していくことができます。さらに、マウスで簡単に複数選択が行えるようにチェックボックスを表示することもできます。データを入力する際には、入力ボックスで複数の値をコンマ (,) で区切ってタイピングしていくという方法で複数の値を選択することもできます。

![](images/igCombo_igCombo_Overview_03.png)

###関連トピック


-	[選択の構成 (igCombo)](igCombo-Configure-Selection.html)

##ASP.NET MVC ヘルパー


ASP.NET MVC ヘルパーを使用すると、サポートされるコード言語で `igCombo` コントロールを構成できるようになります。再利用可能な View または ViewModel を ASP.NET MVC アプリケーションのなかに作成しておくと、このコンボとのインターフェイスを確保できます。ASP.NET で IQueryable オブジェクトへのバインドを行うこともできます。そして、クライアント側で `igCombo` コントロールの使用する JSON データはヘルパーによって生成されます。

###関連トピック


-	[igCombo の追加](igCombo-Getting-Started.html)

-	[自動補完の構成 (igCombo)](igCombo-Configure-Auto-Suggest.html)

##<a id="minimum-requirements"></a>最低必要条件


###概要


`igCombo` コントロールは jQuery UI ウィジェットの 1 つであるため、jQuery コアと jQuery UI JavaScript ライブラリに依存します。また、`igCombo` コントロールが機能の共有やデータのバインドを行うために使用する Ignite UI™ JavaScript リソースもいくつかあります。`igCombo` コントロールを純然たる JavaScript コンテキストの中でのみ使用する場合にも、ASP.NET MVC で使用する場合にも、こうした JavaScript の参照が必要になります。ASP.NET MVC で `igCombo` を使用する場合、.NET 言語で `igCombo` を構成するには、Infragistics.Web.Mvc アセンブリが必要です。

###要件 


下の表は、`igCombo` コントロールの要件をまとめたものです。

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
			<td>Ignite UI は、これらのフレームワークの最上位にビルドされます。
				<ul>
					<li>[jQuery](http://jquery.com)</li>
					<li>[jQuery UI](http://jqueryui.com/)</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>Ignite UI の共用 JavaScript リソース</td>
			<td>Ignite UI には、ほとんどのウィジェットが使用する共用 JavaScript リソースがいくつかあります。
widgets use:
				<ul>
					<li>infragistics.util.js</li>
					<li>infragistics.ui.shared.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igDataSource JavaScript リソース</td>
			<td>igCombo は igDataSource を内部的に使用してデータ操作を行います。
				<ul>
					<li>infragistics.dataSource.js</li>
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
			<td>このテーマには、Ignite UI 向けに作成されたカスタム ビジュアル スタイルが含まれます。</td>
		</tr>
		<tr>
			<td>ベース テーマ</td>
			<td>基本テーマには、主に各ウィジェットのフォームと機能を定義するスタイルが含まれています。</td>
		</tr>
	</tbody>
</table>

##<a id="binding-to-data-source"></a>データ ソースにバインド


次の表は、`igCombo` コントロールとデータ ソースとのバインドに関する要件をカテゴリ別にまとめたものです。

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

                <li>JavaScript 配列または HTML TABLE 要素</li>

                <li>SELECT 要素</li>

               <li> OData services</li>

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


次の表は、サポートされるデータ ソース、および各データ ソースのバインドに関する基本情報をまとめたものです。


<table class="table">
    <tbody>
        <tr>
            <th>データ ソース</th>

            <th>バインディング</th>
        </tr>

        <tr>
            <td>igDataSource</td>

            <td>igDataSource は、データ操作を管理するために igCombo コントロールによって内部的に使用されるデータ ソースです。このデータ ソースは、さまざまなタイプのローカル データやリモート データを受け入れます。</td>
        </tr>

        <tr>
            <td>HTML SELECT 要素</td>

            <td>igCombo コントロールの jQuery セレクタから SELECT 要素を選択すると、その SELECT 要素が自動的に igCombo コントロールへ変換され、元の SELECT 要素のオプションが継承されます。</td>
        </tr>

        <tr>
            <td>IQueryable</td>

            <td>ASP.NET MVC では、igCombo のデータソースとして IQueryable を指定します。すると、そのコレクションは、ブラウザーでの使用に合わせて JSON にシリアル化されて View と共に返されます。</td>
        </tr>
    </tbody>
</table>

###データ ソースへのバインドに関する概要


ほとんどの場合、`igCombo` の `dataSource` または `dataSourceUrl` オプションを使用してデータのバインドを行います。このオプションは、サポートされるさまざまなデータ形式を処理できる `igDataSource` へデータを提供します。ただし、SELECT 要素を使用して `igCombo` のインスタンスを作成する場合は例外で、このオプションは使用しません。この場合、`igCombo` は元の SELECT 要素のデータおよびオプションを継承します。ASP.NET MVC では、ASP.NET MVC ヘルパーに IQueryable を供給すると、サーバーからのデータを簡単にシリアル化して、View と共にクライアントへ渡せるようになります。そのページがブラウザーに渡されると、`igCombo` の `dataSource` オプションが設定されてクライアント側での操作に使用されます。

###データ ソースへのバインドに関するクラス図


次のクラス図はデータ バインドの仕組みを示したものです。

![](images/igCombo_igCombo_Overview_04.png)

##<a id="template-use-and-selection"></a>テンプレートの使用および選択


###概要


テンプレートを使用して `igCombo` コントロールのレイアウトをカスタマイズできる場所がいくつかあります。ヘッダーやフッターを、それぞれドロップダウン リストの最上部または最下部に付けておくと、ユーザーの選択肢に関するコンテキスト情報を増やすことができます。また、項目テンプレートを定義しておくこともできます。これにより、それぞれの選択肢について、カスタマイズされたレイアウトで複数の情報を表示できるようになります。

###テンプレート使用チャート

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

###テンプレート選択チャート

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

- [Ignite UI の概要](NetAdvantage-for-jQuery-Overview.html)

- [Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)

- [Ignite UI のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)
 
- [igGrid/igDataSource アーキテクチャの概要](igGrid-igDataSource-Architecture-Overview.html)
 
- [igCombo の追加](igCombo-Getting-Started.html)
 
- [igCombo をデータにバインド](igCombo-Binding-to-Data.html)

- [igCombo の構成](igCombo-Configuring.html)

- [igCombo のスタイル設定](igCombo-Using-Themes.html)

- [アクセシビリティ準拠 (igCombo)](igCombo-Accessibility-Compliance.html)

- [既知の問題と制限 (igCombo)](igCombo-Known-Limitations.html)

- [jQuery と ASP.NET MVC ヘルパー API へのリンク (igCombo)](igCombo-jQuery-And-ASP-NET-MVC-Helper-API-Links.html)

 

 


