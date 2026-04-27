<!--
|metadata|
{
    "fileName": "igpivotdataselector-known-issues-and-limitations",
    "controlName": "igPivotDataSelector",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題と制限 (igPivotDataSelector)

## 既知の問題と制限

### 概要

以下の表は、%%ProductName%%™ %%ProductVersionShort%% リリースの `igPivotDataSelector`™ コントロールの既知の問題および制限事項をまとめたものです。いくつかの問題および既存の回避策の詳細な説明は、サマリー表の後ろに記載されています。

### 凡例:

<table class="table">
    <tbody>
        <tr>
            <td><img src="images/positive.png" alt="" class="img-responsive"></td>
            <td>回避策</td>
        </tr>
        <tr>
            <td><img src="images/negative.png" alt="" class="img-responsive"></td>
            <td>既知の回避策はありません</td>
        </tr>
        <tr>
            <td><img src="images/plannedFix.png" alt="" class="img-responsive"></td>
            <td>修正予定です</td>
        </tr>
    </tbody>
</table>



問題|説明|状態
---|---|---
[jQuery UI 1.8.19 におけるドロップ エリア間でドラッグ アンド ドロップ後に ドロップ ラベルが残っている。](#drop-lable-problem)|`igPivotDataSelector` および/または `igPivotDataSelector`™ のエリア間で項目をドラッグ アンド ドロップする場合、ドロップ ラベルが残ります。|![](images/positive.png)

### <a id="drop-lable-problem"></a>jQuery UI 1.8.19 におけるドロップ エリア間でドラッグ アンド ドロップ後に ドロップ ラベルが残る

`igPivotDataSelector` および/または `igPivotGrid` のエリア間で項目をドラッグ アンド ドロップする場合、ドロップ ラベルが残ります。このビヘイビアーは、バージョン 1.8.19 で導入されるドラッグ可能な jQuery UI バグにより引き起こされます。詳細は、「[jQuery UI バグ 8269](http://bugs.jqueryui.com/ticket/8269)」を参照してください。

>**回避策:** 1.8.19 以外のバージョンの jQuery UI を使用してください。

##関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igPivotDataSelector](igPivotDataSelector.html): `igPivotDataSelector` コンポーネントとその使用を説明しているトピックのグループです。





 

 


