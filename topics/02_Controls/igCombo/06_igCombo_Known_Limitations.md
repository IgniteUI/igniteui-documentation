<!--
|metadata|
{
    "fileName": "igcombo-known-limitations",
    "controlName": "igCombo",
    "tags": ["Known Issues","Tips and Tricks"]
}
|metadata|
-->

# 既知の問題点と制限事項 (igCombo)



##既知の問題点と制限の概要


### 既知の問題点と制約の概要表

以下の表で、`igCombo` コントロールの既知の問題点と制限事項を簡単に説明します。以下の表は、一部の問題の詳細な説明とその回避策を示します。

凡例 | 
-------|------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません
![](images/tobeUpdated.png) | 既知の回避策はありません。修正予定です

問題|説明|状態
---|---|---
[複数の選択とカスタム値を同時に使用できない](#multiSelection)|`AllowCustomValue = true` および `multiSelection = "on"` または `multiSelection = "onWithCheckBoxes"` との組合わせはサポートされていません。 | ![](images/positive.png)
[コンボのカスケード用に親コンボのキーを使用すると、子コンボのフィルタリングができない](#parentComboKey)|回避策については、[データ ソース カスケードへの igCombo コントロール カスケードのバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html) のトピックを参照してください。 | ![](images/positive.png)
[igCombo の子のカスケードに対し、ロード オン デマンドがサポートされない](#Load_on_demand)|親コンボのキーの定義とともに、子の `igCombo` のカスケードにロード オン デマンドを有効にするように構成することはサポートされていません。 | ![](images/negative.png)


##既知の問題点と制限の詳細


###<a id="multiSelection"></a>複数の選択とカスタム値を同時に使用できない

複数選択およびカスタム値の両方を使用することはサポートされていません。 (`AllowCustomValue = true` を `multiSelection =` “on” または `multiSelection = “onWithCheckBoxes”` と共に使用することはサポートされていません。)

**回避方法**

この問題で考えられる回避方法は、外部選択した `igCombo` コントロールのリストに値を追加するオプションをユーザーに提供することです。これにより、新しい値の入力が `igCombo` コントロールで提供された複数選択ビヘイビアーと分離されます。

###<a id="parentComboKey"></a> コンボのカスケード用に親コンボのキーを使用すると、子コンボのフィルタリングができない

カスケード igCombo で [parentComboKey](%%jQueryApiUrl%%/ui.igcombo#options:parentComboKey) を使用する場合、子 `igCombo` をフィルターすることができません。子 igCombo でフィルタリング機能が必要の場合、parentComboKey を使用する代わりにカスケード データ ソースの実装を使用します。詳細については、[カスケード igCombo コントロールをカスケード データ ソースへバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html)というトピックを参照してください。

###<a id="Load_on_demand"></a> igCombo の子のカスケードに対し、ロード オン デマンドがサポートされない

親コンボのキーの定義とともに、子の `igCombo` のカスケードにロード オン デマンドを有効にするように構成することはサポートされていません。これは、カスケード コンボ用のデータ ソースが、最初の読み込み時に一度だけしか取得できないという事実によるものです。親コンボにおける選択済み項目の変更は、データ ソース内で既存のレコードをフィルタリングするのみです。



##関連コンテンツ


### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[カスケード igCombo コントロールをカスケード データ ソースへバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Cascading-Data-Sources.html): このトピックでは、親と子 `igCombo` コントロールを カスケード データ ソースにバインドする方法について説明します。カスケードに含まれる個々の `igCombo` コントロールを別個のデータ ソースにバインドする方法については、[個々のデータ ソースへ igCombo コントロール カスケードのバインド](igCombo-Binding-Cascading-igCombo-Controls-to-Individual-Data-Sources.html)というトピックを参照してください。





 

 


