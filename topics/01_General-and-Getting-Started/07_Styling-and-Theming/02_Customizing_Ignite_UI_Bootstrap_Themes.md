<!--
|metadata|
{
    "fileName": "customizing-ignite-ui-bootstrap-themes",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# Ignite UI Bootstrap テーマのカスタマイズ

Bootstrap 対応のテーマを Ignite UI 用にカスタマイズする場合は、テーマを正しく変更するために必要な特定の手順があります。テーマをカスタマイズする方法によって異なります。カスタマイズには、Bootstrap のスタイルの Ignite UI のテーマへの追加し、LESS の変数の変更、jQuery UI コントロールのカスタマイズ、または Ignite UI のコントロールの特別なカスタマイズなどが考えられます。このトピックは、Ignite UI の Bootstrap 対応のテーマを構成する異なるファイル (およびそれらの用途) とテーマの変更に必要な手順について説明します。

##テーマの構造


Bootstrap 対応のテーマは、メインのテーマ ファイル (`infragistics.theme.less`) からコンパイルされ、テーマを構成する値とルールを提供する他の多数の LESS ファイルへの参照を含みます。

>**注:** このセクションで参照する LESS ファイルは、`css\themes\bootstrap\LESS` で確認できます。ファイルを使用する場合は、ファイルを LESS フォルダーから親の `css\themes\bootstrap` フォルダーにコピーする必要があります。

以下の表は、メインのテーマ ファイルが参照する LESS ファイルとその用途を示します。

ファイル名|目的
---|---
variables.less|包括的な Bootstrap 対応のテーマを作成する場合、`variables.less` ファイルは、Ignite UI コントロール関連のスタイル ルールのみでなく、Bootstrap テーマの作成に必要なすべてのスタイル ルールを含みます。<br>**注:**`variables.less` を使用している場合は、`variables-igniteui.less` は必要ありません。
variables-igniteui.less |Bootstrap 対応のテーマを作成する場合、`variables-igniteui.less` ファイルは、Bootstrap テーマのコンテキスト内の Ignite UI コントロールに排他的に関連するスタイル ルールを含みます。
framework.less|`framework.less` ファイルは、jQuery UI ネイティブ コントロールに必要な構造スタイル ルールを含みます。ここにはテーマに関連したスタイルがないため、ネイティブ コントロール構造の変更が必要ない限り、ファイルを変更することはありません。
infragistics.jqueryui.theme.less|`infragistics.jqueryui.theme.less` ファイルは、テーマで jQuery UI ウィジェットのスタイル変更に関連するすべてのスタイル ルールを含みます。
infragistics.igniteui.theme.less|`infragistics.igniteui.theme.less` ファイルは、テーマで Ignite UI コントロールのスタイル変更に関連するすべてのスタイル ルールを含みます。



##Bootstrap テーマのスタイルの Ignite UI のテーマへの追加


Bootstrap テーマを Ignite UI のテーマに統合する場合は、Bootstrap から取り込んだ変数を Ignite UI のテーマで使用する必要があります。以下の手順では、統合する方法を紹介します。

1.  選択した Bootstrap テーマから variables.less ファイルをコピーし、`\css\themes\bootstrap` 内の 1 つのファイルと置き換えます。
2.  次に、テーマの中で使用するスプライトの確認が必要になります、またはテーマのカラー パレットによって異なりますが、スプライト イメージで使用する色の調整が必要になる場合があります。スプライト イメージは、images フォルダーで確認できます。スプライトの確定後、テキスト エディタで `infragistics.theme.less` ファイルを開きます。テーマで使用可能な 3 つの基本的なスプライトのアイコンがあります。

    **CSS の場合:**
	```
	// Icon sprites
	@ui-icons-darker: url(images/ui-icons_222222_256x240.png);
	@ui-icons-dark: url(images/ui-icons_888888_256x240.png);
	@ui-icons-light: url(images/ui-icons_ffffff_256x240.png);
	```

3.  ここで、さまざまな状態 (default、hover、active、 focused) のテーマの色に応じて、使用されているスプライトのアイコンが最も適切であることを確認する必要があります。`infragistics.theme.less` ファイル内で関連するスタイル ルールを確認するには、次のようにアイコンと状態の領域でファイルを検索します。

    **CSS の場合:**
	```
    /* Icons
    ----------------------------------*/
    /* states and images */
	```
	
	各ルールが、テーマに対し適切なスプライトの位置で使用されていることを確認できます。また、例外と一部のコントロールに対して固有のオーバーライドがある点に注意してください。ほとんどの例外はエディタ コントロールに関するものです。したがって、各インスタンスに対し最適な選択が定義されていることを確認してください。

4.  新しい変数を使用し、テーマを保存して再コンパイルします。

##LESS の変数の変更によるテーマのカスタマイズ


以下の手順では、Ignite UI のテーマをカスタマイズするために変数を変更する箇所を示します。

1.  `\css\themes\bootstrap` から複製した `variables-igniteui.less` ファイルの名前を variables.less に変更して、同じ名前の既存のファイルと置き換えます。
2.  テキスト エディタで variables.less ファイルを開き、目的のデザインに応じて値を編集します。変数の名前は、すぐに識別が可能で、機能を表す名前を使用してください。たとえば、次のような変数セットがあります。

    **CSS の場合:**
	```
    //** Background color for `<body>`.
    @body-bg: #ffffff;
    //** Global text color on `<body>`.
    @text-color: #444444;
    //** Global textual link color.
    @link-color: #428bca;
    //** Link hover color set via `darken()` function.
    @link-hover-color: darken(@link-color, 15%);
	```

3.  各変数に対して必要な値を設定してファイルを保存します。
4.  `infragistics.theme.less` ファイルをテキスト エディタで開き、使用されているスプライトのアイコンを確認します (最初のメソッドの手順 2)。
5.  新しい変数を使用してテーマを再コンパイルします。

                    
