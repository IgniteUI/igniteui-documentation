<!--
|metadata|
{
    "fileName": "igdateeditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Editing","Styling","Theming"]
}
|metadata|
-->

# igDateEditor のスタイル設定とテーマ設定

`igDateEditor` コントロールは、`igEditor` を拡張する jQuery ベースのウィジェットで、多くのスタイル設定オプションを公開します。日付エディターのスタイルをカスタマイズするには、テーマ オプションを使用して、カスタム CSS ルールのセットをコントロールに適用する必要があります。

%%ProductName%% パッケージには、いくつかの jQuery UI や Bootstrap テーマが用意されています。また Bootstrap は、独自のブートストラップのテーマの生成やカスタマイズをサポートしています。詳細は、[スタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)を参照してください。エディターを含めたページ上のすべてのコントロールのスタイルは、どのテーマでも設定できます。

## ThemeRoller の使用

`igDateEditor` コントロールは jQuery UI CSS フレームワークを使用するため、[jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用してすべてのスタイルを設定することもできます。これにより、独自に作成したテーマのカスタマイズや使用可能なギャラリーからのテーマの選択ができます。これらのテーマは、%%ProductName%% のデフォルトのテーマと置き換えられます。

UI Darkness テーマを使用する日付エディター:

![](images/igDateEditor_UI_Darkness.png)

## カスタム スタイル

ご使用の CSS には、日付エディターの多くの要素にスタイル オーバーライドが含まれている場合があります。使用可能なすべてのクラスについては、[API リファレンスのテーマ設定クラス](%%jQueryApiUrl%%/ui.igDateEditor#theming)を参照してください。スタイルを適用するには、すべてのエディターに摘要されたグローバル クラスをオーバーライドする、または ID や他のセレクターで特定の要素をターゲットとして指定し、コントロールごとにカスタマイズできるようにします。

```css
.ui-igedit-input{
	color: #00aeef;
}
```

![](images/igDateEditor_custom_style.png)

## 関連トピック

-   [igDateEditor の概要](igDateEditor-Overview.html)
-   [igDateEditor の既知の問題](igDateEditor-Known-Issues.html)

 

 


