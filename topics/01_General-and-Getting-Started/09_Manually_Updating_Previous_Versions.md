<!--
|metadata|
{
    "fileName": "manually-updating-previous-versions",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# プロジェクトを %%ProductName%% の最新バージョンにアップグレード



##トピックの概要


### 目的

このトピックでは、 %%ProductName%%™ を使用するプロジェクトを、現在のバージョンの %%ProductName%% ライブラリにアップグレードする方法の詳細を説明します。

### 前提条件

以下のリストは、このトピックを理解するための前提条件として必要なトピックを示しています。


- [%%ProductName%% で JavaScript リソースを使用](Deployment-Guide-JavaScript-Resources.html): このトピックでは、Web アプリケーションで %%ProductName%% JavaScript を操作して、必要なリソースを管理する方法について説明します。

- [%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html): このトピックでは、デザイン段階でのアプリケーションのセットアップ手順について説明し、実稼働環境で CSS を使用するためのオプションを紹介すると同時に、テーマの作成またはカスタマイズについての概要を示します。

- [%%ProductName%% での JavaScript ファイル](Deployment-Guide-JavaScript-Files.html): このトピックは、%%ProductName%% に含まれるコントロールを使用して作業するために必要な JavaScript ファイルへの参照です。


##概要

各新しい %%ProductName%% ボリューム リリースに新機能およびバグ修正を含みます。最新の変更を導入する場合は、すべての JavaScript およびテーマ ファイルをアップグレードすることによって、プロジェクトをアップグレードする必要があります。%%ProductName%% には自動化されたアップグレード ユーティリティはないため、これらのファイルを手動で置き換える必要があります。これを行うには、まず新しいファイルおよび新しいフォルダー構造をよく理解する必要があります。これは、新しいリリースでは通常、ファイル構造が大きく変更されているためです。

### アップグレードする必要があるもの

アップグレードする必要があるものは、以下の表に説明するように、アプリケーションが使用するものによって異なります。

<table class="table table-striped">
<thead>
	<tr>
		<th>
			アプリケーションが使用するもの
		</th>
		<th>
			更新するもの
		</th>
	</tr>
</thead>
<tbody>
	<tr>
		<td>
			JavaScript ファイルおよび jQuery UI テーマ
		</td>
		<td>
			スクリプトおよびテーマ ファイル
		</td>
	</tr>
	<tr>
		<td>
			JavaScript ファイルおよび jQuery UI テーマ + ASP.NET MVC
		</td>
		<td>
			スクリプトおよびテーマ ファイル + アセンブリ参照ファイル
		</td>
	</tr>
</tbody>
</table>


## プロジェクトの手動的なアップグレード


### 概要

%%ProductName%% を使用するプロジェクトの更新手順には、JavaScript ファイルおよび jQuery UI テーマの更新が含まれます。ASP.NET MVC を使用する場合は、アセンブリへの参照も更新します。

### <a id="prerequisites"></a> 前提条件

この手順を実行するには、以下のリソースが必要です。

-   最新バージョンの JavaScript ファイル。

デフォルトでインストーラーが新しい JavaScript ファイルを置く場所:
 

 ```
 %%InstallPath%%\js
 ```

ここで *ProductVersionShort* はリリース年およびリリース番号、たとえば *2013.2* です。

このバージョンがインストールされていない場合、%%ProductName%% インストールの .zip ファイルを[ここ](https://jp.infragistics.com/my-account/keys-and-downloads)からダウンロードする必要があります。

-   最新バージョンの jQuery UI テーマ。

デフォルトで、インストーラーは新しいテーマを `%%InstallPath%%\css\themes にインストールします。`このバージョンがインストールされていない場合、%%ProductName%% インストールの .zip ファイルを[ここ](http://jqueryui.com/download)からダウンロードする必要があります。

-   %%ProductName%% アセンブリの最新バージョン。

デフォルトで、インストーラーは新しいアセンブリを `%%InstallPath%%\MVC` にインストールします。このバージョンがインストールされていない場合、%%ProductName%% インストールの .zip ファイルを[ここ](https://jp.infragistics.com/my-account/keys-and-downloads)からダウンロードする必要があります。

### 概要

以下はプロセスの概念的概要です。

1. 現在のスクリプトおよびテーマのバックアップ
2. 最新バージョンのスクリプトおよびテーマへの切り替え
3. (条件付き) アセンブリのアップグレード
4. 結果の検証

### 手順

プロジェクトをアップグレードするには、以下のステップに従います。

**1. 現在のスクリプトおよびテーマをバックアップします。**

現在のリソースをバックアップするには、バックアップ フォルダーを作成し、古い JavaScript ファイルおよび jQuery UI テーマ ファイルをそのフォルダーに移動します。そのためには次の手順を実行します。

 1.  プロジェクトまたはハード ドライブで、 古い JavaScript ファイルおよび jQuery UI テーマを移動する新しいフォルダーを作成します。
 
 2.  JavaScript ファイルをバックアップします。“ig.” で始まるすべての Infragistics スクリプト ファイルを新しいフォルダーにコピーします。プロジェクトが結合 JavaScript ファイルを使用する場合、このファイルのみを移動する必要があります。プロジェクトが個々の JavaScript ファイルを使用する場合、すべてのファイルを移動する必要があります。
 
 3. jQuery UI テーマをバックアップします。ベースおよび ig テーマを新しいフォルダーにコピーします。ig テーマの代わりにカスタムの ThemeRoller テーマを使用する場合、または縮小されたテーマを使用する場合、これらのデーまのファイルもバックアップ フォルダーにコピーします。

**2. 最新バージョンのスクリプトおよびテーマへ切り替えます。**

最新バージョンのリソースへ切り替えるには、既存のインフラジスティックス JavaScript および jQuery UI テーマ ファイルおよびフォルダー構造と共に削除し、新しいファイルを所定の場所にコピーします。そのためには次の手順を実行します。

1. 既存のインフラジスティックス JavaScript ファイルおよびそのフォルダーを削除します。
 
 (これらはすべて ig で始まるスクリプト ファイルです。)
2. 既存の jQuery UI テーマ ファイルおよびそのフォルダーを削除します。新しいバージョンの JavaScript ファイルを、 そのフォルダー構造と共にプロジェクトの JavaScript フォルダーにコピーします。

 - 最新バージョンの JavaScript ファイルがインストールされている場合、%%ProductName%% インストール フォルダーからそれらをコピーします。([前提条件](#prerequisites)のセクションのデフォルト パスを参照してください。)
 - 最新バージョンの JavaScript ファイルがインストールされていない場合、インストールの .zip アーカイブからファイルを解凍します。JavaScript ファイルは、アーカイブの js フォルダーにあります。(ダウンロード方法については、[前提条件](#prerequisites)のセクションを参照してください。)

 > **注:** JavaScript ファイルおよびフォルダー構造には最新の変更があります。変更に関する詳細については、[%%ProductName%% で JavaScript リソースを使用する](Deployment-Guide-JavaScript-Resources.html)を参照してください。 

3. 新しいバージョンの Query UI テーマ ファイルを、 そのフォルダー構造と共に、プロジェクトの themes フォルダーにコピーします。

 - 最新バージョンのテーマ ファイルがインストールされている場合、%%ProductName%% インストール フォルダーからそれらをコピーします。([前提条件](#prerequisites)のセクションのデフォルト パスを参照してください。)
 - 最新バージョンのテーマ ファイルがインストールされていない場合、インストールの .zip アーカイブからファイルを解凍します。テーマ ファイルは、アーカイブの themes フォルダーにあります。(ダウンロード方法については、[前提条件](#prerequisites)のセクションを参照してください。)
 - テーマの古いバージョンをカスタマイズしていた場合、それらのカスタマイズは、新バージョンのテーマで手動で作り直す (コピーする) 必要があります。
 - ThemeRoller テーマがある場合、css/theme フォルダー内のバックアップ フォルダーからテーマをコピーします。

 > **注**: バックアップ ディレクトリを参照し、バックアップした各 jQuery UI テーマに、対応する新しいテーマをコピーしたことを確認してください。

 >**注:** CSS ファイルおよびフォルダー構造には最新の変更があります。変更に関する詳細については、「[%%ProductName%% のスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)」を参照してください。 

**3. (条件付き) アセンブリのアップグレード**

アプリケーションで ASP.NET MVC ヘルパーまたは Document アセンブリを使用している場合、新バージョンのアセンブリをアプリケーションに追加する必要があります。以下は、追加する必要のあるアセンブリのリストです。

-   `Infragistics.Web.Mvc.dll`
-   `Infragistics.WebUI.Documents.Core.dll` **または** `Infragistics.Web.Documents.Core.dll`
-   `Infragistics.WebUI.Documents.IO.dll` **または** `Infragistics.Web.Documents.IO.dll`
-   `Infragistics.WebUI.Documents.Reports.dll` **または** `Infragistics.Web.Documents.Reports.dll`
-   `Infragistics.WebUI.Documents.Excel.dll` **または** `Infragistics.Web.Documents.Excel.dll`
-   `Infragistics.WebUI.Documents.Word.dll` **または** `Infragistics.Web.Documents.Word.dll`

>**注:** ドキュメント アセンブリの新バージョンは、Infragistics.Web.Documents の命名規則を使用します。

以下のようにアセンブリをアップグレードします。

1. %%ProductName%% アセンブリへの既存の参照を削除します。

Visual Studio では、Infragistics アセンブリに対する既存の参照をプロジェクトから削除します。

2. Infragistics アセンブリの新バージョンを自分のプロジェクトに追加し、参照します。

-   最新バージョンのアセンブリ ファイルがインストールされている場合、%%ProductName%% インストール フォルダーからそれらをコピーします。([前提条件](#prerequisites)のセクションのデフォルト パスを参照してください。)
-   最新バージョンのアセンブリ ファイルがインストールされていない場合、インストールの .zip アーカイブからファイルを解凍します。アセンブリ ファイルは、アーカイブの MVC ディレクトリにあります。(ダウンロード方法については、[前提条件](#prerequisites)のセクションを参照してください。)

>**注:** アセンブリをプロジェクトに追加する方法は、配備のタイプによって変わります。多くの場合、古いアセンブリを bin フォルダーから削除し、新しいアセンブリを bin フォルダーに追加することで十分ですが、異なる配備方法をお使いの場合には手順が異なる場合があります (たとえば、アセンブリが Global Assembly Cache (GAC) にある場合など)。

**4. 結果を確認します。**

結果を検証するには、アプリケーションを実行して問題を検証します。





## 関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [新機能](jQuery-Whats-New-Landing-Page.html): このグループのトピックでは、さまざまなバージョンの %%ProductName%% ライブラリのコントロールで導入されている新しいコントロールおよび機能に関する情報を提供します。





 

 


