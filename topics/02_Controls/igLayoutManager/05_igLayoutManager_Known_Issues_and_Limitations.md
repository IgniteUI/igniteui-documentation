<!--
|metadata|
{
    "fileName": "iglayoutmanager-known-issues-and-limitations",
    "controlName": "igLayoutManager",
    "tags": ["Known Issues","Layouts"]
}
|metadata|
-->

# 既知の問題と制限 (igLayoutManager)



##既知の問題と制限


### 既知の問題点と制約の概要表

以下の表に、%%ProductName%%® %%ProductVersion%% リリースでの `igLayoutManager`™ コントロールの既知の問題と制限について簡単に説明します。

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
Grid と Border レイアウト内の項目は、IE 7 と重複しています|IE 7 は box-sizing:border-box をサポートしていません。この制約のため、Grid レイアウトと Border レイアウトの重複が発生します。|![](images/negative.png)
[スクロールバーのあるグリッド レイアウトの項目の幅が、IE9 で正しく表示されません。](#grid-layout)|IE9 で、position: absolute, box-sizing: border-box を設定している場合、スクロールバーを持つ要素の幅を正しく計算できない問題があります。|![](images/positive.png)



### <a id="grid-layout"></a> スクロールバーのあるグリッド レイアウトの項目の幅が、IE9 で正しく表示されません。

問題を回避するには、 IE9 で項目でスクロールバーを使用しないよう設定します。スタイルを `.ig-layout-item {overflow: hidden}` に設定します。



 

 


