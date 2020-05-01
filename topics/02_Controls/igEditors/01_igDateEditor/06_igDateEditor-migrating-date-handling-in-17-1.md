<!--
|metadata|
{
    "fileName": "igDateEditor-migrating-date-handling-in-17-1",
    "controlName": "igEditors",
    "tags": ["Migration","Getting Started"]
}
|metadata|
-->

# 17.1 で日付処理の移行

## 17.1 以後の igDateEditor および igDatePicker の日付処理

`igDateEditor` および `igDatePicker` に別のタイム ゾーンで日付を正しく処理するために複数のオプションがあります。以下のプロパティは、エディターが日付を表示し、正しく送信するためにシリアル化する方法を説明します。
-	[`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) - UTC からのタイム ゾーン オフセットを分単位で取得または設定します。クライアント側の日付値は、ローカル オフセットの代わりにこのオフセットで表示されます。ローカル オフセットがクライアント ブラウザーによって自動的に変換されます。UTC 日付を表示するには、値を 0 に設定します。
-	[`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) - このオプションはエディター表示値と関連しなくなりました。日付のシリアル化のみを制御します。ローカル時間およびゾーン値の代わりにクライアント側の日付を UTC ISO 8061 文字列としてのシリアル化を有効/無効にします。このオプションは "date" [`dataMode`](%%jQueryApiUrl%%/ui.igdateeditor#options:dataMode) のみで適用されます。

	たとえば、GMT の前の 5 時のローカル オフセットを持つクライアントからの「10:00」は、デフォルトの 'false' 値のオプションで「2016-11-11T10:00:00+05:00」としてシリアル化されます。"true" に設定去れる場合、日付は ISO UTC 形式を使用します: "2016-11-11T05:00:00Z"。

## 16.2 以前の igDateEditor および igDatePicker の日付処理

[`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) オプションは、(`getUTCDate()`、`getUTCHours()` などを使用して) ユーザーに `Date` を表示し、16.2 であいまいな文字列値を UTC 値として処理するために使用されます。
-	[`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) が有効な場合、クライアント ブラウザーのオフセットに関係なしでエディターでの表示値は UTC 時間です。例: ブラウザー オフセットが GMT+02:00 で、サーバーから送信された値が GMT の 05:00 です。エディターは、ブラウザーがローカルに使用する 07:00 の代わりに 05:00 を表示します。 
-	最初に設定される値のタイプに基づいて、(`value()` メソッドから返されたか、送信された) エディターの値がデフォルトのブラウザー処理と異なる場合があります。つまり、ブラウザーがローカル日付と異なる UTC へ変換された値になります。17.1 でエディター値が変更されていないため、予期しない結果となる場合があります。

## igDateEditor および igDatePicker を 16.2 から 17.1 に移行

### UTC 値の表示

この例では、日付エディターに GMT の AM 10:55 のある日付を表示しています。以下のコードで明示的に割り当てます。両方のエディターがクライアントのタイム ゾーンのローカル時間の代わりに UTC 値を表示するために構成されます。

16.2 バージョン以前、構成が `enableUTCDates` オプションを有効にしました。

```js
$('#edtr').igDateEditor({
	value: new Date(Date.UTC(2016, 1, 9, 10, 55, 55)),
	dateInputFormat : "dateTime",
	enableUTCDates: true
});
```

17.1 バージョン以後、`displayTimeOffset` はその機能があります。値が `0` に設定されると、UTC (オフセットなし) で日付を表示します。上の例は以下のようになります。

```js
$('#edtr').igDateEditor({
	value: new Date(Date.UTC(2016, 1, 9, 10, 55, 55)),
	dateInputFormat : "dateTime",
	displayTimeOffset: 0
});
```
両方のバージョンで「2016/02/09 10:55」の値になります。ブール値ではない `displayTimeOffset` オプションは日付を UTC またはカスタム オフセットとして表示することを許可し、基本の値を変更しません。

### %%ProductNameMVC%%

17.1 バージョンへのアップグレードの変更を説明します。以前のバージョンで `DateTime` 値の処理で、%%ProductNameMVC%% がクライアントの Date をサーバー値と作成されました。
以下の例を参照してください。

```csharp
@(Html.Infragistics()
	.DateEditor()
	.DateInputFormat("dateTime")
	.Value(new DateTime(2016, 1, 9, 10, 55, 55))
	.ID("StartHour")
	.Render())
```

以上の構成でサーバーに時間を定義します。この構成はクライアントで同じ時間 (10:00) を表示します。サーバー日付がクライアント ウィジェットに新しい JavaScript `Date` を描画します。以下のようになります。
```
value: new Date(2016, 1, 9, 10, 55, 55);
```
正しい表示になりますが、クライアントでローカル日付を作成するため、基本の時間値がクライアントのタイム ゾーンに基づいて異なります。サーバーおよびクライアント値が同じ日付を表示しますが、基本の値が異なります。送信するときに予期されていない値の処理が可能です。特にクライアント値を ISO 8061 書式で UTC 値に基づいてシリアル化するデフォルトの "date" [`dataMode`](%%jQueryApiUrl%%/ui.igdateeditor#options:dataMode) を使用する場合に異なります。

そのため、17.1 以後、%%ProductNameMVC%% も ISO 8061 書式を使用してクライアント ウィジェットを正しい値と初期化し、値の送信で正しい値を確認します。後方互換性のため、ヘルパーがデフォルトでサーバー時間に基づく新しい [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) 値を出力します。たとえば、サーバーで GMT+1 の場合、上の例が以下のようにクライアントに描画されます:

```js
value: '2016-01-09T09:55:55.0000000Z',
displayTimeOffset: 60
```

クライアントに "10:55" として表示しますが、元の値が変更されずにサーバーが使用する時間と同じ時間値にマップします。

> **注:** `displayTimeOffset` は静的な値で、サマータイム用に変更しません。アプリケーションを常に GMT (サマータイムに影響ない時間) で構成されるサーバーで実行することを推薦します。それ以外の場合、各日付値のオフセット変更のための追加の手順の必要が可能になります。

## 関連トピック

クライアント日付を表示する方法の詳細については、[%%ProductName%% コントロールを別のタイム ゾーンで使用](Using-IgniteUI-controls-in-different-time-zones.html)トピックの「サーバー日付を無視してクライアント側の日付を表示」セクションを参照してください。

