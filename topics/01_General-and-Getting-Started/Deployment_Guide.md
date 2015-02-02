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
Ignite UI アプリケーションを配備するには、コントロールの JavaScript、CSS、および画像の 3 つのリソース タイプを処理する必要があります。アプリケーションの構成に基づいてリソース タイプの処理が異なります。

## ファイルおよび場所
アプリケーションを作成または配備する前に、[Ignite UI の JavaScript ファイル](Deployment-Guide-JavaScript-Files.html)をレビューします。 
Ignite UI で使用されるファイル形式をレビューした後、コントロール リソースおよびローカライズ リソースを参照する方法については、[Ignite UI での JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)を参照してください。 [ページにファイルを手動的に追加](Adding-the-Required-Resources-for-NetAdvantage-for-jQuery.html)および [Ignite UI スクリプト ローダーを使用してファイルを自動参照](Using-Infragistics-Loader.html)のトピックがあります。ローカル サーバーまたは [Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html) からファイルを要求できます。

## ローカライズ
アプリケーションをローカライズする場合、[ローカライズ設定をカスタマイズ](Customizing-the-localization-of-NetAdvantage-for-jQuery-controls.html)できますが、配備手順に影響する場合があります。

## MVC ヘルパーの使用方法
Ignite UI コントロールを JavaScript で使用、または ASP.NET MVC ヘルパーと使用できます。ヘルパー メソッドを使用する場合、配備に影響する場合があります。[コントロールを MVC プロジェクトへの追加](Adding-NetAdvantage-Controls-to-an-MVC-Project.html)をご確認ください。

## スタイル設定とテーマ設定
テーマをアプリケーションに追加する場合、スタイル設定および画像ファイルをサーバーに配備する必要があります。[Ignite UI のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)トピックで、ファイルの編成の詳細を提供します。

## 古いブラウザーのサポート
アプリケーションを古いブラウザーで実行する場合があります。古いブラウザーとの互換性については、[HTML5 と CSS3 をサポートしないブラウザーで Ignite UI を使用](Deployment-Guide-Using-NetAdvantage-for-jQuery-in-Browsers-that-Dont-Support-HTML5-or-CSS3.html)を参照してください。

## Ignite UI のアップグレード
Ignite UI バージョンをアップグレードする詳細については、[プロジェクトを Ignite UI の最新バージョンにアップグレード](Manually-Updating-Previous-Versions.html) トピックを参照してください。

