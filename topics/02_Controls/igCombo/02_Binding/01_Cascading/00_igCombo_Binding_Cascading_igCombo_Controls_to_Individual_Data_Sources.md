<!--
|metadata|
{
    "fileName": "igcombo-binding-cascading-igcombo-controls-to-individual-data-sources",
    "controlName": "igCombo",
    "tags": ["Data Binding","Editing","How Do I"]
}
|metadata|
-->

# カスケード igCombo コントロールを個々のデータ ソースにバインド



##トピックの概要


### 目的

このトピックでは、`igCombo`™ コントロールの親子を個々のデータ ソースにバインドする方法について説明します。カスケード `igCombo` コントロールを カスケード データ ソースにバインドするには、[カスケード igCombo コントロールをカスケード データ ソースにバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html)トピックを参照してください。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。


-	[igCombo の概要](igCombo-Overview.html): このトピックでは、機能、データ ソースへのバインド、要件、テンプレートなどの、`igCombo` コントロールの概要について説明します。

-	[igCombo をデータにバインド](igCombo-Data-Binding.html): このトピックでは、`igCombo` コントロールでの各種データ バインド方式について説明し、データ バインディングに関するその他の詳細情報を示します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [カスケード igCombo コントロールを個々のデータ ソースにバインド – 概念的概要](#binding-individual-data-source)
  -   [カスケード igCombo コントロールを個々のデータ ソースにバインド – 概要](#binding-individual-data-source-summary)
    -   [要件](#requirements)
-   [カスケード igCombo コントロールを個々のデータ ソースにバインド – コード例](#code-example-binding-ids)
    -   [概要](#introduction)
    -   [プレビュー](#preview)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



##<a id="binding-individual-data-source"></a>カスケード igCombo コントロールを個々のデータ ソースにバインド – 概念的概要


###<a id="binding-individual-data-source-summary"></a> カスケード igCombo コントロールを個々のデータ ソースにバインド – 概要

`igCombo` コントロールのカスケード機能を使用するには、親子関係でバインドするコントロールのインスタンスを少なくとも 2 つ構成する必要があります。親 `igCombo` に入力されている値が選択されると、子に入力されている値がフィルターされます。これは、ユーザーの作業効率を高めるために「すぐに使用できる状態」で `igCombo` に装備されている機能です。この機能は、`igCombo` の親子とそれぞれのデータ ソースを構成するだけで使用できるようになります。

カスケード カップルの親 `igCombo` は「通常どおりに」定義されます。親 `igCombo` データ ソースには、任意の対応データ ソースを指定できます (詳細については、[igCombo をデータにバインド - 概要](igCombo-Data-Binding.html)というトピックを参照してください)。

子 `igCombo` データ ソースについては、親との関係を保持するために追加のキーを定義しておく必要があります。子 `igCombo` については、さらに次の 2 つのプロパティを構成する必要があります。

-   [`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) – 親コンボ ボックスの ID または jQuery セレクターを定義します
-   [`parentComboKey`](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) – 子 `igCombo` にバインドされた [`dataSource`](%%jQueryApiUrl%%/ui.igcombo#options:dataSource) からの追加の親 ID キーを定義します。このプロパティを使用する場合、`igCombo` [`dataSource`](%%jQueryApiUrl%%/ui.igcombo#options:dataSource) には親データ ソース キーに関連づけられたキーを含め、データ ソース自身は同種にすることに留意してください。（この実際の実装については、[](#code-example-binding-ids)[Cascading igCombo コントロールを個々のデータ ソースにバインド – コード例](#code-example-binding-ids)を参照）。

上記のプロパティを定義しておくと、値のフィルター処理が `igCombo` コントロールによって内部的な形で自動的に行われることになります。

####<a id="requirements"></a> 要件

`igCombo` コントロールのカスケードを個々のデータ ソースにバインドする際には、一般的な要件として以下の情報を定義する必要があります。

-   jQuery、jQuery UI スクリプトおよびスタイルへの参照。詳細については、[Ignite UI で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)トピックを参照してください。
-   [igCombo](igCombo-Getting-Started.html) リソース ファイルへの参照。上記の参照を手動で追加することも、[igLoader](Using-Infragistics-Loader.html) コンポーネントを使用した自動参照 (推奨) を行うこともできます。
-   子データ ソースには、親との関係を保持するためのキーも定義しておく必要があります。



##<a id="code-example-binding-ids"></a>カスケード igCombo コントロールを個々のデータ ソースにバインド – コード例


###<a id="introduction"></a> 概要

このサンプル手順では、親 igCombo で選択された値が子 `igCombo` で自動的にフィルター処理されるように　2 つの `igCombo` インスタンスを構成する方法を示します。この例では、親 `igCombo` の値は国名であり、国が選択された場合、子 `igCombo` の値がフィルターされ、その国の地区または州のみが表示されます。

この手順では、`igCombo` インスタンスとそのデータ ソースを構成する方法を示し、必要な HTML コード スニペットを提供します。

親 `igCombo` のデータ ソースとして、オブジェクトの配列が使用されます。

単一のカスケード データ ソースを使用して同じ結果を達成する別の方法については、カスケード[ igCombo をカスケード データ ソースにバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html) トピックを参照してください。

###<a id="preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/01_Cascading_Combo_with_Individaul_Data_Source_1.png)

###<a id="prerequisites"></a> 前提条件

この手順を実行するには、以下のリソースが必要です。

-   編集用の標準的な HTML ページを開く

###<a id="overview"></a> 概要 

以下はプロセスの概念的概要です。

​	1. `igCombo` コントロール親子の HTML プレースホルダーの追加

​	2. 親 `igCombo` コントロールのデータ ソースの追加

​	3. 親 `igCombo` コントロールの追加

​	4. 子 `igCombo` コントロールにデータ ソースを追加

​	5. 子 `igCombo` コントロールの追加

​	6. (オプション) 結果を確認します

###<a id="steps"></a> 手順

以下の手順では、`igCombo` コントロールをさまざまなデータ ソースにバインドする方法を示します。

1. `igCombo` コントロール親子の HTML プレースホルダーを追加します。

	この例では、ドロップダウンを格納するための SPAN 要素を定義します。HTML プレースホルダーとして div 要素を使用することもできますが、ここでは、両方のコンボ ボックスが同じ行に表示されるようにしたいため、SPAN 要素を使用します。
	
	**HTML の場合:**
	
	```
	<span id="comboCountry"></span>
	<span id="comboDistrict"></span>
	```

2. 親 `igCombo` コントロールにデータ ソースを追加します。

	この手順では、親 `igCombo` データ ソースをオブジェクト配列として定義します。
	
	**JavaScript の場合:**
	
	```
	dsCountry = [
	      { txtCountry: 'United States', valCountry: "US" },
	      { txtCountry: 'Bulgaria', valCountry: "BG" }
	];
	```

3. 親 `igCombo` コントロールを追加します。

	親 `igCombo` を追加して、必要なプロパティを定義します。
	
	**JavaScript の場合:**
	
	```
	$("#comboCountry").igCombo({
	      textKey: "txtCountry",
	      valueKey: "valCountry",
	      dataSource: dsCountry
	});
	```

4. 子 `igCombo` コントロールにデータ ソースを追加します。

	この手順では、子 `igCombo` データ ソースをオブジェクト配列として定義します。親との関係を持つ追加のキー (`keyCountry`) に注意してください。
	
	**JavaScript の場合:**
	
	```
	dsCascDistrict = [
	      { keyCountry: "US", txtDistrict: "New Jersey", valDistrict: "NJ" },
	      { keyCountry: "US", txtDistrict: "California", valDistrict: "CA" },
	      { keyCountry: "US", txtDistrict: "Illinois", valDistrict: "IL" },
	      { keyCountry: "US", txtDistrict: "New York", valDistrict: "NY" },
	      { keyCountry: "US", txtDistrict: "Florida", valDistrict: "FL" },
	      { keyCountry: "BG", txtDistrict: "Sofia", valDistrict: "SA" },
	      { keyCountry: "BG", txtDistrict: "Plovdiv", valDistrict: "PV" },
	      { keyCountry: "BG", txtDistrict: "Varna", valDistrict: "V" },
	      { keyCountry: "BG", txtDistrict: "Yambol", valDistrict: "Y" }
	];
	```

5. 子 `igCombo` コントロールを追加します。

	[`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) および [`parentComboKey`](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) プロパティを定義する子 `igCombo` を追加します。
	
	**JavaScript の場合:**
	
	```
	$("#comboDistrict").igCombo({
	      valueKey: "valDistrict",
	      textKey: "txtDistrict",
	      dataSource: dsCascDistrict,
	      parentComboKey: "keyCountry",
	      parentCombo: "#comboCountry"
	});
	```
	
	>**注:** [`parentCombo`](%%jQueryApiUrl%%/ui.igcombo#options:parentCombo) プロパティに jQuery セレクターを使用しない場合、ID の前にハッシュ記号 (#) を付ける必要があります。

6. (オプション) 結果を確認します。

	この HTML ページをブラウザーで開き、結果を確認します。上記の手順が完了すると、[プレビュー](#preview)に示すとおり、2 つの機能ドロップダウンが水平方向に並べて配置されます。


##<a id="related-content"></a>関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[カスケード igCombo コントロールをカスケード データ ソースへバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html): このトピックでは、親と子 `igCombo` コントロールを カスケード データ ソースにバインドする方法について説明します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

-	[コンボのカスケード](%%SamplesUrl%%/combo/cascading-combos): このサンプルでは、3 つの `igCombo` コントロールのカスケードを示します。





 

 


