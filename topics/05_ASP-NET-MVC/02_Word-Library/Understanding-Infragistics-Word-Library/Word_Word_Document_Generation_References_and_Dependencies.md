<!--
|metadata|
{
    "fileName": "word-word-document-generation-references-and-dependencies",
    "controlName": "Infragistics Word Library",
    "tags": ["FAQ"]
}
|metadata|
-->

# Word 文書生成の参照と依存関係

## .NET CLR 3.0 以上のバージョンの使用

Microsoft® Word® ドキュメントを生成するために Infragistics® Word ライブラリおよびエクスポーターを使用する場合、.NET Framework CLR バージョン 3.0 以上が必要です。このシナリオでは、Infragistics.Web.Mvc.Documents.IO アセンブリを参照します。Word 文書作成ロジックに組み込まれる圧縮およびパッケージ機能は、.NET Framework CLR3.0 に依存します。

## .NET CLR 2.0 の使用

.NET Framework のバージョン 3.0 の参照がオプションでなく CLR2.0 に限定される場合、自分自身で圧縮およびパッケージ ロジックを追加することができます。このシナリオでは、Infragistics.WebUI.Documents.IO アセンブリを参照します。

## 関連トピック
-   [Infragistics Word ライブラリの使用](Word-Using-the-Infragistics-Word-Library.html)
-   [Infragistics Word ライブラリについて](Word-About-Infragistics-Word-Library.html)

 

 


