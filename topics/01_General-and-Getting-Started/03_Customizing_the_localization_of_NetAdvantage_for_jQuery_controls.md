<!--
|metadata|
{
    "fileName": "customizing-the-localization-of-netadvantage-for-jquery-controls",
    "controlName": "1",
    "tags": []
}
|metadata|
-->

# Ignite UI コントロールのローカライズのカスタマイズ

##トピックの概要

#### 目的

このトピックでは、必要な言語での Ignite UI™ コントロールのローカライズ方法について説明します。

#### 必要な背景

以下の表は、このトピックを理解するための前提条件として必要なトピックを示しています。

[Ignite UI で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html) : このトピックでは、Ignite UI のフォルダー構造、Infragistics ローダーの使用方法、およびコントロールの手動での参照方法について説明します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#Introduction)
-   [コントロールのローカライズ ファイル参照](#Localization)
   -   [概要](#subIntroduction)
    -   [コントロールのローカライズ参照の概要](#LocalizationSummary)
-   [手順: igGridPaging のローカライズ](#Walkthrough)
   -   [概要](#WalkthroughIntroduction)
    -   [プレビュー](#Preview)
    -   [要件](#Requirements)
    -   [概要](#Overview)
    -   [手順](#Steps)
-   [関連コンテンツ](#RelatedContent)


##<a id="Introduction"></a>概要


#### Ignite UI コントロールのローカライズの紹介

現在、jQuery コントロールは以下の言語で提供されています。

-   英語
-   日本語
-   ロシア語
-   ブルガリア語
-   ドイツ語
-   フランス語
-   スペイン語 

これらの言語のいずれかのローカライズ バージョンのコントロールを入手するには、Infragistics ローダーの locale プロパティを設定、またはローカライズ ファイル `infragistics-<locale>.js` を追加する必要があります。ここで `<locale>` は、en、ja、ru、bg、de、fr、es のいずれかになります。

>**注:** Infragistics ローダーは、カスタム ローカライズ ファイルの読み込みには使用できません。


>**注:** 2 つの再配布可能なパッケージがあります。ひとつは英語、もうひとつは日本語です。英語版では、再配布可能なパッケージ `infragistics-en.js` は利用できません。ローカライズ文字列は、ファイルの最初のコントロール コードに含まれています。日本語版では、再配布可能なパッケージ `infragistics-ja.js` は利用できません。ローカライズ文字列は、ファイルの最初のコントロール コードに含まれています。

別の言語を設定する場合、設定手順は異なります。

-   コントロールをローカライズします
   -   ローカライズ ファイルを見つけます - ローカライズ ファイルは `<Ignite_UI_Install_Folder>\js\modules\i18n` にあります

<IgniteUI_Install_Folder> のデフォルト値は:      

```
%%InstallPath%%
```

-   使用したいコントロールをローカライズするには、ローカライズするコントロールの `*-ru.js` ファイルのコピーを作成し、`*-<language>.js` に名前を変更します。ここでは、<language> は使用する言語の 2 文字のコードです。

-   ローカライズされたファイルをプロジェクトに追加します。作成したファイルをプロジェクトに追加します。このようにして、コントロールは、開発者のファイルからの文字列を使用するようになります。locale プロパティをどのように設定しても、このアプローチは Infragistics ローダーで動作します。

>**注:** このガイドは、英語版の再配布可能なパッケージがインストールされていることを前提としています。この場合、`infragistics-en.js` はありません。このため、`infragistics-ru.js` を使用します。都合が悪い場合は日本語の再配布可能パッケージを入手して、そこから `infragistics-en.js` を入手できます。



##<a id="Localization"></a>コントロールのローカライズ ファイル参照


### <a id="subIntroduction"></a>概要

このセクションでは、Ignite UI コントロールの利用可能なローカライズ ファイルについて説明します。これらのファイルは <IgniteUI_Install_Folder>\js\modules\i18n フォルダーにあり、ここで <IgniteUI_Install_Folder> は、Ignite UI をインストールしたディレクトリを指します。

####<a id="LocalizationSummary"></a> コントロールのローカライズ参照の概要

以下の表は、Ignite UI コントロールのローカライズ ファイルの概要を示しています。

<table class="table">
	<thead>
		<tr>
			<th>コントロール</th>
			<th>スクリプト名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>igChart</td>
			<td>infragistics.dvcommonwidget-ru.js</td>
		</tr>
		<tr>
			<td>igCombo</td>
			<td>infragistics.ui.combo-ru.js</td>
		</tr>
		<tr>
			<td>igDataSource</td>
			<td>infragistics.dataSource-ru.js</td>
		</tr>
		<tr>
			<td>igDialog</td>
			<td>infragistics.ui.dialog-ru.js</td>
		</tr>
		<tr>
			<td>igEditors</td>
			<td>infragistics.ui.editors-ru.js</td>
		</tr>
	</tbody>
</table>

    
>**注:**  igDatePicker は、jQuery UI Datepicker コントロールに依存しているため、Web サイトの jQuery UI 再配布可能なパッケージに含まれる `jquery.ui.datepicker-*.js` ローカライゼーション ファイルも必要となります。

<table class="table">
	<thead>
		<tr>
			<th>コントロール</th>
			<th>スクリプト名</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>igGrid</td>
			<td>infragistics.ui.grid-ru.js</td>
		</tr>
		<tr>
			<td>igHtmlEditor</td>
			<td>infragistics.ui.tree-ru.js</td>
		</tr>
		<tr>
			<td>igUpload</td>
			<td>infragistics.ui.upload-ru.js</td>
		</tr>
		<tr>
			<td>igValidator</td>
			<td>infragistics.ui.validator-ru.js</td>
		</tr>
		<tr>
			<td>igVideoPlayer</td>
			<td>infragistics.ui.videoplayer-ru.js</td>
		</tr>
	</tbody>
</table>   

##<a id="Walkthrough"></a>手順: igGridPaging のローカライズ

### <a id="WalkthroughIntroduction"></a>概要

この手順では、igGridPaging のローカライズ プロセスを説明します。デモの目的で、スペイン語のローカライズを使用します。

####<a id="Preview"></a> プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Customizing_the_Localization_of_NetAdvantage_for_jQuery_Controls_1.png)

#### <a id="Requirements"></a>要件

手順を実行するには、Ignite UI %%ProductVersionShort%% (英語版再配布可能パッケージ) のインストールが必要です。

>**注**: インストール パスは `%%InstallPath%%` として仮定します。

####<a id="Overview"></a> 概要

このトピックでは、igGridPaging のローカライズについてステップごとに説明します。以下はプロセスの概念的概要です。

1. [infragistics.ui.grid-ru.js のコピーを作成し、infragistics.ui.grid-es.js に名前を変更](#copy_localization_file)

2. [infragistics.ui.grid-es.js のローカライズ](#localize_file)

3. [ローカライズされたファイルをスクリプト参照と共にプロジェクトに追加](#include_localized_file)

#### <a id="Steps"></a>手順

以下の手順は、x コントロールのローカライズ方法を示します。


1. <a id="copy_localization_file"></a> `infragistics.ui.grid-ru.js` のコピーを作成し、`infragistics.ui.grid-es.js` に名前を変更します。

`%%InstallPath%%\js\modules\i18n\infragistics.ui.grid-ru.js` を `%%InstallPath%%\js\modules\i18n\infragistics.ui.grid-es.js` にコピーします。

この結果は、以下のスクリーンショットに示されています。

![](images/Customizing_the_Localization_of_NetAdvantage_for_jQuery_Controls_2.png)

2. <a id="localize_file"></a> infragistics.ui.grid-es.js のローカライズ

`%%InstallPath%%\js\modules\i18n\infragistics.ui.grid-es.js` をテキスト エディターで開き、`igGridPaging` セクションの文字列を自分の言語に翻訳します。この場合はスペイン語です。

>**注:** `infragistics.ui.grid-es.js` にはすべての `igGrid` 機能のローカライズ文字列が含まれているため、すべての `igGrid` 機能を使用する必要がなければ、ファイル全体を翻訳する必要はありません。

**JavaScript の場合:**

```
$.ig.GridPaging = $.ig.GridPaging || {};
          $.extend( $.ig.GridPaging , {
          locale : {
              pageSizeDropDownLabel: "Muestreme los registros",
              pageSizeDropDownTrailingLabel: "registros",
              nextPageLabelText: "siguienta",
              prevPageLabelText: "anterior",
              firstPageLabelText: "",
              lastPageLabelText: "",
              currentPageDropDownLeadingLabel: "Pg",
              currentPageDropDownTrailingLabel: "de ${count}",
              currentPageDropDownTooltip: "Elija índice de página",
              pageSizeDropDownTooltip: "Elija el número de registros por página",
              pagerRecordsLabelTooltip: "Rango de registros actual",
              prevPageTooltip: "Vaya a la página siguiente",
              nextPageTooltip: "Vaya a la página anterior",
              firstPageTooltip: "Vaya a la página primera",
              lastPageTooltip: "Vaya a la página última",
              pageTooltipFormat: "página ${index}",
              pagerRecordsLabelTemplate: "${startRecord} - ${endRecord} de ${recordCount} registros"
              }
          });
```
              

3. <a id="include_localized_file"></a> ローカライズされたファイルをスクリプト参照と共にプロジェクトに追加

HTML ファイルを作成して結果を検証します。以下のスクリーンショットに示すように、HTML ファイルに、`igGridPaging` に必要なファイルを含めます。

**HTML の場合:**

```
<script src="../scripts/modernizr.min.js"></script>
<script src="../scripts/jquery.min.js"></script>
<script src="../scripts/jquery-ui.min.js"></script>
<script src="../../js/modules/i18n/infragistics.ui.grid-es.js"></script>
<script src="../../js/infragistics.loader.js"></script>
```
              
##<a id="RelatedContent"></a>関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [はじめに](Deployment-Guide.html): Ignite UI コントロールの配備方法を説明します。

- [Ignite UI の JavaScript ファイル](Deployment-Guide-JavaScript-Files.html) : Ignite UI のすべての JavaScript ファイルを示します。





 

 


