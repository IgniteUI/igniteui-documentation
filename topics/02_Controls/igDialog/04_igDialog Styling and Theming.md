<!--
|metadata|
{
    "fileName": "igdialog-styling-and-theming",
    "controlName": "igDialog",
    "tags": ["How Do I","Styling"]
}
|metadata|
-->

# スタイル設定とテーマ設定 (igDialog)

## トピックの概要

### 目的

このトピックは、さまざまなアプローチによる `igDialog`™ のスタイル設定を紹介します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

- [***igDialog* の概要**](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。

- [***igDialog*** の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**スタイル構成の概要**](#configuration-summary)
-   [**jQuery Theme Switcher を使用した igDialog のスタイル設定**](#jquery-theme-switcher)
    -   [コード](#theme-switcher-code)
    -   [例](#theme-switcher-example)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="configuration-summary"></a> スタイル構成の概要

以下の表は、スタイル変更が可能な `igDialog` コントロールの構成可能な要素を示しています。このメソッドについては、表の下にある解説も参照してください。

構成可能な要素|詳細|関連トピックまたはセクション
---- | ---- | -----
コントロール プロパティによる `igDialog` のスタイル設定|`igDialog` がその外観を変更するよう構成する必要があるプロパティ。|[***igDialog***  **のヘッダーとフッター**](igDialog-Header-and-Footer.html)
CSS クラスによる `igDialog` のスタイルとテーマの設定|基本的な `igDialog` クラスをオーバーライドし、ダイアログに合わせて独自のテーマを作成します。|[**CSS クラス参照 (*igDialog*)**](igDialog-Css-Classes-Reference.html)
jQuery Theme Switcher を使用した `igDialog` のスタイル設定|`igDialog` コントロールを簡単にカスタマイズするには、jQuery Theme Switcher を使用します。|[**jQuery Theme Switcher を使用したスタイル設定**](Deployment-Guide-Styling-and-Theming.html)


## <a id="jquery-theme-switcher"></a> jQuery Theme Switcher を使用した igDialog のスタイル設定

jQuery Theme Switcher を使用すると、`igDialog` コントロールのスタイルを簡単に設定できます。これは、`igDialog` CSS クラスの命名が jQuery UI CSS Framework の命名規則に従っているためです。

### <a id="theme-switcher-code"></a> コード

以下のコードは、jQuery Theme Switcher を初期化する方法を示します。`igDialog` に追加構成する必要はありません。Theme Switcher により自動的に CSS ルールが置き換えられます。

```
$("#themeSwitcher").themeswitcher();

<div id="themeSwitcher"></div>
```


### <a id="theme-switcher-example"></a> 例

以下のスクリーンショットは、*Blitzer* テーマでスタイル設定された `igDialog` を示します。

![](images/06_igDialog_Styling_And_Theming_1.png)


## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*igDialog* の概要](igDialog-Overview.html): このトピックでは、`igDialog` コントロールの主な機能を紹介します。
- [*igDialog* の追加](Adding-igDialog.html): このトピックでは、`igDialog` コントロールを Web ページに追加する方法について説明します。
- [*igDialog* のヘッダーとフッター](igDialog-Header-and-Footer.html): このトピックでは、`igDialog`  のフッターとヘッダーを有効にする方法、およびそれらをカスタマイズする方法を示しています。
- [CSS クラス参照 (*igDialog*)](igDialog-Css-Classes-Reference.html): このトピックでは、`igDialog`™ コントロールの CSS クラスを紹介します。


### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [アイコン](%%SamplesUrl%%/dialog-window/icons): このサンプルでは、`igDialog` のアイコンを表示する方法を紹介します。





 

 


