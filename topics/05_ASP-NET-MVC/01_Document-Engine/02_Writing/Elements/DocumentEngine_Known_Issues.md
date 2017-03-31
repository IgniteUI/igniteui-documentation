<!--
|metadata|
{
    "fileName": "documentengine-known-issues",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 既知の問題と制限 (Infragistics Document Engine)

## 既知の問題点と制限の概要
以下の表に、Infragistics Document Engine のコンポーネントの既知の問題と制限を簡単に説明します。

**凡例:**

![](images/positive.png)  - 回避策

![](images/negative.png)  -  既知の回避策はありません

![](images/plannedFix.png)  - 既知の回避策はありません。修正予定です

## Infragistics Document Engine
問題|説明|状態
---|---|---
名前空間の競合|Infragistics ASP.NET と %%ProductName%%™ のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。 | ![](images/positive.png)



## 既知の問題点と制限の詳細
Infragistics ASP.NET と %%ProductName%% のドキュメント アセンブリを併用すると、名前空間の競合による例外が発生します。

### 回避方法
アプリケーションで Infragistics ASP.NET のドキュメント アセンブリと %%ProductName%% のドキュメント アセンブリのいずれか一方を参照します。これらのアセンブリ内のドキュメント ライブラリは同じで、どちらを使用してもかまいません。



 

 


