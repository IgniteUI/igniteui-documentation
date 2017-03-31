<!--
|metadata|
{
    "fileName": "igpercenteditor-styling-and-theming",
    "controlName": "igEditors",
    "tags": ["Editing","Styling","Theming"]
}
|metadata|
-->

# igPercentEditor のスタイルおよびテーマ設定


`igPercentEditor` コントロールは、`igNumericEditor` を拡張する jQuery ベースのコントロールで、多くのスタイル設定オプションを公開します。パーセント エディターのスタイルをカスタマイズするには、さまざまなテーマを使用する、またはカスタム CSS ルールをコントロールに直接適用します。 

%%ProductName%% パッケージには、いくつかの jQuery UI や Bootstrap テーマが用意されています。また Bootstrap は、独自のブートストラップのテーマの生成やカスタマイズをサポートしています。詳細は、[スタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)を参照してください。エディターを含めたページ上のすべてのコントロールのスタイルは、どのテーマでも設定できます。

## ThemeRoller の使用

`igPercentEditor` コントロールは jQuery UI CSS フレームワークを使用するため、[jQuery UI ThemeRoller](http://jqueryui.com/themeroller/) を使用してすべてのスタイルを設定することもできます。これにより、独自に作成したテーマのカスタマイズや使用可能なギャラリーからのテーマの選択ができます。これらのテーマは、%%ProductName%% のデフォルトのテーマと置き換えられます。

UI Darkness テーマを使用するパーセント エディター:

![](images/igPercentEditor_ThemeRoller.png)

## カスタム スタイル

ご使用の CSS には、パーセント エディターの多くの要素にスタイル オーバーライドが含まれている場合があります。使用可能なすべてのクラスについては、[API リファレンスのテーマ設定クラス](%%jQueryApiUrl%%/ui.igNumericEditor#theming)を参照してください。スタイルを適用するには、すべてのエディターに摘要されたグローバル クラスをオーバーライドする、またはID や他の特定の trait で特定の要素をターゲットとして指定し、コントロールごとにカスタマイズできるようにします。

`igPercentEditor` はデフォルトで、負の値を赤色で表示します。以下の例では、この色を変更する方法を示します。

```html
<style>
.ui-igedit-negative
{
	color: #00aeef;
}
</style>
```

![](images/igPercentEditor_custom_style.png)

## 関連トピック  

-   [igNumericEditor の概要](igNumericEditor-Overview.html)

 

 


