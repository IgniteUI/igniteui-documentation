<!--
|metadata|
{
    "fileName": "igdateeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igDateEditor の既知の問題

##既知の制約事項

- [`dateInputFormat`](%%jQueryApiUrl%%/ui.igdateeditor#options:dateInputFormat)  オプションの初期化後に値を変更することはサポートされていません。
- `minValue`、`maxValue`、および `value` オプションで `new Date()` の使用に問題の発生が可能です。時間部分があるため、制限の評価で使用されますが、デフォルトの入力形式から解析されなく、含まれません。固定日付を解析するか、時間部分を削除することを推薦します。
	
	** JavaScript の場合**
	```js
	var date = new Date();
	// remove hours:
	date.setHours(0,0,0,0);
	// or use constructor with string/values:
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	$('#datePicker').igDateEditor({
        minValue: date
    });
	```

## 関連リンク
-   [igDateEditor の概要](igDateEditor-Overview.html)

 

 


