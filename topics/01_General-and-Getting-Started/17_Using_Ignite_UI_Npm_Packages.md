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

```bash
npm install ignite-ui
```

このコマンドを実行した後、プロジェクトの node_modules ディレクトリに Ignite UI パッケージがインストールされます。  

## Infragistics プライベート フィードから Ignite UI npm パッケージをインストール

Ignite UI の最新向上を使用するには、npm を構成する必要があります。 

最初にプライベート レジストリを設定します。Infragistics アカウントにログインするユーザー名およびパスワードを入力する必要があります。Infragistics プロファイルに登録されるメールも入力してください。この手順では次のことに注意してください。npm はユーザー名で「@」の使用を許可しません。ユーザー名が Infragistics アカウントのメール アドレスであるため、「@」記号を含みます。この制限を回避するには、「@」記号の代わりに「!!」(2 つの感嘆符) を使用します。 たとえば、ユーザー名が username@infragistics.com の場合、username!!infragistics.com と入力します。

```bash
npm adduser --registry=https://packages.infragistics.com/npm/js-licensed --always-auth
```

その後、レジストリを設定します。以下のコマンドを実行します。

```bash
npm config set registry https://packages.infragistics.com/npm/js-licensed
```

上記コマンドの代わりに、ローカル [.npmrc](https://docs.npmjs.com/files/npmrc) ファイルを作成し、そのファイルでレジストリを設定できます。 この方法でレジストリはグローバルに設定されません。このプロジェクトのみに設定されます。

完了した後、ログイン済みで、プロジェクトで Ignite UI の最新バージョンをインストールできます。

```bash
npm install ignite-ui-full
```

npm にレジストリの制限があるため、プライベート レジストリを使用し、ローカル .npmrc ファイルを作成しなかった場合、npmjs.com からパッケージをインストールするには、レジストリを変更する必要があります。T単一のコマンドで、追加の構成は必要ありません。
以下のコマンドを実行します。

```bash
npm config set registry https://registry.npmjs.org/
```

同じコマンドでプライベート フィードに戻ります。.npmrc ファイルをローカルに作成した場合、レジストリを変更する必要はありません。

npm を既に使用していて、Ignite UI ライセンスがある場合、Infragistics プライベート フィードを構成してください。 

Ignite UI のライセンスがない場合、Infragistics が Ignite UI OSS パッケージで提供するコントロールを使用できます。igEditors、igCombo、igTree などのコントロールが OSS パッケージに含まれます。npmjs.com から Ignite UI npm パッケージをインストールしてください。 
