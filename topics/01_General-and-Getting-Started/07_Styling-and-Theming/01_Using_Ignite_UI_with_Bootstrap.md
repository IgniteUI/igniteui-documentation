<!--
|metadata|
{
    "fileName": "using-ignite-ui-with-botstrap",
    "controlName": [],
    "tags": ["Styling"]
}
|metadata|
-->
#Bootstrap と Ignite UI の使用

##概要


このトピックでは、Ignite UI と Bootstrap が連携する方法、Web アプリケーションを対象とした Ignite UI の Bootstrap 対応のテーマを取得する方法、およびテーマをカスタマイズする方法について説明します。

##Ignite UI と Bootstrap が連携する方法


Bootstrap を Ignite UI アプリケーションに追加すると、Bootstrap の機能が使用できるようになります。ただし、Ignite UI コントロールでは、Bootstrap スタイルで設定されたルック アンド フィールは自動的に反映されません。これは、jQuery UI のウィジェットと Ignite UI コントロールでは、具体的なスタイル設定方法が異なるためです。これらのインスタンスでは、Bootstrap をページに追加される場合に必要な所定のスタイルをコントロールに反映させる Bootstrap のクラス名が、コントロールにありません。そのため、Ignite UI コントロールで Bootstrap のスタイル設定とテーマ化を使用するために、Infragistics では、jQuery UI ウィジェットと Ignite UI コントロールが Bootstrap に対応するようにスタイルを設定する、さなざまな Bootstrap 対応のテーマが使用できるようにしました。静的なテーマ以外にも、[Ignite UI Bootstrap Theme Generator](%%NewSamplesUrl%%/bootstrap-theme-generator) を使用して、Bootstrap 対応のテーマをアップロードしカスタマイズすることもできます。

##Ignite UI Bootstrap テーマ ジェネレーター


[Bootstrap Theme Generator](%%NewSamplesUrl%%/bootstrap-theme-generator) は、既存のテーマのダウンロードまたはカスタマイズ、またはユーザー独自の LESS ファイルのアップロードにより、ユーザー独自の Ignite UI の Bootstrap 対応のテーマを作成できるようにします。

### LESS 変数の操作

すべてのテーマは、`variables.less` ファイルの値に基づきます。このファイルは、Bootstrap またはカスタマイズされたテーマのソース コードから取得できます。Bootstrap Theme Generator を使用する場合は、事前にカスタマイズされたテーマを操作する、またはユーザー独自の LESS 変数をアップロードすることができます。

### 付属テーマのカスタマイズ

Ignite UI Bootstrap Theme Generator では、Bootstrap の他のいくつかのテーマに加え [Bootstrap の既定のテーマ](%%NewSamplesUrl%%/bootstrap-theme-generator/default)がカスタマイズされています。これらのテーマのいずれかをユーザー自身のテーマとして選択する場合に備え、作業のほとんどは、Theme Generator がユーザーに代わって処理します。事前定義された状態のテーマをダウンロードする、または、Bootstrap Theme Generator のサイトで直接テーマをカスタマイズしてください。テーマが要求を満たしていると、結果の CSS またはテーマの LESS ファイル、あるいはその両方をダウンロードできます。

### カスタム LESS 値のアップロード

追加設定なしで使用できる多数のテーマがありますが、独自のテーマを新規に作成することもできます。Bootstrap Theme Generator のサイトにないソースからテーマを生成する場合は、独自の変数値をアップロードするだけです。

テーマ変数は、通常、`variables.less` というファイルにあります。`variables.less` は、[Bootstrap のソース](https://github.com/twbs/bootstrap)から直接入手する、または他の Bootstrap テーマからファイルのテーマ バージョンを取得してください。Bootstrap テーマの入手元として、[Bootswatch](http://bootswatch.com/)、 [WrapBootstrap](https://wrapbootstrap.com/)、および[その他](https://www.google.com/search?q=bootstrap%20themes)があります。

`variables.less` で値をカスタマイズ後、[このファイルを Bootstrap Theme Generator にアップロード](%%NewSamplesUrl%%/bootstrap-theme-generator/Theme/Upload)します。このファイルにより、Ignite UI コントロールをサポートする Bootstrap に完全に対応するテーマを入手できます。

>**注: **アップロードするファイル名は、`variables.less` に限定されませんが、Bootstrap の `variables.less` ファイルにあるすべての変数の値が必ず含まれている必要があります。

##関連コンテンツ


-   [Ignite UI Bootstrap テーマのカスタマイズ ](Customizing-Ignite-UI-Bootstrap-Themes.html)

                    
