<!--
|metadata|
{
    "fileName": "igupload-known-issues",
    "controlName": "igUpload",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題と制限事項 (igUpload)

## igUpload の既知の問題点
`igUpload` コントロールを使用するときは、次に説明するコントロールの制限やブラウザーの制限があることに注意して下さい。

1.  アップロードされたファイルの最大サイズは 2 GB です。これはブラウザーの制限です。Opera など新しいバージョンのブラウザーの中には、4GB のファイルが可能なものもあります。
2.  オプション [**maxSimultaneousFilesUploads**](%%jQueryApiUrl%%/ui.igUpload#options) を設定する時、その値はブラウザーが指示するように最大値にする必要があります。複数のファイルを一度にアップロードする場合、アップロードされたファイルの数だけ要求を行っています。IE6 の場合は、このオプションを 1 に設定することをお勧めします。他のブラウザーの場合は、1 または 2 に設定することをお勧めします。たとえば、Mozilla FireFox 3.6+ は、最大値 3 まで処理が可能です。
3.  `igUpload` コントロールは、タブ ナビゲーション中を除き、キーボード ナビゲーションをサポートしておらず、コントロールはページ上でフォーカスを取得します。TAB キーを使用している場合、コントロールとその要素をナビゲートできます。
4.  ファイルをアップロードし、ブラウザーに表示されたポップアップ ウィンドウでローカル ドライブから項目を選択する場合、一度に 1 ファイルしか選択できません。
5.  MVC ラッパーなど jQuery Upload コントロールにはサーバー イベントはありません。ポイントできるのは、ハンドラーとすべてのファイルがアップロードされるフォルダーですが、アップロードが完了したらファイルを処理して削除したり移動することはできません。しかし、ASP.NET MVC のコンテキストを使えば回避できます。Global.asax ファイルで、手動でサーバー側イベントにアタッチして必要なロジックを実行し、アップロードを行うことができます。
	 >**注:** このアプローチは、ベスト プラクティスではなく、あくまでも制限への回避策としての方法です。グローバル イベントを使用すると、アプリケーションのページごとにそれらのイベントが発生するため、アップロードを行っているページのコンテキストでのみコードが実行される必要があります。

次のサンプルは、Global.asax ファイルにハンドラーをアタッチし、アップロードされたファイルを削除する方法を示しています。

**Global.asax の場合:**

```
using Infragistics.Web.Mvc.Models;

protected void Application_Start()
{
        UploadProgressManager upm = UploadProgressManager.Instance;
        upm.AddFinishingUploadEventHandler("serverID1", this.OnFileFinishing);
}

protected void OnFileFinishing(object sender, UploadFinishingEventArgs e)
{
        string filePath = String.Format("{0}{1}", e.FolderPath, e.TemporaryFileName);
        if (File.Exists(filePath))
        {       
                try
                {
                        File.Delete(filePath);
                }
                catch (Exception ex)
                {
                }
        }
}
```

>**注:** クラスおよびイベントの使用方法に関する詳細は、[HTTP ハンドラーおよびモジュールの使用](igUpload-Using-HTTP-Handler-and-Modules.html)トピックに従い、API ヘルプをお読みください。

## 依存関係
`igUpload` コントロールは、次の Ignite UI ウィジェットである `igButton`、`igBrowseButton`、`igProgressBar`、および ajaxQueue プラグインにそれぞれ依存しています。これらのウィジェットは、デフォルトで使用できるよう `igUpload` コントロールに組み込まれています。

また、ウィジェットは外部 JavaScript ファイル ig.ui.fileupload-en.js から定義された文字列を使用します。その他の言語ロケールは、適切な 2 文字の言語サフィックスが付いた他の類似ファイルを作成することで追加できます。

## 関連リンク
- [HTTP ハンドラーとモジュールの使用](igUpload-Using-HTTP-Handler-and-Modules.html)

- [igUpload の概要](igUpload-Overview.html)

 

 


