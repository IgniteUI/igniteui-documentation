<!--
|metadata|
{
    "fileName": "igcombo-binding-cascading-igcombo-controls-to-cascading-data-sources",
    "controlName": "igCombo",
    "tags": ["Data Binding","How Do I"]
}
|metadata|
-->

# カスケード igCombo コントロールをカスケード データ ソースへバインド



##トピックの概要


#### 目的

このトピックでは、親と子 `igCombo`™ コントロールを カスケード データ ソースにバインドする方法について説明します。カスケードに含まれる個々の `igCombo` コントロールを別個のデータ ソースにバインドする方法については、[個々のデータ ソースへコントロール カスケードのバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Individual-Data-Sources.html)というトピックを参照してください。

#### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。


-	[igCombo の概要](igCombo-Overview.html): このトピックでは、機能、データ ソースへバインド、要件、およびテンプレートに関する情報を含めて、`igCombo` コントロールの概要を示します。

-	[データ バインド](igCombo-Data-Binding.html): このトピックでは、`igCombo` コントロールでの各種データ バインド方式について説明し、データ バインディングに関するその他の詳細情報を示します。



#### このトピックの内容

-   [カスケード igCombo コントロールをカスケード データ ソースへバインド – 概要](#binding-to-cascading-data-source)
  -   [カスケード igCombo コントロールをカスケード データ ソースへバインドの概要](#binding-cascading-data-source-summary)
    -   [カスケード データ ソースの概要](#cascading-data-source-summary)
    -   [要件](#requirements)
-   [カスケード igCombo コントロールをカスケード データ ソースへバインド – コード例](#code-example-binding)
    -   [概要](#introduction)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="binding-to-cascading-data-source"></a>カスケード igCombo コントロールをカスケード データ ソースへバインド – 概要


####<a id="binding-cascading-data-source-summary"></a> カスケード igCombo コントロールをカスケード データ ソースへバインドの概要

`igCombo` コントロールのカスケード機能を使用するには、親子関係でバインドするコントロールのインスタンスを少なくとも 2 つ構成する必要があります。親 `igCombo` に入力されている値が選択されると、子に入力されている値がフィルターされます。これは、ユーザーの作業効率を高めるために「すぐに使用できる状態」で `igCombo` に装備されている機能です。この機能は、`igCombo` の親子とそれぞれのデータ ソースを構成するだけで使用できるようになります。

データ ソースのカスケードを使用すると、異なるデータ キーを備えたリモートとローカルのデータ ソースなど、種類の異なるデータ ソースを定義できるようになります。

カスケード カップルの親 `igCombo` は「通常どおりに」定義されます。親 `igCombo` データ ソースには、任意の対応データ ソースを指定できます (詳細については、[igCombo をデータにバインド - 概要](igCombo-Data-Binding.html)というトピックを参照してください)。

子 `igCombo` データ ソースについては、親との関係を保持するために追加のキーを定義しておく必要があります。子 `igCombo` については、さらに次の 2 つのプロパティを構成する必要があります。

-   [`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) – 親コンボ ボックスの ID または jQuery セレクターを定義します。
-   [`cascadingDataSources`](%%jQueryApiUrl%%/ui.igcombo#options:cascadingDataSources) – 子 `igCombo` にバインドされるデータ ソース カスケードを定義します。このプロパティを使用する場合は [`parentComboKey`](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) プロパティを定義する必要はなく、[`parentComboKey`](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) プロパティを使用する場合はこのプロパティを定義する必要はありません(この実装例については、[igCombo コントロール カスケードをデータ ソース カスケードへバインド – コード例](#code-example-binding)を参照してください)。

上記のプロパティを定義しておくと、値のフィルター処理が `igCombo` コントロールによって内部的な形で自動的に行われることになります。

####<a id="cascading-data-source-summary"></a> カスケード データ ソースの概要

データ ソースのカスケード処理は、子 `igCombo` コントロールで種類の異なるデータ ソースを使用して [`parentComboKey`](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) を定義する代わりに採用される方法です。データ ソースのカスケードには、種類の異なる他のデータ ソースを含めることができます。したがって、それぞれのデータ ソースに別個のテキストおよび値キーを定義できるということになります。また、データ ソースのカスケードには、ローカルとリモートのデータ ソースを混在させることもできます。

データ ソースのカスケードはオブジェクト配列のディクショナリーとして使用されることもあるため、それぞれのオブジェクトに以下のプロパティのいずれか 1 つを定義しておく必要があります。

-   `dataSource` – ローカル データ ソースを使用する場合にそのデータ ソースへの参照を定義します。
-   `dataSourceUrl` – リモート データ ソースを使用する場合にそのリモート データ ソースへの参照を定義します。
-   `valueKey` – オプションで `igCombo` の `valueKey` の代わりに使用するキーを定義します。
-   `textKey` – オプションで `igCombo` の `textKey` の代わりに使用するキーを定義します。

異なる値キーを備えたローカルとリモートのデータ ソースが混在するデータ ソース カスケードの例を示すと、次のようになります。

**JavaScript の場合:**

```
cascadingDataSource = {
    key1: { dataSource: localDS, valueKey: “Identificator” }
    key2: { dataSourceUrl: 
http://odata.netflix.com/Catalog/Titles?$filter=Name%20eq%20%27The%20Name%20of%20The%20Rose%27&$format=json
, valueKey: “Id”}
}
```

####<a id="requirements"></a> 要件

`igCombo` コントロールのカスケードを個々のデータ ソースにバインドする際には、一般的な要件として以下の情報を定義する必要があります。

-   jQuery、jQuery UI スクリプトおよびスタイルへの参照。詳細については、[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)トピックを参照してください。
-   [`igCombo`](igCombo-Getting-Started.html) リソース ファイルへの参照。上記の参照を手動で追加することも、[`igLoader`](Using-Infragistics-Loader.html) コンポーネントを使用した自動参照 (推奨) を行うこともできます。
-   子データ ソースには、親との関係を保持するためのキーも定義しておく必要があります。



##<a id="code-example-binding"></a>カスケード igCombo コントロールをカスケード データ ソースへバインド – コード例


####<a id="introduction"></a> 概要

このサンプル手順では、親 igCombo で選択された値が子 `igCombo` で自動的にフィルター処理されるように　2 つの `igCombo` インスタンスを構成する方法を示します。

ここでは、異なる値キーを備えた 2 つのローカル データ ソースにコントロールをバインドします。2 つのローカル データ ソースが使用されるため、データ ソース データを表示できるようになります。この手順では、オブジェクト配列を作成し、この配列を「選択されたデータ ソース」とみなして使用します。

2 つの別個のデータ ソースを使用して同じ結果を実現する別のバインド方式については、[igCombo コントロール カスケードを個々のデータ ソースへバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Individual-Data-Sources.html)というトピックを参照してください。

####<a id="preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/02_Cascading_Combo_with_Cascading_Data_Source_1.png)

####<a id="prerequisites"></a> 前提条件

この手順を実行するには、以下のリソースが必要です。

-   編集用の標準的な HTML ページを開く

#### <a id="overview"></a>概要 

以下はプロセスの概念的概要です。

​1. `igCombo` コントロール親子の HTML プレースホルダーの追加

​2. 親 `igCombo` コントロールのデータ ソースの追加

​3. 親 `igCombo` コントロールの追加

​4. 子 `igCombo` コントロールのカスケード データ ソースの追加

​5. 子 `igCombo` コントロールの追加

​6. (オプション) 結果を確認します

####<a id="steps"></a> 手順

以下の手順では、子 `igCombo` コントロールをデータ ソースのカスケードにバインドする方法を示します。この時点で、親 `igCombo` は通常のデータ ソースにバインドされているものとします。


1. `igCombo` コントロール親子の HTML プレースホルダーを追加します。

	この例では、ドロップダウンを格納するための SPAN 要素を定義します。HTML プレースホルダーとして div 要素を使用することもできますが、ここでは、両方のコンボ ボックスが同じ行に表示されるようにしたいため、SPAN 要素を使用します。
	
	**HTML の場合:**
	
	```
	<span id="comboCountryCascading"></span>
	<span id="comboDistrictCascading"></span>
	```

2. 親 `igCombo` コントロールにデータ ソースを追加します。

	この手順では、親 `igCombo` データ ソースをオブジェクト配列として定義します。
	
	**JavaScript の場合:**
	
	```
	dsCountryCascading = [
	      { txtCountry: “United States”, valCountry: “US” },
	      { txtCountry: “Bulgaria”, valCountry: “BG” },
	];
	```

3. 親 `igCombo` コントロールを追加します。

	親 `igCombo` を追加して、必要なプロパティを定義します。
	
	**JavaScript の場合:**
	
	```
	$('#comboCountryCascading').igCombo({
	      textKey: 'txtCountry',
	      valueKey: 'valCountry',
	      dataSource: dsCountryCascading
	});
	```

4. 子 `igCombo` コントロールにカスケード データ ソースを追加します。

	データ ソースのカスケードは、他のデータ ソースを含んだオブジェクトであるため、まずそうした別個のデータ ソースを定義しておく必要があります。ここに示す例では、親コントロールに「US」と「BG」 という 2 つの値があります。したがって、この 2 つの値に隣接するデータ ソースを定義しておく必要があります。
	
	1. 親コントロールの「United States」という値に対応する子値のデータ ソースを定義します。
	
		**JavaScript の場合:**
		
		```
		dsStatesUSCascading = [
		      { state: "New Jersey”},
		      { state: "California"},
		      { state: "Illinois"},
		      { state: "New York"},
		      { state: "Florida"}
		];
		```
	
	2. 親コントロールの「Bulgaria」という値に対応する子値のデータ ソースを定義します。
	
		**JavaScript の場合:**
		
		```
		dsDistrictBGCascading = [
		      { district: "Sofia"},
		      { district: "Plovdiv"},
		      { district: "Varna"},
		      { district: "Yambol"}
		];
		```
	
	3. 関係キーを備えたデータ ソース カスケードを定義します。
	
		**JavaScript の場合:**
		
		```
		dsCascStatesDistricts = {
		      “US” : { dataSource: dsStatesUSCascading, textKey: "state" },
		      “BG” : { dataSource: dsDistrictBGCascading, textKey: "district" }
		};
		```
		
		>**注:** この手順で既に触れたとおり、親の値キーが整数値である場合、カスケードするデータ ソースとしてオブジェクトの配列を指定することもできます。こうした配列は次の形式で定義できます。
		
		**JavaScript の場合:**
		
		```
		dsCascStatesDistricts = [
		      { dataSource: dsStatesUSCascading, , textKey: "state" },
		      { dataSource: dsDistrictBGCascading, , textKey: "district" }
		];
		```
		
		親コントロールで特定の値が選択されると、それに応じて、同じインデックスを持つデータ ソースがデータ ソース カスケードから選択されることになります。選択された親値のインデックスが 1 である場合、子の `igCombo` は内部的に `dsDistrictBGCascading` データ ソースをピックアップします。

5. 子 `igCombo` コントロールを追加します。
	
	[`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) および [`cascadingDataSources`](%%jQueryApiUrl%%/ui.igcombo#options:cascadingDataSources) プロパティを定義する子 `igCombo` を追加します。
	
	**JavaScript の場合:**
	
	```
	$("#comboDistrictCascading").igCombo({
	      cascadingDataSources: dsCascStatesDistricts,
	      parentCombo: $('#comboCountryCascading')
	});
	```
	
	>**注:** [`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) プロパティに jQuery セレクターを使用しない場合、ID の前にハッシュ記号 (#) を付ける必要があります。

6. (オプション) 結果を確認します。

	この HTML ページをブラウザーで開き、結果を確認します。上記の手順が完了すると、[プレビュー](#preview)に示すとおり、2 つの機能ドロップダウンが水平方向に並べて配置されます。





##<a id="related-content"></a>関連コンテンツ


####<a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


-	[コントロール　カスケードを個々のデータ ソースへバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Individual-Data-Sources.html)

このトピックでは、`igCombo`™ コントロールの親子を個々のデータ ソースにバインドする方法について説明します。



#### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

-	[コンボのカスケード](%%SamplesUrl%%/combo/cascading-combos): このサンプルでは、3 つの `igCombo` コントロールのカスケードを示します。





 

 


