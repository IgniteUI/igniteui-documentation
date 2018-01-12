<!--
|metadata|
{
    "fileName": "Using-Ignite-UI-CLI",
    "controlName": [],
    "tags": ["CLI"]
}
|metadata|
-->
# %%ProductName%% CLI の使用

## 概要
Ignite UI CLI は、さまざまなフレームワークでアプリケーションの初期化、開発、スキャフォールディング、および処理を可能にするツールです。Ignite UI for JavaScript コントロールの定義済みテンプレートを提供します。Ignite UI CLI を使用すると、Ignite UI および対象のフレームワークでのプロジェクトをすばやく作成して使用できます。<br/>
**同じコマンドを使用して [jQuery](https://jquery.com)、[Angular](https://angular.io)、および [React](https://reactjs.org) でプロジェクトを作成して Ignite UI for JavaScript コントロールを追加することもできます。**

## はじめに
Ignite UI CLI のインストール:
```
npm install -g igniteui-cli
```

利用可能なオプションでガイドに沿って手順を実行する場合は、以下のコマンドを実行します。
```
ig
```

Ignite UI プロジェクトの生成、新しいコンポーネントの追加、プロジェクトのビルドおよび公開すためにカスタム コマンドを実行する場合は、以下のコマンドを使用します。
```
ig new <project name> --framework=<framework>
ig add <component/template> <component_name>
ig start
```
http://localhost:3000/ へ移動します。ソース ファイルを変更するとアプリケーションは自動的に更新します。

## 利用可能なコマンド

### new
新しい Ignite UI アプリケーションを作成するには、以下のコマンドを実行します。

```
   ig new [name] [framework]
```

| 引数   | エイリアス | デフォルト値 | 説明                                                                                   |
| ---------  | ----- |---------------| --------------------------------------------------------------------------------------------- |
| name       | -n    | app           | アプリケーションの名前。アプリケーションが同じ名前のディレクトリに作成されます。|
| --framework| -f    | jquery        | プロジェクトの対象フレームワーク。サポートされるフレームワークは jQuery、Angular、および React です。       |

`new` コマンドの使用で、新しい jQuery、Angular、または React アプリケーションを作成できます。
新しいアプリケーションが同じ名前のディレクトリに作成されます。
既存のアプリケーションで新しいアプリケーションの作成はサポートされません。

以下は、すべてのサポートされるフレームワークで Ignite UI for JavaScript アプリケーションを作成するために `new` コマンドを使用する例です。<br/>
**jQuery の場合:** `ig new newIgniteUIjQuery` (jQuery はデフォルト選択のため、"framework" 引数を設定する必要がありません)<br/>
**React の場合:** `ig new newIgniteUIReact --framework=react`<br/>
**Angular の場合:** `ig new newIgniteUIAngular --framework=angular --type=ig-ts`

### add
新しい Ignite UI for JavaScript コントロールを既存するアプリケーションに追加するには、以下のコマンドを実行します。

```
    ig add [template] [name]
```

`add` コマンドは Ignite UI CLI で作成した既存のプロジェクトのみにサポートされます。`new` コマンドまたは `ig` コマンドの手順を使用して新しいプロジェクトを作成する前に `add` コマンドを使用できません。 
クイックスタート プロジェクトが `add` コマンドをサポートしません。つまり、指定したクリックスタート プロジェクトの定義済みコンポーネントよりその他のコンポーネントを追加できません。

#### Ignite UI for JavaScript テンプレート
[Ignite UI CLI Wiki](https://github.com/IgniteUI/igniteui-cli/wiki/Add#ignite-ui-for-javascript-templates) で、サポートされるフレームワークで利用可能な Ignite UI for JavaScript テンプレートを表示するテーブルを参照できます。


### build
アプリケーションを出力ディレクトリにビルドするには、以下のコマンドを実行します。

```
    ig build
```

`build` コマンドはプロジェクトが依存する npm パッケージをインストールします。デフォルトで [Ignite UI の OSS バージョン](https://github.com/IgniteUI/ignite-ui)をインストールしますが、グリッドなどのオープン ソースではないコンポーネントが追加されたかどうかを確認して、フル バージョンが必要な場合、Infragistics アカウントの資格情報を入力した後に OSS パッケージをフル バージョンに更新します。フル パッケージをインストールする方法については[このトピック](using-ignite-ui-npm-packages.html)を参照してください。<br/>
CSS リソースなどのビルド アーティファクトは `output/` ディレクトリに保存されます。

### start
アプリケーションをビルドして Web サーバーを開始するには、以下のコマンドを実行します。

```
    ig start
```
jQuery アプリケーションはポート 3000 を使用し、Angular アプリケーションはポート 3001 を使用し、React アプリケーションはポート 3002 を使用します。

### quickstart
定義済み Ignite UI コントロールを含むクリックスタート アプリケーションを作成するには、以下のコマンドを実行します。

```
    ig quickstart [framework]
```

| 引数   | エイリアス | デフォルト値 | 説明                                    |
| ---------  | ----- |---------------| ---------------------------------------------- |
| --framework| -f    | jQuery        |サポートされるフレームワークは jQuery および Angular です。<br/><p>例: <code>ig quickstart --framework=angular</code></p>|

`quickstart` コマンドを実行すると、すべての必須パッケージをインストールし、Web サーバーを開始します。
生成されたクリックスタート アプリケーションは `output/` ディレクトリに保存されます。

### help
すべての利用可能な Ignite UI CLI コマンドを表示するには、以下のコマンドを実行します。

```
    ng help
```
