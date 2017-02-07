<!--
|metadata|
{
    "fileName": "Using-Ignite-UI-Npm-Packages",
    "controlName": [],
    "tags": ["npm"]
}
|metadata|
-->
# Ignite UI npm パッケージの使用

npm は Node.js ランタイム環境で使用する一般的なデフォルト パッケージ マネージャーです。プロジェクトに依存するパッケージをすばやく簡単に処理できます。npm の使用方法の詳細については、[npm ヘルプ](https://docs.npmjs.com)を参照してください。

Infragistics Ignite UI は npm パッケージで提供されるため、プロジェクトの依存関係として追加できます。Ignite UI npm パッケージを使用する 2 通りの方法があります。[https://packages.infragistics.com/npm/js-licensed](https://packages.infragistics.com/npm/js-licensed) にホストされるプライベート (非公開) npm フィードを使用することを推薦します。最新の機能および機能向上を含む Ignite UI パッケージの最新バージョンはフィードに提供されます。有効な Ignite UI ライセンスがある場合、Ignite UI の製品版をプライベート フィードによりアクセスできます。 

または、[https://www.npmjs.com](https://www.npmjs.com/package/ignite-ui) のオフィシャル npm フィードを使用できます。この方法により npm を構成する必要はありませんが、パッケージの Ignite UI OSS バージョンが提供されます。[パッケージのページ](https://www.npmjs.com/package/ignite-ui)で OSS バージョンに含まれる Ignite UI コントロールを確認できます。

## npmjs.com から Ignite UI npm パッケージをインストール

Ignite UI の最新版を使用する場合、プロジェクトに依存するその他のパッケージと同じ方法でインストールできます。以下のコマンドをコマンド ラインに入力します:

```js
npm install ignite-ui
```

このコマンドを実行した後、プロジェクトの node_modules ディレクトリに Ignite UI パッケージがインストールされます。  

## Infragistics プライベート フィードから Ignite UI npm パッケージをインストール

Ignite UI の最新向上を使用するには、npm を構成する必要があります。 

First you need to setup the private registry and to associate this registry with the Infragistics scope. This will allow you to seamlessly use a mix of packages from the public npm registry and the Infragistics private registry. You will be asked to provide the username and the password that you use for logging into your Infragistics account. You should also provide the email that is registered to your Infragistics profile. There is an important note that you must have in mind during this step! npm is disallowing the use of the "@" symbol inside your username as it is considered as being "not safe for the net". Because your username is actually the email that you use for your Infragistics account it always contains the symbol "@". That's why you must escape this limitation by replacing the "@" symbol by "!!" (two exclamation marks). For example, if your username is "username@infragistics.com" when asked about your username you should provide the following input: "username!!infragistics.com".

```js
npm adduser --registry=https://packages.infragistics.com/npm/js-licensed --scope=@infragistics --always-auth
```

その後、レジストリを設定します。以下のコマンドを実行します。

```js
npm config set @infragistics:registry https://packages.infragistics.com/npm/js-licensed
```

上記コマンドの代わりに、ローカル [.npmrc](https://docs.npmjs.com/files/npmrc) ファイルを作成し、そのファイルでレジストリを設定できます。 この方法でレジストリはグローバルに設定されません。このプロジェクトのみに設定されます。

完了した後、ログイン済みで、プロジェクトで Ignite UI の最新バージョンをインストールできます。

```js
npm install @infragistics\ignite-ui-full
```

Have in mind that we have set the Ignite UI package to be scoped, meaning that no changing the registries is needed if you want to install packages from our private feed and from npmjs.org simultaneously.

npm を既に使用していて、Ignite UI ライセンスがある場合、Infragistics プライベート フィードを構成してください。 

Ignite UI のライセンスがない場合、Infragistics が Ignite UI OSS パッケージで提供するコントロールを使用できます。igEditors、igCombo、igTree などのコントロールが OSS パッケージに含まれます。npmjs.com から Ignite UI npm パッケージをインストールしてください。 
