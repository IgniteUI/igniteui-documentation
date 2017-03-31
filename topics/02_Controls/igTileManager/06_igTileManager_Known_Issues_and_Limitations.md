<!--
|metadata|
{
    "fileName": "igtilemanager-known-issues-and-limitations",
    "controlName": "igTileManager",
    "tags": ["Known Issues","Layouts"]
}
|metadata|
-->

# 既知の問題と制限 (igTileManager)

## 既知の問題と制限
### 既知の問題点と制約の概要表

以下の表に、%%ProductName%%® %%ProductVersion%% リリースでの `igTileManager`™ コントロールの既知の問題と制限について簡単に説明します。以下の表は、すべての問題の詳細な説明とその回避策を示します。

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



### igTileManager

問題|説明|状態
---|---|---
box-sizing 設定モデルをサポートしていないブラウザーで `igTileManager` が正しく機能しない |  この box-sizing 設定モデルでは、確実にボックスが外側ではなく内側に拡張します。そうでない場合、パディングと境界線、およびその他の外側高さ / 幅補助キーを持つタイルの配置は非常に困難です。 |![](images/negative.png)
1.8.0 以前の jQuery のバージョンではサポートされない|1.8.0 以前の jQuery のバージョンには制限があるため、`igTileManager` コントロールは正しく機能しません。 |![](images/negative.png)
大量のデータ (イメージなど) による複数のタイル表示の場合、アニメーション化されたトランジションが途切れがちになる|`igTileManager` コントロールはjQuery アニメーションに依存し、そのパフォーマンスによって制約されます。|![](images/negative.png) <br> ![](images/plannedFix.png)
ページを 130% 以上ズームすると、`igTileManager` が正しく機能しない|ブラウザーでWeb ページを実サイズの 130% 以上ズームし、タイルを最大化した場合、最小化されたタイルは見えなくなり、操作できません。|![](images/negative.png) <br> ![](images/plannedFix.png)


## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igTileManager の構成](igTileManager-Configuring.html): このトピックでは、`igTileManager` コントロールの機能およびビヘイビアーを構成する方法を説明します。
    




 

 


