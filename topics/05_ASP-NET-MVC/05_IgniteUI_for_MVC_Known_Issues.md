<!--
|metadata|
{
    "fileName": "aspnet-mvc-wrappers-known-issues",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# ラッパーの既知の問題と制限 (%%ProductNameMVC%%)



## 既知の問題点と制限の概要

以下の表は、%%ProductNameMVC%% の既知の問題と制限の概要を示します。以下の表は、一部の問題の詳細な説明とその回避策を示します。


凡例: | 
--------|---------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません
![](images/plannedFix.png) | 既知の回避策はありません。修正予定です。

### %%ProductNameMVC%%


問題|説明|状態
------|-------------|--------
[MVC ヘルパー生成コードと MVC ローダーがカスタムの JavaScript ページ設定コードのあとに実行される](#helper-loader-scripts)|ASP.NET MVC ビューにおいてコントロールの MVC ローダーや MVC ヘルパーを使用した場合、それらが生成する JavaScript コードは、[`$(document).ready()`](http://api.jquery.com/ready/) や [`$(window).load()`](http://api.jquery.com/load-event/) イベントで渡されたカスタムのページ設定コードの後に実行されます。 | ![](images/positive.png)
[AutoGenerateLayouts の既定値が変更される](#default-autogeneratelayouts)|グリッドの ASP.NET MVC ヘルパーでは、フラット グリッドに対して別のリモート データ要求が発行されることを防ぐために、`AutoGenerateLayouts` プロパティの既定値が false に変更されます。 | ![](images/negative.png)
[MVC Razor レイアウト ビューで MVC Loader が正常に機能しない](#loader-layout-view)|ASP.NET MVC Loader を MVC Razor のレイアウト ビューに表示した場合、実際のビューにあるコントロールよりも前にローカルを初期化することはできません。 | ![](images/positive.png)



## 既知の問題点と制限の詳細

### <a id="helper-loader-scripts"></a> MVC ヘルパー生成コードと MVC ローダーがカスタムの JavaScript ページ設定コードのあとに実行される

ASP.NET MVC ビューにおいてコントロールの MVC ローダーや MVC ヘルパーを使用した場合、それらが生成する JavaScript コードは、[`$(document).ready()`](http://api.jquery.com/ready/) や [`$(window).load()`](http://api.jquery.com/load-event/) イベントで渡されたカスタムのページ設定コードの後に実行されます。

これは、コントロールがページの本文で描画され、スクリプト コードは通常先頭部分に入れられるためです。MVC ヘルパー コードが描画したコントロールをカスタム コードが参照する場合、コントロールがまだ存在しないため失敗する可能性があります。これはタイミングの問題であるため、MVC Loader が必要なリソースを読み込む速度によって左右されます。

> **回避方法**
> 
> `dataBound` など、コントロール初期化シーケンスの最後のイベントにアタッチし、コントロールのすべての JavaScript コードをイベント ハンドラーから実行します。あるいは、以下のコード スニペットに示すように MVC ヘルパーのあとに短い `script` ブロックを追加することができます。以下のコードは、すべてのカスタム コードが `customControlLogic()` 関数によって処理されています。このため、コントロールに影響を与えるコードは、コントロールのインスタンスが作成されたあとで実行されるようになっています。

**JavaScript の場合:**

```js
$.ig.loader(function () {
    customControlLogic();
});
```

### <a id="default-autogeneratelayouts"></a> AutoGenerateLayouts の既定値が変更される

グリッドの ASP.NET MVC ヘルパーでは、フラット グリッドに対して別のリモート データ要求が発行されることを防ぐために、`AutoGenerateLayouts` プロパティの既定値が false に変更されます。

リモートの並べ替えやフィルタリングといったリモート データ バインド シナリオにおいて、[`AutoGenerateLayouts`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridModel~AutoGenerateLayouts.html) を true に設定すると、データ ソースへの要求が増えることになります。`AutoGenerateLayouts` を false に設定すると、追加の要求を防止することができます。

> **注:**
> 
> これは最新の変更です。

### <a id="loader-layout-view"></a> MVC Razor レイアウト ビューで MVC Loader が正常に機能しない

%%ProductNameMVC%% Loader を MVC Razor のレイアウト ビューに表示した場合、実際のビューにあるコントロールよりも前にローカルを初期化することはできません。

ローダーが ASP.NET MVC レイザー アプリケーションのレイアウト ページに含まれている場合、%%ProductNameMVC%% は適切なローダー コードを生成しません。ASP.NET MVC へルパーは通常の jQuery `$(function() { })` (document.ready) 構文を使用します。ASP.NET MVC Razor アプリケーションでのみ発生します。マスター ページのある MVC ASPX ビューでは、この問題は発生しません。

これは、特定のビューが描画されてからレイアウト ビューが処理/実行されるため、ビューのレンダリングの前にローダーを初期化することができないためです。

> **回避方法**
> 
> アプリケーションで MVC ローダーを ASP.NET MVC Razor のレイアウト ページに含める代わりに、個別のビューの中に置きます。



 

 


