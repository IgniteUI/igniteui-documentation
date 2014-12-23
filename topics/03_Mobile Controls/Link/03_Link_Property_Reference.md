<!--
|metadata|
{
    "fileName": "link-property-reference",
    "controlName": "Link",
    "tags": ["API","MVC","Navigation"]
}
|metadata|
-->

# Link のプロパティ リファレンス

## Link MVC ラッパー (プロパティ) の参照

このトピックでは、`Link` MVC ラッパーのプロパティに関するリファレンス情報を提供します。

以下の表は、`Link` MVC ラッパーのプロパティについて説明し、デフォルト値および推奨値を示しています。

> **Null 値**
>
>既定値が null になっているプロパティは jQuery モバイルのデフォルト設定値でウィジェットを表示するという点に留意してください。詳細は、[Link](http://jquerymobile.com/demos/1.1.1/docs/pages/#link-formats.html) をご覧ください。


### Link (プロパティ) 参照チャート

プロパティ|タイプ|説明|値（デフォルト値）
---|---|---|---
[ID](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~ID.html)|string|Link ID を取得または設定します。|LinkID
[Text](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Text.html)|string|Link テキストを取得または設定します。|Link
[NavigateUrl](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~NavigateUrl.html) |string|Link コントロールが参照しているターゲットを取得または設定します。|"http://www.infragistics.com"
[Target](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Target.html) |string|アンカー ターゲットを取得または設定します。|“_blank” <br />“_parent” <br />“_self” <br />“_top” <br />“framename”
[DestinationRelationship](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~DestinationRelationship.html) |[LinkDestinationRelationshipOptions](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkDestinationRelationshipOptions.html) |現在の文書と参照された文書の関係を取得または設定します。|LinkDestinationRelationshipOptions.Back LinkDestinationRelationshipOptions.Dialog LinkDestinationRelationshipOptions.External LinkDestinationRelationshipOptions.Popup
[Ajax](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Ajax.html) |bool?|AJAX を使用してこのページをフェッチするかどうかを取得または設定します。|null
[ReverseDirection](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~ReverseDirection.html) |bool|移行中にページ アニメーションを反転するかどうかを取得または設定します。|false
[DomCache](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~DomCache.html) |bool?|このリンクに対して DOM キャッシングを有効にするかどうかを取得または設定します。|null
[Prefetch](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Prefetch.html) |bool?|パフォーマンスを上げるためにページをプリフェッチするかどうかを取得または設定します。|null
[Transition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Transition.html) |string|新しいコンテンツに移動する時に [transition](http://jquerymobile.com/demos/1.0a4.1/docs/pages/docs-transitions.html) を取得または設定します|“slide” <br />“slideup” <br />“slidedown” <br />“pop” <br />“fade” <br />“flip”
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Mini.html)|bool?|Link サイズ状態を有効/無効にします。|null
[Inline](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Inline.html)|bool?|Link インラインの表示状態を有効/無効にします。|null
[RenderMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~RenderMode.html)|[LinkRenderMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkRenderMode.html) |リンクをボタンとして描画し、それをネイティブ モードでリンクまたは描画します。|LinkRenderMode.Button<br />LinkRenderMode.Link<br />LinkRenderMode.Native
[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Icon.html)|string|Link がボタンとして描画されるときに、[icon](http://api.jquerymobile.com/icons/) を取得または設定します。|“arrow-l” <br />“delete” <br />“plus” <br />“minus” <br />“check” <br />“gear”
[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~IconPosition.html)|string|Link がボタンとして描画されるときに、[icon](http://api.jquerymobile.com/icons/) 位置を取得または設定します。|"right"<br />"left"<br />“top”<br />“bottom”
[IconShadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~IconShadow.html)|bool?|Link がボタンとして描画されるときに、アイコンの影を有効/無効にします。|null
[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Shadow.html)|bool?|Link がボタンとして描画されるときに、Link の影を有効/無効にします。|null
[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Corners.html)|bool?|Link がボタンとして描画されるときに、Link の丸い角を有効/無効にします。|null
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~Theme.html)|string|Link テーマを取得または設定します。|null<br />“a” <br />“b” <br />“c” <br />“d” <br />“e”
[HtmlAttributes](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.LinkWrapper~HtmlAttributes.html)|IDictionary<string,object>|HTML の追加属性を設定します。|new Dictionary<string, object>() { {"disabled", "disabled"} }

 

 


