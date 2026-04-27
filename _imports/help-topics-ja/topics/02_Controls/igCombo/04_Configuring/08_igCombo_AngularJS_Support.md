<!--
|metadata|
{
    "fileName": "igcombo-angularjs-support",
    "controlName": "igCombo",
    "tags": ["AngularJS"]
}
|metadata|
-->

# AngularJS サポート (igCombo)

## トピックの概要
本トピックは、AngularJS で `igCombo` を構成する方法について説明します。各コントロールは、対応する  AngularJS ディレクティブがあり、`igCombo` も同様です。`igCombo`　ディレクティブの概要です。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [プレビュー](#Preview)
-   [要件](#Requirements)
-   [詳細](#Details)
-   [関連コンテンツ](#Related_Content)

### <a id="Preview"></a>プレビュー
以下は最終結果のプレビューです。

<div class="embed-sample">
   [%%SamplesEmbedUrl%%/combo/angular](%%SamplesEmbedUrl%%/combo/angular)
</div>

### <a id="Requirements"></a>要件
このサンプルを実行するために以下が必要です。
-   必要となる %%ProductName%% の JavaScript と CSS ファイル
-   %%ProductFamilyName%% AngularJS ディレクティブ

### <a id="Details"></a>詳細
サンプルに製品が 20 個あります。AngularJS ng-repeat を使用してデータソース レコード全体をループし、それぞれの製品に入力を作成して ProductName へバインドします。この方法によって入力で何かを編集する場合に変更はデータソースに直ちに反映されます。製品名の上に同様のオプションがある `igCombo` コントロールが 2 つあります。それらは製品でデータソースにバインドされています。また、選択した製品 id を保存するコントローラー (combo.value1) の値にバインドされています。`igCombo` コントロールの左側に同じ値 (combo.value1) にバインドされた入力があります。製品名を保持する入力を編集、`igCombo` から値を選択、選択した製品 id を編集できます。両方向のバインドで `igCombo` コントロールを更新し、対応する値を直ちに入力します。

### <a id="Related_Content"></a>関連コンテンツ
このトピックの追加情報については、以下のトピックも合わせてご参照ください。
-   [AngularJS で %%ProductFamilyName%% の使用](Using-Ignite-UI-with-AngularJS.html) - このトピックでは、AngularJS の %%ProductFamilyName%% ディレクティブの使用方法の概要を説明します。
-   [AngularJS を使用した条件付きテンプレート化および高度なテンプレート化](Conditional-and-Advanced-Templating-with-AngularJS.html) - このトピックでは、条件付きテンプレートの使用方法と、AngularJS の %%ProductFamilyName%% ディレクティブを使用して作成されたコントロールをカスタマイズするための高度なテンプレート化の方法について説明します。
