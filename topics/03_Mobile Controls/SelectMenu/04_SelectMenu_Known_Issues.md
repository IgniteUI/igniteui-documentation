<!--
|metadata|
{
    "fileName": "selectmenu-known-issues",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# 既知の問題と制限 (SelectMenu (モバイル))

## 既知の問題点と制限の概要
### 既知の問題点と制約の概要表

以下の表に、`SelectMenu` (モバイル) コントロールの既知の問題と制限を簡単に説明します。

**凡例:**

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

### SelectMenu (モバイル)

問題|説明|状態
---|---|---
メニューがカスタム ダイアログ ベースのコンテナーに収められている場合、モバイル `SelectMenu` の [CloseText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuModel~CloseText.html) プロパティが適用されない|ダイアログ ベースのコンテナーで、`SelectMenu` コントロールの `CloseText` プロパティを使用して閉じるボタン ツールチップのテキストを設定しても、カスタムのツールチップは表示されず、代わりにデフォルトのツールチップが表示されます。<br>これは、jQuery モバイルが、あとでアクセスできなくなるカスタムの閉じるテキストを挿入しないためです。 | ![](images/negative.png)





 

 


