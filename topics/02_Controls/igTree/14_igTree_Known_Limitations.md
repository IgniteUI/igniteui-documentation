<!--
|metadata|
{
    "fileName": "igtree-known-limitations",
    "controlName": "igTree",
    "tags": ["How Do I","Known Issues","Tips and Tricks"]
}
|metadata|
-->

# igTree の既知の制約事項

## 既知の問題と制限の概要
### 問題または制限のチャート
以下の表は、`igTree`™ コントロールの %%ProductName%% %%ProductVersion%% リリースの既知の問題または制限の概要を記載しています。表に続くブロックにある問題の詳細説明と考えられる回避方法が記載されています。

凡例:

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

機能|説明|回避策
---|---|---
LI 固定幅|IE7 では、LI 要素がその親コンテナーから固定幅を継承している場合、ある LI のコンテンツはこの固定幅より大きい場合があるため、LI は常にラップします。 |![](images/positive.png)
ロード オン デマンドでノードを検索する|`findNodesByText` メソッドを使用している場合、検索はクライアントで描画されたノードだけに制限されます。したがって、`loadOnDemand` を有効にしてこれを使用すると、作成されたノードからの結果だけが返されます。|![](images/negative.png)
アクティブ ノードのスタイルが正しく非アクティブ化されない|Firefox では jQuery 1.4.4 に問題があり、ぼかしイベントを期待通りに起動できません。このためノードのアクティブ スタイルが、アクティブでなくなった後もそのままの状態になります。|![](images/positive.png)
XML へのクライアント側のバインディング|階層バインディングによる XML へのバインディングは ASP.NET MVC で完全にサポートされていますが、クライアント側のバインディングはフラット バインディングに制限されています。この問題は、今後のリリースで対応する予定です。|![](images/plannedFix.png)
プライマリ キーを使用するツリーでプライマリ キーがないノードを移動してコピー|プライマリ キーを含むバインディングおよび含まないバンディングの結合により行います。|![](images/negative.png)

### LI 固定幅の制限に関する説明
IE7 では LI 要素がその親コンテナーから固定幅を継承している場合、ある LI のコンテンツはこの固定幅より大きい場合があるため、LI は常にその固定幅をラップします。

### LI 固定幅の回避方法
この問題は、適切なカスタム幅をツリーのすべての LI 要素に明示的に設定することで解決できます。

### アクティブ ノード スタイルの説明
Firefox では jQuery 1.4.4 に問題があり、ぼかしイベントを期待通りに起動できません。このためノードのアクティブ スタイルが、アクティブでなくなった後もそのままの状態になります。

### アクティブ ノード スタイルの回避方法
jQuery 1.4.4 以降のバージョンへアップグレード、または `igTree` コントロールの問題が解決された %%ProductName%% の最新のサービス リリースを適用してください。

## プライマリ キーを使用するツリーでプライマリ キーがないノードを移動してコピー
プライマリ キーを含むバインディングおよび含まないバンディングの両方を使用しないでください。

以下は、その他の役立つトピックです。

-   [既知の問題](Known-Issues-Revision-History.html)
-   [igTree の概要](igTree-Overview.html)

 

 


