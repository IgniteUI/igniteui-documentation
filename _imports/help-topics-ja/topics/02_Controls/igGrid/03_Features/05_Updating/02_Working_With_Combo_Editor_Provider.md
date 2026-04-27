<!--
|metadata|
{
    "fileName": "working-with-combo-editor-provider",
    "controlName": "igGrid",
    "tags": ["Editing","Grids","Migration","Editor Provider Combo"]
}
|metadata|
-->

# igCombo エディター プロバイダーの操作

## トピックの概要

### 目的
このトピックには、igGrid のエディター プロバイダーとしてのコンボの基本設定の情報が含まれています。また、コンボ エディター プロバイダーからのアップデートの結果、表示テキストと値を決める基本的なオプションが、グリッドに保存されるデータに与える影響についても説明します。
 また、コンボ エディター プロバイダーを拡張して、デフォルト状態ではサポートされない機能の実装に使用するカスタム プロバイダーの作成方法も説明します。

### このトピックの内容
このトピックは、以下のセクションで構成されます。

- 	[**JavaScript でのコンボ エディター プロバイダーの構成**](#config)
	- [**基本構成**](#basicConfig)
	- [**複数選択機能を持つ igCombo エディターの構成**](#multiSelectionConfig)
-	[**関連トピック**](#topics)
-	[**関連サンプル**](#samples)

## <a id="config"></a> JavaScript でのコンボ エディター プロバイダーの構成

### <a id="basicConfig"></a> 基本構成
ここでは、igGrid で igCombo エディターを構成する手順を順を追って説明します。

1. 特定の列に対するigGrid 更新の列設定で、igGrid のインスタンスの作成と igCombo エディターの定義

	**JavaScript の場合**
	
	```
	$("#gridProducts").igGrid({
		dataSource: northwindProductsJSON,
		autoGenerateColumns: false,
		primaryKey: "ID",
		autoCommit: true,
		width: "100%",
		height: "360px",
		columns: [
			{ headerText: "", key: "ID", dataType: "number", width: "8%" },
			{ headerText: "Name", key: "Name", dataType: "string", width: "24%" },
			{ headerText: "Description", key: "Description", dataType: "string", width: "34%" },
			{ headerText: "Category", key: "CategoryID", dataType: "number", width: "34%", formatter: formatCategoryCombo }
			],
			features: [
					{
						name: 'Updating',
						columnSettings: [{
						//The combo is defined as an editor provider. Combo options are defined under 'editorOptions'.
						columnKey: "CategoryID",
						editorType: 'combo',
						required: true,
						editorOptions: {
						mode: "dropdown",
						dataSource: northWindCategoriesJSON
						}
						}]	
					}
			]            
	});
	```

	> **注:** igCombo の 1 つのインスタンスが、指定された列について作成されます。このインスタンスは、その列の別のセルを編集する場合に再利用されます。
	
2. 関連する列設定における追加の editorOptions の igCombo への定義

	JavaScript の場合:

	```
	columnSettings: [{
		columnKey: "CategoryID",
		editorType: 'combo',
		required: true,
		editorOptions: {
			mode: "dropdown",
			dataSource: northWindCategoriesJSON,
			textKey: "Name",
			valueKey: "ID"
		}
	}]
	```

	コンボに定義する必要がある基本的なオプションは、次のとおりです。
	-	[dataSource](%%jQueryApiUrl%%/ui.igCombo#options:dataSource) – ドロップダウン リストに項目を作成するために、コンポで使用されるデータ ソース。
	-	[valueKey](%%jQueryApiUrl%%/ui.igCombo#options:valueKey) – データ ソース内のフィールド。ドロップダウン項目の実際の値として使用。
	-	[textKey](%%jQueryApiUrl%%/ui.igCombo#options:textKey) (オプション - 設定されない場合は、valueKey と同じ) - ドロップダウン項目の表示値として使用される、データ ソース内のフィールド。
	-	[mode](%%jQueryApiUrl%%/ui.igCombo#options:mode) (オプション - 設定されない場合は、デフォルトで「editable」に設定)

	`textKey` オプションと `valueKey` オプションは、コンボ リストの表示値と実際の値に対応します。この 2 つのオプションを同じデータ フィールドを使用するように設定すると、グリッドのデータ ソースに保存される表示値と実際の値は同じになります。

	ただし、`textKey` のポイントするフィールドが `valueKey` のポイントするフィールドと異なる場合、編集後のデータ ソースに保存される実際の値は、選択された項目の値となることに注意してください。テキストは、表示目的のみのため無視されます。 

	グリッドのセルに、関連付けられたドロップダウン項目の値ではなくテキストを表示したい場合は、追加の [`formatter`](%%jQueryApiUrl%%/ui.iggrid#options:columns.formatter) 関数を列に定義し、値を表示テキストと関連付ける必要があります。類似の例を、次の関連サンプル [コンボ エディターを使用するグリッド](%%NewSamplesUrl%%/combo/grid-with-combo-editor)に示します。

	**JavaScript の場合**
	```
	function formatCategoryCombo(val) {
		var i, category;
		for (i = 0; i < northWindCategoriesJSON.length; i++) {
			category = northWindCategoriesJSON[i];		
			if (category.ID == val) {
				val = category.Name;
			}
		}
		return val;
	}
	```
3. 結果の検証

	![](images/igGrid_Combo_Editor_Provider_1.png)

### <a id="multiSelectionConfig"></a> 複数選択をサポートする igCombo エディターのカスタム構成

> **注:** グリッドでは、複雑な値をデータ ソースに保存することはできないため、このシナリオはこのままの状態ではサポートされません。このようなシナリオをサポートするには、(配列形式の) 複雑なデータがコンボの複数選択からグリッドに、また逆方向に渡されるシナリオを扱うために、igCombo プロバイダーの getValue/setValue メソッドに適用されるカスタム実装が必要になります。
textKey と valueKey が異なり、複数の値を保存するのが難しい型の値 (数値型など) の場合、値の保存および設定、データ ソース内の値を操作する機能 (並べ替え、フィルタリングなど) の追加論理にカスタム実装を適用する必要があります。

ここでは、文字列型の列での複数選択をサポートするために、コンボ エディターの機能を拡張するカスタム プロバイダーを作成するプロセスを順を追って説明します。データ ソースに保存される値は、選択された項目をコンマで区切ったリストになります。

1. 特定の列に対する igGrid 更新の列設定で、igGrid のインスタンスの作成とカスタム エディターの定義

	**JavaScript の場合**

	```
	var northwindProductsJSON = [
		{ "ID": 0, "Name": "Bread", "Description": "Whole grain bread", "Price": "2.5", "CategoryID": "Food" },
		{ "ID": 1, "Name": "Milk", "Description": "Low fat milk", "Price": "3.5", "CategoryID": "Beverages" },
		{ "ID": 2, "Name": "Vint Soda", "Description": "Americana Variety - Mix of 6 flavors", "Price": "20.9", "CategoryID": "Beverages"  },
		{ "ID": 3, "Name": "Havina Cola", "Description": "The Original Key Lime Cola",  "Price": "19.9", "CategoryID": "Beverages"  },
		{ "ID": 4, "Name": "Fruit Punch", "Description": "Mango flavor, 8.3 Ounce Cans (Pack of 24)",  "Price": "22.99", "CategoryID": "Beverages"  },
		{ "ID": 5, "Name": "Cranberry Juice", "Description": "16-Ounce Plastic Bottles (Pack of 12)",  "Price": "22.8", "CategoryID": "Beverages"  },
		{ "ID": 6, "Name": "Pink Lemonade", "Description": "36 Ounce Cans (Pack of 3)", "Price": "18.8", "CategoryID": "Beverages"  },
		{ "ID": 7, "Name": "DVD Player", "Description": "1080P Upconversion DVD Player", "Price": "35.88", "CategoryID": "Electronics" },
		{ "ID": 8, "Name": "LCD HDTV", "Description": "42 inch 1080p LCD with Built-in Blu-ray Disc Player", "Price": "1088.8", "CategoryID": "Electronics" }
		],
	northWindCategoriesJSON = [
		{ "ID": 0, "Name": "Food" },
		{ "ID": 1, "Name": "Beverages" },
		{ "ID": 2, "Name": "Electronics" }
	];  
	$("#gridProducts").igGrid({
		dataSource: northwindProductsJSON,
		autoGenerateColumns: true,
		primaryKey: "ID",
		autoCommit: true,               
		features: [
		{
			name: 'Updating',
			columnSettings: [{
				//The combo is defined as a custom editor provider. Combo options are defined under 'editorOptions'.
				columnKey: "CategoryID",
				editorProvider: new $.ig.ComboEditorProviderCustom(),
				editorOptions: {
					mode: "dropdown",
					dataSource: northWindCategoriesJSON,
					textKey: "Name",
					valueKey: "Name",
					allowCustomValue: true,
					multiSelection: {
						enabled: true,
						showCheckboxes: true,
						itemSeparator: ', '						
					}
				}
			}]				
		}]
	});
	```

	前述の構成では、textKey と valueKey は同じフィールドを使用するように設定されています。したがって、[`formatter`](%%jQueryApiUrl%%/ui.iggrid#options:columns.formatter) 関数を指定する必要はありません。
	チェックボックスによる複数選択が有効であることにも注意してください。

2. デフォルトの EditorProviderCombo の機能を拡張したカスタム エディター プロバイダーの作成、およびデフォルトの getValue メソッドおよび setValue メソッドの上書き

	**JavaScript の場合**
	```
	$.ig.ComboEditorProviderCustom = $.ig.EditorProviderCombo.extend({
		getValue: function () {			
		var val = this.editor.value();
		var text= this.editor.text();
		if ($.type(val) === "array" && val.length) {		
			//When the passed value is of complex type return the text instead. 
			//This will be the value saved in the grid data source after editing ends.
			return text;
		}				
		return val;
		},
		setValue: function (val, fire) {					
			var array = [];
			this.editor.deselectAll();					
			if (this.options.multiSelection.enabled && val.contains(this.options.multiSelection.itemSeparator)) {
				//if multiSelection is enabled and the value passed from the grid cell to the edito contains the specified itemSeparator
				//Then split the value by the separator and set a complex value back to the editor so that the matching items will get selected.
				array = val.split(this.options.multiSelection.itemSeparator);
				return this.editor.value(array, null, fire);
			}	
			this.editor.value(val, null, fire);
		}				
	});
	```

3. 結果の検証

	コンボから複数の値を選択できます。これらの値は、グリッドに対する文字列として適用されます。

	![](images/igGrid_Combo_Editor_Provider_MultiSelection_1.png)

	セルの編集モードに入ると、コンマで区切られたリストからの関連値は、ドロップダウンで選択済みとマークされます。

	![](images/igGrid_Combo_Editor_Provider_MultiSelection_2.png)


## <a id="topics"></a> 関連トピック 
以下は、その他の役立つトピックです。

-	[igCombo の構成](igCombo-Configuring.html)
- 	[更新の概要 (igGrid)](igGrid-Updating.html)
-   [igGridUpdating API マニュアル](%%jQueryApiUrl%%/ui.igGridUpdating)
-   [igCombo API マニュアル](%%jQueryApiUrl%%/ui.igCombo)
 
## <a id="samples"></a> 関連サンプル

-	[基本編集](%%NewSamplesUrl%%/grid/basic-editing)
- 	[コンボ エディターを含むグリッド](%%NewSamplesUrl%%/combo/grid-with-combo-editor)
 


