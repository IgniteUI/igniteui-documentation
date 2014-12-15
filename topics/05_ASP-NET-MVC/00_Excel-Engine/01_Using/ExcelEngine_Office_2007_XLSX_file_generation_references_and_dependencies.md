<!--
|metadata|
{
    "fileName": "excelengine-office-2007-xlsx-file-generation-references-and-dependencies",
    "controlName": "Infragistics Excel Library",
    "tags": ["FAQ"]
}
|metadata|
-->

# Office 2007 XLSX ファイル生成の参照と依存

**.NET CLR 3.0 以上のバージョンの使用**

Microsoft® Office® 2007 準拠の `xlsx` Excel ファイルを生成するために Infragistics® Excel® オブジェクト ライブラリおよびエクスポーターを使用する場合、.NET Framework CLR バージョン 3.0 以上が必要です。このシナリオでは、`Infragistics.Web.Mvc.Excel` アセンブリを参照します。xlsx ファイル作成ロジックに組み込まれる圧縮およびパッケージ機能は、.NET Framework CLR3.0 に依存します。

**.NET CLR 2.0 の使用**

.NET Framework のバージョン 3.0 の参照がオプションでなく CLR2.0 に限定される場合、自分自身で圧縮およびパッケージ ロジックを追加することができます。このシナリオでは、`Infragistics.Excel` アセンブリを参照します。これは簡単な仕事ではありませんが、これを達成する方法を示すサンプルは、本リリースの時点で使用できます。サンプルを取得するには、Samples SDK をダウンロードしてください。そうすれば、これを実行する方法を確認するためにコードおよびコメントを調べることができます。

 

 


