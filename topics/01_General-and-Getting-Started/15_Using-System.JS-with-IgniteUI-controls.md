<!--
|metadata|
{
    "fileName": "Using-System.JS-with-IgniteUI-controls",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# Ignite UI コントロールで System.JS を使用

## 概要

Ignite UI コントロールは規格のモジュール ローダーで読み込むことができます。各モジュールは AMD 定義を含み、依存関係モジュールを参照します。
[System.JS](https://github.com/systemjs/systemjs) は JSPM パッケージ マネージャーで使用される人気のあるモジュール ローダーです。このトピックは、Ignite UI コントロールを使用するために System.JS を構成する方法を説明します。

以下の例で、Windows のコマンド プロンプトが使用されます。同様のコマンドを MacOS のターミナルでも実行できます。[Visual Studio コード](https://code.visualstudio.com/) の使用が推薦されますが、必須ではありません。

## JSPM でアプリケーションの初期化

JSPM のインストール:
```
npm install -g jspm
```

新しいフォルダーを作成して、コマンド ラインでそのフォルダーに移動します。

```
mkdir igsample
cd igsample
```

JSPM を使用してアプリケーションを初期化します:
```
jspm init
```
質問に回答 (デフォルトの回答で問題ありません) した後に 、TypeScript をトランスパイラーとして使用することを推薦します。その後、JSPM および System.JS ローダーをアプリケーションで使用する準備ができました。

`jquery`、`jquery-ui`、および `css` ローダー パッケージをインストールします:
```
jspm install jquery
jspm install jquery-ui
jspm install css
```

## GitHub を使用した Ignite UI パッケージの追加

Ignite UI のコンポーネントのセットがオープンソースで、GitHub でソース コードが[ホスト](https://github.com/IgniteUI/ignite-ui)されます。アプリケーションがオープンソース Ignite UI コントロールのみを使用する場合、このパッケージをアプリケーションに追加するには、以下のコマンドを使用します:
```
jspm install github:igniteui/ignite-ui
```

## 非公開の NPM レジストリを使用して Ignite UI パッケージを追加

すべてのコントロールを含む Ignite UI の製品版も JSPM で使用できます。ただし、Infragistics web サイトからダウンロードした後に非公開の NPM レジストリで Ignite UI パッケージを公開する必要があります。

組織に非公開の NPM レジストリがある場合、Ignite UI パッケージがそこに公開された後、以下のコマンドを使用してアプリケーションに追加できます:
```
jspm install npm:igniteui/ignite-ui
```
> **注:** パッケージ名が異なる場合があります。ローカル NPM レジストリ管理者にご確認ください。

## コントロールを ES6 モジュールとして参照

Visual Studio Code (またはその他のテキスト エディター) を使用して `index.html`、`js/bootstrap.js`、および `js/igsample.js` ファイルを作成します。現在のフォルダーでエディターを開くには、
```
code .
```
を入力します。 

`index.html` のコンテンツ:
```html
<doctype html>
<head>
	<title>IG Sample</title>
</head>
<html>
	<span id="rating"></span>

	<script src="jspm_packages/system.js"></script>
	<script src="config.js"></script>
	<script>
		SystemJS.import('js/igsample.js');
	</script>
</html>
```

`js/bootstrap.js` のコンテンツ:
```JavaScript
import 'igniteui/ignite-ui/src/css/themes/infragistics/infragistics.theme.css!';
import 'igniteui/ignite-ui/src/css/structure/modules/infragistics.ui.rating.css!';
import 'igniteui/ignite-ui/src/js/modules/infragistics.ui.rating';

export function bootstrap(){
	// init code here
}
```
CSS モジュールの終了にある「!」は、モジュール ローダーが JS モジュールとして使用せずに、CSS ローダーがこのモジュールを処理できることを示します。

`js/igsample.js` のコンテンツ:
```JavaScript
import $ from 'jquery';
import {bootstrap} from './bootstrap';

// execute initialization procedure
bootstrap();

$(function(){
	$("#rating").igRating();
})
```


## JavaScript および CSS のバンドル

上記の例は、要求されたコントロールにすべての必要なモジュールを読み込むことを System.JS ローダーに命令します。依存関係ツリーが解析され、必要なファイルが依存関係の順序に読み込まれます。

JSPM は、すべての参照されたモジュールおよびその依存関係および CSS ファイルを 1 つの JS ファイルにバンドルできます。サーバーに複数のファイルを要求していないため、ブラウザーの読み込み時間が軽減します。

すべてのモジュールをバンドルするには、以下のコマンドを実行します:
```
jspm bundle js/igsample.js --inject
``` 

個々のファイルに戻るには、以下のコマンドを実行します:
```
jspm unbundle
```

## まとめ

上記の例を web サーバーでホストできます。または、http-server を使用して実行できます:
```
npm install -g http-server
http-server
```
ブラウザーを開いて、`http://localhost:8080` に移動すると、実行中のアプリケーションが表示されます。

このトピックでは、Ignite UI コントロールを JSPM および System.JS ローダーと使用する方法を紹介しました。
