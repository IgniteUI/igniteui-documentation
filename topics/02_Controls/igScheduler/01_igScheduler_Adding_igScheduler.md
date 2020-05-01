<!--
|metadata|
{
    "fileName": "igscheduler-adding-igscheduler",
    "controlName": "igScheduler",
    "tags": ["Getting Started","How Do I"]
}
|metadata|
-->

# igScheduler の追加

## 概要と目的

`igScheduler` を jQuery を使用して構成できます。このトピックは、基本の `igScheduler` コントロールを構成する方法を紹介します。

## このトピックの内容

このトピックは、以下のセクションで構成されます。

- [igScheduler の追加](#adding)
- [前提条件](#background)
- [igScheduler を Web ページに追加](#webpage)
- [基本の igScheduler の作成の実装手順](#basic-implementation)
- [結果](#result)
- [関連トピック](#related)

# <a id="adding"></a>igScheduler の追加

## <a id="background"></a>前提条件

以下のトピックは、このトピックを理解するための前提条件として必要な情報を示しています。

- [igScheduler の概要](igScheduler-Overview.html): このトピックは、`igScheduler` およびその機能の概要を説明します。

- [Infragistics Loader の使用](Using-Infragistics-Loader.html)
始まる前に、すべての必要なリソースを読み込みます。最初に jQuery リソースを読み込み、次に必要な %%ProductName%% リソースを読み込みます。%%ProductName%% リソースをプロジェクトに追加する方法が 3 つあります。`igLoader` を使用、必要なモジュールを読み込み、あるいはすべての必須リソースを結合するバンドル ファイルを使用することができます。以下はその方法です。

```js
$.ig.loader({
    scriptPath: "../../igniteui/js/",
    cssPath: "../../igniteui/css/",
    resources: "igScheduler"
});
```

バンドル モジュールを読み込む

```html
<script src="igniteui/js/infragistics.core.js"></script>
<script src="igniteui/js/infragistics.lob.js"></script>
<script src="igniteui/js/infragistics.scheduler-bundled.js"></script>
```

## <a id="webpage"></a>igScheduler を Web ページに追加

### 概要

この手順では、`igScheduler` を Web ページに追加する方法を手順ごとに示します。このサンプルは、igScheduler を月表示および予定オブジェクトとともに初期化する方法を紹介します。時間間隔の間で移動し、アクティビティを作成、編集、または削除できます。


### 要件

この手順を実行するには、以下が必要です。

-   この例を追加する Web サイトと Web ページ
-   Web サイト上の必要な JavaScript リソースおよび jQuery テーマ
-   Web ページ上の必要な JavaScript ファイルと CSS ファイルへの参照

## <a id="basic-implementation"></a>基本的な igScheduler 実装の作成
以下の手順は、複数の予定を表示する `igScheduler` コンポーネントをページに追加する方法を説明します。

1. 必要な JS および CSS ファイルの追加

    1.1.igLoader の使用

	igLoader は、指定したコントロールの JavaScript および CSS ファイルを読み込みます。

	```html
	<head>
		<title>igScheduler example</title>
		<script src="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.8.3.js"></script>
		<script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
		<script src="http://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>
		
		<script src="../IgniteUI/js/infragistics.loader.js"></script>
		<script src="../data-files/scheduler-data.js"></script>
	</head>
	<body>
		<div id="scheduler"></div>
		<script>
			$.ig.loader({
				scriptPath: "http://dev.igniteui.local/17-1/IgniteUI/js/",
				cssPath: "http://dev.igniteui.local/17-1/IgniteUI/css/",
				resources: "igScheduler"
			});
	
	.....
	```

	`scheduler` の id を持つ HTML DIV 要素が初期化で `igScheduler`  ウィジェットによってラップされます。

    1.2. モジュールを別々に読み込む

	```html
	<link type="text/css" href="ignite-ui/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.shared.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.editors.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.popover.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.notifier.css" rel="stylesheet" />
	
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.toolbarbutton.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.splitbutton.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.colorpicker.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.combo.css" rel="stylesheet" />
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.scroll.css" rel="stylesheet" />
	
	<link type="text/css" href="ignite-ui/css/structure/modules/infragistics.ui.scheduler.css" rel="stylesheet" />
	
	<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/modernizr/modernizr-2.8.3.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.3.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
	
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.util.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.util.jquery.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.datasource.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.templating.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.scroll.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.shared.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.popover.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.notifier.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.validator.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.combo.js"></script>
	<script type="text/javascript" src="ignite-ui/js/modules/infragistics.ui.editors.js"></script>
	
	<!-- ext -->
	<script src="ignite-ui/js/modules/infragistics.ext_core.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_text.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_collections.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_io.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_ui.js"></script>
	<script src="ignite-ui/js/modules/infragistics.dv_jquerydom.js" ></script>
	<script src="ignite-ui/js/modules/infragistics.ext_collectionsExtended.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_threading.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ext_web.js"></script>
	<!-- xml -->
	<script src="ignite-ui/js/modules/infragistics.xml.js"></script>
	<!-- dv -->
	<script src="ignite-ui/js/modules/infragistics.dv_core.js"></script>
	<script src="ignite-ui/js/modules/infragistics.dv_jquerydom.js"></script>
	
	<!-- scheduler -->
	<script src="ignite-ui/js/modules/infragistics.scheduler.core.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ui.scheduler.core.js"></script>
	<script src="ignite-ui/js/modules/infragistics.ui.scheduler.js"></script>
	```
	
	1.3. バンドル モジュールを読み込む
    
	```html
	<script src="igniteui/js/infragistics.core.js"></script>
	<script src="igniteui/js/infragistics.lob.js"></script>
	<script src="igniteui/js/infragistics.scheduler-bundled.js"></script>
	```

2. 予定およびリソース コレクションを対応する `dataSource` および `resources` オプションに割り当てます。

	```javascript
	...
	appointments = [{
            "resourceId": 1,
            "id": "11",
            "start": new Date(2017, 10, 2, 6, 45),
            "end": new Date(2017, 10, 3, 6, 45),
            "subject": "Marketing conference"
        },
        {
            "resourceId": 2,
            "id": "5",
            "end": new Date(2017, 10, 3, 12, 45),
            "start": new Date(2017, 10, 3, 13, 45),
            "subject": "Dentist appointment"
        }],
    resources = [
        { id: 1, displayName: "Trina Friesen"},
        { id: 2, displayName: "Mack Koch"}]
	...
	```
	
3. 上記コレクションを `dataSource` および `resources` オプションに割り当てます。

	```javascript
	$("#scheduler").igScheduler({
		height: "650px",
		width: "100%",
		selectedDate: today,
		dataSource: appointments,
		resources: resources
	});
	```

### <a id="result"></a>結果

以下のスクリーンショットは最終結果のプレビューです。

![](images/scheduler.png)

## <a id="related"></a>関連トピック

-   [igScheduler の概要](igScheduler-Overview.html)

-	[igScheduler の構成](igscheduler-Configuring.html)

-	[igScheduler のスタイル設定](igscheduler-Using-Themes.html)
