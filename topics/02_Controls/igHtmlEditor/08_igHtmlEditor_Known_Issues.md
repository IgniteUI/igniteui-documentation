<!--
|metadata|
{
    "fileName": "ightmleditor-known-issues",
    "controlName": "igHtmlEditor",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題と制限

##トピックの概要

### 目的

このトピックでは、`igHtmlEditor`™ コントロールの既知の問題点と制限事項について説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

-	[既知の問題](Known-Issues-Revision-History.html): すべての Ignite UI コントロールの既知の問題点と制限事項に関する参考情報を提供します。


##既知の問題と制限

### 概要

次の表は、`igHtmlEditor` コントロールの既知の問題点と制限事項の要約です。以下の概要表に、いくつかの問題に関する既知の問題の詳細説明と考えられる回避策が記載されています。

### 凡例:


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



機能|説明|状態
---|---|---
表および画像は WebKit ベースのブラウザ (Chrome、Safari など) ではサイズ変更できません。|IFRAME BODY の contenteditable 属性が true に設定されている場合は、表のサイズ変更ハンドルはありません。[こちら](http://code.google.com/p/chromium/issues/detail?id=52800)より、Chromium トラッカーのバグの詳細を確認できます。|![](images/Known_Issues_and_Limitations_NoSolution.png)
[切り取り、コピーおよび貼り付けのツールバー機能が Internet Explorer でしか動作しない](#cut-copy-paste)|Internet Explorer には、切り取り、コピーおよび貼り付け機能用の API がありますが、他のブラウザではこれらの機能のサポートは制限されているか、または未サポートです。|![](images/Known_Issues_and_Limitations_Solution.png)
Internet Explorer では、PRE 要素がエディターのビューポートから外に出ても、PRE 要素のボーダーは可視のままになります。|デザイン ビューで 選択されたPRE 要素で Internet Explorer の igHtmlEditor コンテンツをスクロールすると、PRE 要素がエディターのビューポートの外にスクロールされた後も、その要素のサイズ変更ボーダーは可視のままになります。|![](images/Known_Issues_and_Limitations_NoSolution.png)
[Firefox では、Symbol、Webdings、および Wingdings フォントが他のブラウザとは異なる方法で描画される。](#style-difference)|Firefox では、Symbol、Webdings、および Wingdings フォントが他のブラウザとは異なる方法で描画されます。|![](images/Known_Issues_and_Limitations_Solution.png)
[Firefox では、入力フィールドがその後にある HTML フォームで igHtmlEditor を使用した場合に F5 を押すと、その入力フィールドはコンボ ボックスからのテキストで埋まります。](#html-forms)|Firefox では、*name* 属性が定義されていない入力フィールドがその後にある HTML フォームで igHtmlEditor を使用した場合に F5 を押すと、その入力フィールドは、フォント名、フォント サイズ、および見出しのコンボ ボックスからのテキストで埋まります。|![](images/Known_Issues_and_Limitations_Solution.png)
[igHtmlEditor を igDialog 内で使用したときにエディターのサイズが正しく変更されない。](#igDialog)|igHtmlEditor の幅や高さがパーセンテージ値として指定されているときに igHtmlEditor を igDialog 内で使用した場合、まだダイアログが作成されていない状態で、igHtmlEditor の寸法を正しく計算することができないため、エディターのサイズは正しく変更されません。|![](images/Known_Issues_and_Limitations_Solution.png)
ハイパーリンクを Internet Explorer で開くことができない。|IE で右クリックしても、開くオプションのリストが表示されません。CTRL を押しながらクリックしても開きません。|![](images/Known_Issues_and_Limitations_NoSolution.png)
Internet Explorer 6-10 の場合、元に戻す/やり直し機能に一貫性がありません。|元に戻す/やり直し機能はネイティブなブラウザーの実装で実行されます。IE で要素がコードで挿入または削除された場合、元に戻す/やり直しバッファーはリセットされます。「Dom パス ツールバー」などの機能は要素の挿入と削除に基づきます。つまり、操作が元に戻す/やり直しバッファーをリセットする可能性があります。|![](images/Known_Issues_and_Limitations_NoSolution.png)
Internet Explorer で、ソース表示モードで追加された表は新しい行を含むはずがありません。|表要素の新しい行は、IE 選択および範囲 API を使用する場合に例外を発生します。|![](images/Known_Issues_and_Limitations_NoSolution.png)
Internet Explorer では、一度に 1 つのスタイルのみが選択できます。|IE により選択肢が更新され、コマンドが適切に実行される必要があります。このとき、複数のコマンドを一度に選択すると最後に選択したコマンドは失われます。|![](images/Known_Issues_and_Limitations_NoSolution.png)



####<a id="cut-copy-paste"></a> 「切り取り、コピーおよび貼り付けツールバーの機能が Internet Explorer でしか動作しない」－回避策

Firefox、Chrome、Safari、および Opera などのその他のブラウザの場合、Ctrl+C、Ctrl+X、Ctrl+V などのキーボード ショートカットを使用できます。

####<a id="style-difference"></a> Firefox では、Symbol、Webdings、および Wingdings フォントが他のブラウザとは異なる方法で描画される。

その代わりに、UTF 文字数値参照を使用してください。詳細情報は、[Mozilla Web 開発者用 FAQ](https://developer.mozilla.org/en/Mozilla_Web_Developer_FAQ#Why_aren.E2.80.99t_symbol.2Fdingbat_fonts_working.3F) を参照してください。

#### <a id="html-forms"></a>Firefox では、入力フィールドがその後にある HTML フォームで igHtmlEditor を使用した場合に F5 を押すと、その入力フィールドはコンボ ボックスからのテキストで埋まります。

回避策としては、`igHtmlEditor` の初期化後、INPUT 要素のテキストをクリアします。

例:

**JavaScript の場合:**

```
$.ig.loader(function () {
    $("#htmlEditor").igHtmlEditor({
        width: "100%"
    });
    $("#forumAnswer input[type='text']").val("");
});
```

**HTML の場合:**

```
<form id="forumAnswer" action="/SaveAnswer" method="post">
    <input type="text" name="username"></input>
    <div id="htmlEditor"></div>
    <input type="text" name="tags"></input>
</form>
```

上記の例では、`igHtmlEditor` が初期化された後、「formAnswer」という名前の FORM のすべての INPUT 要素がクリアされます。

INPUT 要素のクリアをより適切に制御したい場合は、コンテナー要素を使用するか、または INPUT を直接名前または ID で参照します。

>**注:** この動作は、ページの最初の読み込み時には見られませんが、F5 を使ってページをリフレッシュした時に見られます。この問題は、name 属性が定義されていない `igHtmlEditor` と同じ FORM 要素内の INPUT 要素で発生します。

####<a id="igDialog"></a> igHtmlEditor を igDialog 内で使用したときにエディターのサイズが正しく変更されない。

自動サイズ変更問題を回避するためには、`igDialog` を開いてから `igHtmlEditor` を初期化することをお勧めします。

例:

**JavaScript の場合:**

```
$.ig.loader(function () {
    $("#dialog").igDialog({width: 900, height: 600, state: "closed"});
    $("#openDialogButton").bind("click", function() {
        $("#dialog").igDialog("open");
        $("#htmlEditor").igHtmlEditor({
            width: "100%",
            height: "100%"
        });
    });
});
```



##関連コンテンツ


### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

-	[アクセシビリティ準拠 (igHtmlEditor)](igHtmlEditor-Accessibility-Compliance.html): このトピックでは、`igHtmlEditor` のアクセシビリティ機能について説明し、`igHtmlEditor` を含むページのアクセシビリティ準拠を達成する方法に関する情報を提供します。

-	[アクセシビリティ準拠](Accessibility-Compliance.html): すべての Ignite UI コントロールのアクセシビリティ準拠のための参照情報を提供します。





 

 


