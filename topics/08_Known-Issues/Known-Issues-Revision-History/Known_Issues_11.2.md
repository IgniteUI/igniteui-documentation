<!--
|metadata|
{
    "fileName": "known-issues-11.2",
    "controlName": "1",
    "tags": []
}
|metadata|
-->

# 11.2 の既知の問題点


## Ignite UI 2011 Volume 2 の既知の問題と制限
以下の表に、Ignite UI 2011 Volume 2 の既知の問題と制限事項を表示します。

凡例:

<table class="table">
    <tbody>
        <tr>
            <td><img src="images/Known_Issues_and_Limitations_Solution.png" alt="" class="img-responsive"></td>
            <td>回避策</td>
        </tr>
        <tr>
            <td><img src="images/Known_Issues_and_Limitations_NoSolution.png" alt="" class="img-responsive"></td>
            <td>既知の回避策はありません</td>
        </tr>
        <tr>
            <td><img src="images/Known_Issues_and_Limitations_FixPlanned.png" alt="" class="img-responsive"></td>
            <td>修正予定です</td>
        </tr>
    </tbody>
</table>

問題|説明|回避策
---|---|---
[Infragistics ASP.NET と Ignite UI のドキュメント エンジンの併用時に発生する問題](#using-document-engines)|Infragistics ASP.NET と Ignite UI のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。|![](images/positive.png)

## <a id="using-document-engines"></a>Infragistics ASP.NET と Ignite UI のドキュメント エンジンの併用時に発生する問題 
Infragistics ASP.NET と Ignite UI のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。

### 回避方法
この問題を解決するには、アプリケーションで Infragistics ASP.NET のドキュメント アセンブリと Ignite UI のドキュメント アセンブリのいずれか一方を参照します。これらのアセンブリ内のドキュメント ライブラリは同じで、どちらを使用してもかまいません。

## 特定のコントロールの既知の問題と制限
Ignite UI 2011 Volume 2 の既知の問題と制限はコントロールに基づいて以下のトピックに説明されます。

-   [igCombo 既知の問題と制限](igCombo-Known-Limitations.html)
-   [igTree 既知の問題と制限](igTree-Known-Limitations.html)
-   [igHierarchicalGrid 既知の問題と制限](igHierarchicalGrid-Known-Issues.html)
-   [igGrid 既知の問題と制限](igGrid-Known-Issues.html)

 

 


