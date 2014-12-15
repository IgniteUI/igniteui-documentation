<!--
|metadata|
{
    "fileName": "slider-known-issues",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 既知の問題点および制限事項 (Slider (モバイル))

## 既知の問題点と制限の概要

以下の表に、`Slider` (モバイル) コントロールの既知の問題点と制限事項を簡単に説明します。

凡例: | 
------------|-------
![](images/Known_Issues_and_Limitations_Solution.png) | 回避策
![](images/Known_Issues_and_Limitations_NoSolution.png) | 既知の回避策はありません
![](images/Known_Issues_and_Limitations_FixPlanned.png) | 修正予定です


#### Slider (モバイル)

問題|説明|状態
---|---|---
[Mobile Slider が Windows Phone 7 上でスライドしない](#mobile-slider-windows-seven)|Windows® Phone 7 は標準のタッチ イベントをサポートしないため、スライダーは読み取り専用です。 | ![](images/positive.png)


## 既知の問題点と制限の詳細
### <a id="mobile-slider-windows-seven"></a>Mobile Slider が Windows Phone 7 上でスライドしない

Windows Phone 7 は標準のタッチ イベントをサポートしないため、スライダーは読み取り専用です。

> **回避方法**
> 
>  デフォルトでは、タッチ イベントをサポートしないデバイスでは、スライダーの左に表示される数値入力フィールドとともに、スライダーのインスタンスが作成されます。このビヘイビアーは、ASP.NET ヘルパーで `NumericInputDisplayMode` メソッドを使用してカスタマイズできます。



 

 


