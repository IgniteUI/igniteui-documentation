<!--
|metadata|
{
    "fileName": "collapsibleset-overview",
    "controlName": "CollapsibleSet",
    "tags": ["Layouts","MVC"]
}
|metadata|
-->

# CollapsibleSet の概要



## トピックの概要
#### 目的

このトピックでは、`CollapsibleSet` MVC ラッパーとその機能の概要を説明します。

#### このトピックの内容

*このトピックは、以下のセクションで構成されます。*

-   [**概要**](#introduction)
-   [**CollapsibleSet の機能**](#features)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="introduction"></a> 概要

`CollapsibleSet` MVC ラッパーでは、 内部の `Collapsible` コントロールからなる、折り畳み可能なコンテンツ ブロックを作成します。このラッパーは Collapsible コントロールをグループ分けします。同時に展開できる Collapsible コントロール グループは 1 つだけです。折り畳み可能な項目を展開すると、それまで展開されていた項目は自動的に折り畳まれます。



## <a id="features"></a> CollapsibleSet の機能

`CollapsibleSet` は多くの `Collapsible` コントロールをグループ分けするため、ほとんどの機能は個々の折り畳み可能なコントロール内に構成されたままになります。コントロールのテキストのヘッダーを構成するプロパティ以外に、論理状態 (展開/折り畳み) アイコンの位置と状態を構成するプロパティがあります。`Collapsible` のウィジェット機能の構成方法の詳細については、[*CollapsibleSet *](CollapsibleSet-Adding.html)の追加と[*CollapsibleSet*の構成](CollapsibleSet-Configuring.html)を参照してください。

**関連トピック**

-   [***CollapsibleSet* の追加**](CollapsibleSet-Adding.html)
-   [*CollapsibleSet* の構成](CollapsibleSet-Configuring.html)




## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [*CollapsibleSet* の追加](CollapsibleSet-Adding.html): このトピックでは、Infragistics® Model-View-Controller (MVC) ラッパーを使用して CollapsibleSet ウィジェットを有効にする方法をコード例を用いて説明します。

- [*CollapsibleSet* の構成](CollapsibleSet-Configuring.html): このトピックでは、`CollapsibleSet` ウィジェットの構成方法を説明します。

- [CollapsibleSet プロパティ リファレンス](CollapsibleSet-Property-Reference.html): このトピックでは、`CollapsibleSet` ウィジェットに関する参照情報について説明します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-collapsible-set/basic-usage): このサンプルでは、食品の注文フォームとして `CollapsibleSet` ASP.NET MVC ヘルパーを使用する方法を紹介します。すべての Collapsible コントロールが縮小可能なセットにグループ化されます。縮小可能なセットは一度に 1 つのみ展開されます。縮小可能なセットを展開すると、前に展開されたセットが縮小化されます。





 

 


