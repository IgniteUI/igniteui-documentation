<!--
|metadata|
{
    "fileName": "deployment-guide",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 配備ガイド

## 概要
%%ProductName%% アプリケーションを配備するには、コントロールの JavaScript、CSS、および画像の 3 つのリソース タイプを処理する必要があります。アプリケーションの構成に基づいてリソース タイプの処理が異なります。

## ファイルおよび場所
アプリケーションを作成または配備する前に、[%%ProductName%% の JavaScript ファイル](Deployment-Guide-JavaScript-Files.html)をレビューします。 
%%ProductName%% で使用されるファイル形式をレビューした後、コントロール リソースおよびローカライズ リソースを参照する方法については、[%%ProductName%% での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)を参照してください。 [ページにファイルを手動的に追加](Adding-the-Required-Resources-for-igniteui-for-jQuery.html)および [%%ProductName%% スクリプト ローダーを使用してファイルを自動参照](Using-Infragistics-Loader.html)のトピックがあります。ローカル サーバーまたは [Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html) からファイルを要求できます。

## ローカライズ
アプリケーションをローカライズする場合、[ローカライズ設定をカスタマイズ](Customizing-the-localization-of-IgniteUI-for-jQuery-controls.html)できますが、配備手順に影響する場合があります。

## %%ProductNameMVC%%の使用方法
%%ProductName%% コントロールを JavaScript で使用、または %%ProductNameMVC%% と使用できます。ヘルパー メソッドを使用する場合、配備に影響する場合があります。[コントロールを MVC プロジェクトへの追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)をご確認ください。

## スタイル設定とテーマ設定
テーマをアプリケーションに追加する場合、スタイル設定および画像ファイルをサーバーに配備する必要があります。[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)トピックで、ファイルの編成の詳細を提供します。

## 古いブラウザーのサポート
アプリケーションを古いブラウザーで実行する場合があります。古いブラウザーとの互換性については、[HTML5 と CSS3 をサポートしないブラウザーで %%ProductName%% を使用](Deployment-Guide-Using-IgniteUI-for-jQuery-in-Browsers-that-Dont-Support-HTML5-or-CSS3.html)を参照してください。

## %%ProductName%% のアップグレード
%%ProductName%% バージョンをアップグレードする詳細については、[プロジェクトを %%ProductName%% の最新バージョンにアップグレード](Manually-Updating-Previous-Versions.html) トピックを参照してください。

