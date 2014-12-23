<!--
|metadata|
{
    "fileName": "slider-property-reference",
    "controlName": "Slider",
    "tags": ["API"]
}
|metadata|
-->

# Slider プロパティ参照

## Slider ASP.NET MVC ヘルパー (プロパティ) 参照

このトピックでは、`Slider` ASP.NET MVC ヘルパーのプロパティに関する参照情報を提供しています。



以下の表では、`Slider` ASP.NET MVC ヘルパーのプロパティについて説明し、またデフォルト値と推奨値を紹介します。

>**Null 値**
>
> サーバー上の ASP.NET MVC ヘルパーでデフォルト null 値を持つプロパティで、クライアント上のデフォルトの jQuery Mobile 値を持つウィジェットを描画します。詳細は、[Slider オプション](http://api.jquerymobile.com/slider/)をご覧ください。


### Slider（プロパティ）参照チャート

プロパティ|タイプ|説明|値（**デフォルト値**）
---|---|---|---
[Value](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Value.html)|double|*Slider* の値|*30.0*
[MinValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MinValue.html)|double|*slider* の見込まれる最小値|*0.0*
[MaxValue](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~MaxValue.html)|double|*slider* の見込まれる最大値|*100.0*
[Step](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Step.html)|double|2 つの *slider* 値の間の手順。|*10.0*
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Theme.html)|string|*slider* のメイン テーマ|*null*
[TrackTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~TrackTheme.html) |string|*slider* のトラック テーマ。TrackTheme はハンドルが移動するトラックに適用されます。|*null*
[NumericInputDisplayMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~NumericInputDisplayMode.html)|[Infragistics.Web. Mvc.Mobile.DisplayMode](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.DisplayMode.html) |Slider の隣の type='number' の入力上の表示属性を取得または設定します。|*Inline*
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Disabled.html)|bool?|*true* の場合、*Slider* は無効です（読み取り専用）。|*null*
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Label.html)|string|フォーム要素の前に表示されるテキストを取得または設定します。|*null*
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~LabelAlignment.html)|[Infragistics.Web.Mvc. Mobile.Alignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.Alignment.html) |ラベルの配置 (ラベルが表示されている場合)。有効な値：<br/>• Left <br/>• Right <br/>• Bottom <br/>• Top |*Top*
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~HideLabel.html)|bool|ラベルが非表示の場合|*false*
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Mini.html)|bool?|mini スタイルを持つウィジェットを描画するかどうかを取得または設定します。|*null*
[Highlight](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SliderWrapper~Highlight.html)|bool?|true の場合、Slider の選択した領域は強調表示されます。|*null*
