<!--
|metadata|
{
    "fileName": "deployment-guide-styling-and-theming",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# スタイル設定とテーマ設定

##トピックの概要

#### 目的

このトピックでは、デザイン段階でのアプリケーションのセットアップ手順について説明し、実稼働環境で CSS を使用するためのオプションを紹介すると同時に、テーマの作成またはカスタマイズについての概要を示します。

#### このトピックの構成

このトピックは、以下のセクションで構成されます。

-   [%%ProductName%% のスタイル設定とテーマ設定](#_Styling_and_Theming_IgniteUI)
-   [必要なテーマのアプリケーションへの追加](#_Adding_Required_Themes_in_Your_Application)
-   [Infragistics テーマ](#Infragistics_Themes)
-   [Infragistics Loader を使用したテーマのアプリケーションへの追加](#_Using_Infragistics_Loader_for_Adding_a_Theme_in_Your_Application)
-   [テーマ ローラーの使用](#_Using_Theme_Roller)
-   [Bootstrap テーマ ジェネレーターを使用](#Using_Bootstrap_Theme_Generator)
-   [CDN の使用](#_Using_CDN)
-   [関連コンテンツ](#_Related_Content)



##<a id="_Styling_and_Theming_IgniteUI"></a>%%ProductName%% のスタイル設定とテーマ設定


#### 概要

%%ProductName%%™ はスタイルやテーマの設定に jQuery UI CSS フレームワークを利用します。*Infragistics*、*Infragistics 2012*、*metro*、および *iOS* は、Infragistics が提供するアプリケーションで使用するための  jQuery UI テーマです。jQuery UI および %%ProductName%% コントロールにおいてコンパイルされるデフォルト Twitter Bootstrap テーマ、および *Yeti*、*Superhero*、および *Flatly* の 3 つのカスタム テーマを提供します。このドキュメントはデザイン タイムのアプリケーションの設定方法を示し、テーマの作成またはカスタマイズの方法の概要を説明して、実稼動環境で %%ProductName%% CSS を使用するオプションを紹介します。

#### CSS リソースの編成

%%ProductName%% には、実稼働環境で使用するための結合および縮小したテーマのセットが同梱されています。これらの縮小バージョンによって、CSS の可読性は下がるものの、実稼働環境ではネットワーク経由でリソースをより高速にダウンロードできます。

CSS ファイルは以下に示す構造に再編成されています。

-   テーマ フォルダーの内容は css フォルダーへ移動しました。

各テーマの css には拡張子 **theme.css** が付きます。

![](images/Theming_Guide_Changes_1.png)

-   ベース ディレクトリは css で {IG Resources root} の下にあります。

ここには構造体とテーマのフォルダーがあります。

![](images/Theming_Guide_Changes_2.png)

structure ディレクトリの下には、以下のフォルダーと構造体があります。

-   画像

**css\structure\images**

-   modules - ウィジット固有ファイルはすべて modules の下にあります。これらは、1 レベル上の画像を参照します: `../images/IMAGE_NAME.gif`

	`css\structure\modules`

-   infragistics.css という名の結合 css ファイルです。

	`css\structure\infragistics.css`

結合処理時、すべての画像参照は現在の位置の画像フォルダーを参照するよう変更されています。

```
images/IMAGE_NAME.gif
```

![](images/Theming_Guide_Changes_3.png)



##<a id="_Adding_Required_Themes_in_Your_Application"></a>必要なテーマのアプリケーションへの追加


#### 概要

すべてのテーマは、`css` フォルダー内のインストール ディレクトリに配置されています。

%%ProductName%% %%ProductVersionShort%% のインストール時に一般的なフォルダー構成を選択した場合、各リソースは次のパスに置かれています。

```
%%InstallPath%%\css
```

テーマをアプリケーションに追加するには、css フォルダー**全体** (**'structure'** および 'themes' ディレクトリを含む) をサイトのファイルのある場所にコピーします。

Bootstrap 用のテーマ ジェネレーターの Web アプリケーションからエクスポートしたカスタム ブートストラップ用テーマを、themes サブディレクトリにコピーする必要があります。

注: Infragistics Loader の使用時は、フォルダー構造を保持する必要があります。このようにすると、ローダーは期待通りに機能します。使用されないテーマがある場合、それらは削除することができますが、その構造は変更してはいけません。

以下のスクリーンショットは、フォルダー構造を示しています。

![](images/Theming_Guide_Changes_4.png)

## 概要

このトピックでは、Web サイトに必要なテーマを追加する方法をステップごとに示します。以下はプロセスの概念的概要です。

1. Infragistics テーマ ファイルのコードへの組み込み。
2. Infragistics 構造ファイルのコードへの組み込み。

#### 手順

以下のステップでは、Web サイトに必要なテーマを追加する方法を示します。


1.  Infragistics テーマ ファイルのコードへの組み込み。

	以下のコードは、ファイルに Infragistics テーマを組み込みます。

	**HTML の場合:**

	```html
	<link href="{IG Resources root}/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />
	```

	**ASPX の場合:**

	```csharp
	<%@ Import Namespace="Infragistics.Web.Mvc" %>
	<!DOCTYPE html>
	<html>
	<head id="Head1" runat="server">
	<link href="<%= Url.Content("{IG Resources root}/css/themes/infragistics/infragistics.theme.css ") %>” rel="stylesheet" type="text/css" />
	```

2. Infragistics 構造ファイルのコードへの組み込み。

	以下のコードは、ファイルに Infragistics 構造ファイルを組み込みます。

	**HTML の場合:**

	```html
	<link href="{IG Resources root}/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
	```

	**ASPX の場合:**

	```csharp
	<link href="<%= Url.Content("{IG Resources root}/css/structure/infragistics.css") %>” rel="stylesheet" type="text/css" />
	```

##<a id="Infragistics_Themes"></a>Infragistics テーマ


#### テーマの概要

Infragistics は、Web サイトに組み込むことができる以下のテーマを提供します。

-   Infragistics テーマ
-   Infragistics 2012 テーマ
-   Metro テーマ
-   iOS テーマ 
-   Bootstrap 用のテーマ
    -   デフォルト
    -   Superhero
    -   Yeti
    -   Flatly

提供された以外のテーマを使用すると、*Infragistics* ウィジェットにいくつかのスタイリング ポイントが追加されます。完璧なデザインを実現する場合、ウィジェットで有効化された機能とテーマによっては、スタイリング ポイントのカスタマイズが必要になる場合があります。Bootstrap 用のテーマ ジェネレーターの Web アプリケーションから取得できるテーマはそのまま使用でき、追加的なカスタマイズが必要ありません。

#### Infragistics テーマ

Infragistics テーマは、jQuery UI テーマに通常存在するすべてのスタイルを含むカスタム テーマです。このテーマは別のテーマで置き換えることができますが、jQuery ウィジットを正しく表示するにはファイル `{IG Resources root}\css\structure\infragistics.css` への参照が必要です。

#### Metro テーマ

*Metro* テーマは、クリーン、でモダンかつ高速な Metro デザイン言語の実装です。このテーマは別のテーマで置き換えることができますが、 jQuery ウィジットを正しく表示するにはファイル `{IG Resources root}\css\structure\infragistics.css` への参照が必要です。

#### iOS テーマ

*iOS* テーマは、広く普及している iOS のルックアンドフィールの実装です。このテーマは別のテーマで置き換えることができますが、 jQuery ウィジットを正しく表示するにはファイル `{IG Resources root}\css\structure\infragistics.css` への参照が必要です。

#### Bootstrap 用のテーマ

jQuery UI および %%ProductName%% の Bootstrap 用のテーマは、人気のある Bootstrap 用テーマと同じ名前で生成されます。jQuery UI の CSS フレームワークの規約に従い、テーマに対してそのルックアンドフィールを利用するプロセスは、Bootstrap 用のテーマ ジェネレーターの Web アプリケーションで自動化されています。エクスポートする機能では、%%ProductName%% や jQuery UI ウィジェットのスタイル用に LESS で利用できる、ほとんどすべての Bootstrap 用のテーマがエクスポートできます。`{IG Resources root}\css\structure\infragistics.css` ファイルの参照が必要です。

##<a  id="_Using_Infragistics_Loader_for_Adding_a_Theme_in_Your_Application"></a>Infragistics Loader を使用したテーマのアプリケーションへの追加

### Infragistics Loader の使用の概要

cssPath および scriptPath オプションを設定するには、ローダーをインスタンス化するページに関連するパスを設定する必要があります。

**JavaScript の場合:**

```js
$.ig.loader({
            scriptPath: '{IG Resources root}/js/',
            cssPath: '{IG Resources root}/css/',
            resources: 'igCombo'
       });
```

別なテーマを設定するには以下のコードのように **theme** オプションを使用できます。

**JavaScript の場合:**

```js
$.ig.loader({
            scriptPath: "{IG Resources root}/js/",
            cssPath: "{IG Resources root}/css/",
            resources: "igGrid.*",
            theme: "metro"
      });
```

Infragistics Loader の詳細は、「[%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html)」のトピックを参照してください。

> **注:**カスタム テーマの場合は、テーマのディレクトリ名を使用してください。



##<a id="_Using_Theme_Roller"></a>テーマ ローラーの使用


#### 概要

ThemeRoller は jQuery UI が提供するツールで。これを使用すると、jQuery UI ウィジェットと互換性のあるカスタム テーマを簡単に作成できるようになります。数々のビルド済みテーマを自身の Web サイトにダウンロードして、組み込むことができます。Infragistics jQuery ウィジェットでは、ThemeRoller テーマをサポートしています。

個々のテーマを組み込めるだけでなく、[Theme Switcher](http://docs.jquery.com/UI/Theming/ThemeSwitcher) ウィジェットを使用して、ビルド済みの jQuery UI テーマをブラウザー内で動的に変更できます。

> **注:** Infragistics と Metro テーマは、他の ThemeRoller テーマと一緒には使用できません。これは、`infragistics.theme.css` および最後のオーバーライドを含むすべての css が ThemeRoller と互換性がないためです。アプリケーションが ThemeRoller を使用する場合、CSS ファイルは `jquery.ui.theme.css` のみ許されます。ローダーからこれを修正するには、テーマ オプションを "" (空の文字列) に設定します。するとローダーはデフォルトのテーマ (jQuery ウィジットでは infragistics) を読み込みません。

#### プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Theming_Guide_Changes_5.png)

#### 手順

以下のステップでは、アプリケーションに Redmond テーマを追加する方法を示します。

1. テーマ ディレクトリに *Redmond* テーマを追加します。

	- [Theme Roller](http://jqueryui.com/themeroller/) Web サイトに移動して、Gallery タブをクリックし、ダウンロードするテーマを見つけます。
	- Redmond テーマの隣の Download をクリックします。ダウンロードの完了後、圧縮フォルダーをファイル システムに解凍します。
	- ZIP ファイルに、css という名前のディレクトリがあります。このディレクトリに、テーマ名が付いた redmond フォルダーがあります。
	- このディレクトリを自分の Web サイトの themes ディレクトリにドラッグします。

	![](images/Theming_Guide_Changes_6.png)

2. CSS リンクを更新して、Infragistics テーマを Redmond テーマに置き換えます。

	1. Redmond テーマへの CSS 参照を追加します。

		**HTML の場合:**
		
		```html
		<link href="/css/themes/redmond/jquery-ui-1.8.13.custom.css" rel="stylesheet" type="text/css" />
		```
		
		**ASPX の場合:**
		
		```csharp
		<%@ Import Namespace="Infragistics.Web.Mvc" %>
		<!DOCTYPE html>
		<html>
		<head runat="server">
		<link href="<%= Url.Content("~css/themes/redmond/jquery-ui-1.8.13.custom.css") %>” rel="stylesheet" type="text/css" />
		```

	2. 構造テーマへの CSS 参照を追加します。

		**HTML の場合:**
		
		```html
		<link href="/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
		```
		
		**ASPX の場合:**
		
		```csharp
		<link href="<%= Url.Content("~css/structure/infragistics.css") %>" rel="stylesheet" type="text/css" />
		```

##<a id="Using_Bootstrap_Theme_Generator"></a>Bootstrap テーマ ジェネレーターを使用

Bootstrap 用のテーマ ジェネレーターは Infragistics が提供する Web ツールの一つで、これを使用すると、ブートストラップ用 CSS フレームワーク用に作成したテーマを、%%ProductName%% や jQuery UI ウィジェットで使用可能なテーマにエクスポートできるようになります。また、テーマの各プロパティをカスタマイズすることができ、終了結果のプレビューを表示することができます。

### 概要
このトピックでは、Bootstrap 用のテーマ ジェネレーターを使用してエクスポートしたブートストラップ用のテーマを、ユーザーの Web サイトに追加する方法をステップごとに示します。以下はプロセスの概念的概要です。

1. 選択したブートストラップ用のテーマの LESS ファイルのダウンロード。
2. Bootstrap 用テーマ ジェネレーターを介して、LESS ファイルを渡す。
3. CSS リンクを更新し、Infragistics テーマと選択したテーマとの置き換え。
4. 結果の確認

### プレビュー

次のスクリーンショットは、選択したテーマが *Metro* であることを前提とした、最終結果のプレビューを示します。

![](images/Theming_Guide_Changes_7.png)

### 手順
以下のステップでは、エクスポートしたブートストラップ用のテーマをユーザー アプリケーションに追加する方法を示します。

1. **選択したブートストラップ用テーマの LESS ファイルのダウンロード**
	1. [Bootswatch](http://bootswatch.com/) ウェブサイトへ移動し、Themes ボタンをクリックします。テーマを選択してクリックすると、そのページへ移動します。
	2. [Download] ボタンをクリックしてドロップダウンから 'variables.less' を選択します。このファイルは、Bootstrap テーマ ジェネレーターがテーマを作成する際に使用されます。
2. **[Bootstrap 用のテーマ ジェネレーター](%%SamplesUrl%%/bootstrap-theme-generator) を介して、LESS ファイルを渡す**
	1. [Bootstrap 用のテーマ ジェネレーター の Web サイト](%%SamplesUrl%%/bootstrap-theme-generator)に進みます。
	2. [LESS をアップロード] ボタンをクリックします。
	3. [アップロードして完了] ボタンをクリックし、ファイル セレクターから 'variables.less' を選択します。あるいは、[アップロードしてカスタマイズ] をクリックしてダウンロードする前にカスタマイズすることもできます。
	4. テーマを生成するとダウンロード ボタンが表示されます。テーマをダウンロードするオプションを選択します。
3. **CSS リンクを更新して、Infragistics テーマと選択したテーマとの置き換え**
	1. ダウンロード ファイルを解凍し、ウェブ サイトのテーマ ディレクトリを含むディレクトリにドラッグします。
		![](images/Theming_Guide_Changes_6.png)
	2. CSS 参照をエクスポートしたテーマに追加します。以下のコード サンプルは、Metro を選択し、テーマ フォルダーに同じ名前を使用しています。
	
	**HTML の場合:**
	```html
	<link href="/css/themes/metro/infragistics.theme.css" rel="stylesheet" type="text/css" />
	```
	**ASPX の場合:**
	```csharp
	<%@ Import Namespace="Infragistics.Web.Mvc" %>
	<!DOCTYPE html>
	<html>
	<head runat="server">
	<link href="<%= Url.Content("~css/themes/metro/infragistics.theme.css") %>” rel="stylesheet" type="text/css" />                                
	```
	3. 構造テーマへの CSS 参照を追加します。
	
	**HTML の場合:**
	```html
	<link href="/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
	```
	**ASPX の場合:**
	```csharp
	<link href="<%= Url.Content("~css/structure/infragistics.css") %>” rel="stylesheet" type="text/css" />
	```
4. **Web ページを実行し結果の検証**
	
	ページを実行して、`igGrid` が選択したテーマを使用して描画することを確認します。


##<a id="_Using_CDN"></a>CDN の使用

#### Infragistics コンテンツ配信ネットワーク (CDN)

リストされたすべてのテーマは、Infragistics CDN でホストされています。

CDN の使用には多くの利点があります。詳細は、専用ヘルプ トピック｢インフラジスティックス コンテンツ配信ネットワーク (CDN)」を参照してください。CDN からのファイル参照の詳細は、「[%%ProductName%% のインフラジスティックス コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html)」のトピックを参照してください。

**HTML の場合:**

```html
<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />

<link href="http://cdn-na.infragistics.com/igniteui/%%ProductVersion%%/latest/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
```



##<a id="_Related_Content"></a>関連コンテンツ


#### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


- [%%ProductName%% での JavaScript ファイル](Deployment-Guide-JavaScript-Files.html): このトピックは、%%ProductName%%™ に含まれるコントロールを使用して作業するために必要な JavaScript ファイルへの参照です。

- [%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで %%ProductName%% を操作して、必要なリソースを管理する方法について説明します。

- [%%ProductName%% 対応 Infragistics コンテンツ配信ネットワーク (CDN)](Deployment-Guide-Infragistics-Content-Delivery-Network%28CDN%29.html): %%ProductName%% 対応 Infragistics コンテンツ配信ネットワーク (CDN) の使用方法。

- [データのビジュアル化でのグラデーション カラーの使用](Using-Gradient-Colors-in-Data-Visualizations.html): このトピックは、%%ProductName%%™ コントロールのビジュアル データにグラデーション カラーを適用する方法を説明します。

- [新しいスタイルの適用 (*igDataChart*)](igdatachart-styling-themes.html): このトピックでは、チャートにスタイルおよびテーマを適用する方法を紹介します。

- [Bootstrap と %%ProductName%% の使用](Using-Ignite-UI-with-Bootstrap.html) : このトピックでは、%%ProductName%% と Bootstrap を一緒に動作させる方法について説明します。





 

 


