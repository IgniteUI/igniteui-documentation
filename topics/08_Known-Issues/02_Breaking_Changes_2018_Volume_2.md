<!--
|metadata|
{
    "fileName": "breaking-changes-2018-volume-2",
    "controlName": "",
    "tags": ["Breaking Changes","Known Issues"]
}
|metadata|
-->

# 2018 Volume 2 の重大な変更

## igGrid
- 18.2 バージョンでは、並べ替えフィルタリングやページングなどのリモート機能でクエリ文字列が含まれており、列キー以外に列タイプがサポートされます。例:
 
 GetData?sort(**Name%3Astring**)=asc&page=0&pageSize=1&pk=ProductID&_=1538145630155

### フィルタリングの変更

 - フィルタリング ドロップダウン条件リストの DOM 構造が変更されました。18.2 以前のバージョンでは、各列ごとに div 要素が描画されました。18.2 バージョン以降、パフォーマンスの改善を目的にすべての列で 1 つの div 要素のみ描画するようになりました。
 
 - デフォルトのフィルタリング条件 (which depends on the column data type) またはフィルタリング [*columnSettings*](%%jQueryApiUrl%%/ui.iggridfiltering#options:columnSettings) の [*condition*](%%jQueryApiUrl%%/ui.iggridfiltering#options:columnSettings.condition) オプションで明示的に設定した条件がドロップダウン条件リストから選択できるようになりました。唯一の例外は列で、デフォルト (または明示的に設定した) 条件で Boolean 列や「今日」、「昨日」、「今月」などの条件を含む日付列などのユーザー入力を要求しません。エンドユーザーは、適用するために明示的に選択する必要があります。
