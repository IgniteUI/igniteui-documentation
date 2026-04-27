<!--
|metadata|
{
    "fileName": "Using-igniteui-controls-in-different-time-zones",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# %%ProductName%% コントロールを別のタイム ゾーンで使用

## 概要
Web アプリケーションのユーザーと web サーバーのタイム ゾーンが異なる場合がよくありますが、クライアントのタイム ゾーンに合わせたサーバーの日付値または特定の時間オフセットで描画できます。サーバーとクライアント間で日付を転送する際に日付書式を適切に設定してください。このトピックでは、`igGrid`、`igDatePicker`、および `igDateEditor` の enableUTCDates プロパティをカスタマイズし、表示の制御およびタイムゾーンの異なるクライアントで日付値を編集する方法を紹介します。

## クライアント側の日付の構成

`igGrid` で有効な場合、`EnableUTCDates` オプションは、クライアント側で日付が UTC 日付として書式設定されます。日付値がサーバーから受信されたとき、日付を表示するための書式設定関数が適用されます。`enableUTCDates` が false に設定される場合、結果は標準の日付オブジェクトメソッド (getFullYear()、getMonth()、getDate()、getHours() など) によって日付値を返します。true に設定される場合、UTC のメソッド (getUTCFullYear()、getUTCMonth()、getUTCDate()、getUTCHours() など) が使用されます。したがって、オプションが有効な場合、サーバーから受信された日付は UTC に変換されます。 
 
`igDateEditor` および `igDatePicker` は、クライアントで日付を書式設定するために主にクライアントの `displayTimeOffset` に依存しますが、`enableUTCDates` はスタンドアロン エディターのシリアル化の書式に影響します。

## igGrid、igHierarchicalGrid および igTreeGrid
 
igGrid での日付処理が igDataSource で実行され、複数の動作に影響します。日付列のすべての値がデータ ソースで JavaScript Date オブジェクトとして保存されるため、常にローカル タイム ゾーンで保存されます。Date 値を持つセルの描画でグリッドが [$.ig.formatter](formatting-dates-numbers-and-strings.html) を使用します。日付列の定義 ([`dateDisplayType`](%%jQueryApiUrl%%/ui.iggrid#options:columns.dateDisplayType)) のオプションに基づいて描画が異なります。
-	`local` (デフォルト) – $.ig.formatter が展開 API のローカル バージョンを使用するため、日付をローカル タイム ゾーンで描画します。日付列のフィルターおよび更新エディターが明示的に null に設定される [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) を受け取るため、エディターが Date オブジェクトをローカル タイム ゾーンで描画して編集します。
-	`utc` – $.ig.formatter が展開 API の UTC バージョンを使用するため、Date オブジェクトを UTC で描画します。日付列のフィルターおよび更新エディターが 0 に設定される [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) を受け取るため、エディターが Date オブジェクトを UTC 変換で描画して編集します。
-	3 つ目のオプションは MVC ラッパーのシナリオでデフォルト動作ですが、ユーザーによって明示的に有効にできません。サーバー応答がオフセット メタデータを含み、column オプションが設定されない場合にトリガーします。この場合、Date が UTC 展開 API でオフセットが追加されて描画されます。サーバーでユーザーに表示される視覚化と同じ結果になります。日付列のフィルターおよび更新エディターがメタデータにあるオフセットに設定される [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) (分単位) を受け取ります。エディターが同じ Date 形式を描画して編集します。

以下は日付処理のシナリオです。
-	日付がクライアントと異なるタイム ゾーンで作成される可能なリモート バックエンドで作成される場合。(3 つ目のオプション。)
-	日付がクライアントで作成され (ローカル データ ソース)、ローカル タイム ゾーンで表示する必要がある場合。(`dateDisplayType` が `local`)

igGrid/igHierarchicalGrid/igTreeGrid は、以下のシナリオでサーバーのタイム ゾーン オフセットを使用して日付を計算します。

-	データ ソースが対応する MVC ラッパーによって処理される (Model で設定される) 場合。
-	データ ソースがリモートで、`GridDataSourceAction` 属性がリモート メソッドで使用される場合。 
その場合はタイム ゾーン オフセットがメタデータとしてデータ ソースに追加されます。このメタデータが %%ProductNameMVC%% から生成されます。例：

```js
"Metadata": {
                "timezoneOffset": 7200000,
                "timezoneOffsets": {
                    "0": {
                        "ExpirationDate": 7200000
                    },
                    "1": {
                        "ExpirationDate": 7200000
                    },
                    ...
                    }

```

日付によって別のタイプ (UTC またはローカル) が設定される可能があるので、各行の日付値のオフセットがメタデータの部分として送信されます。
>**注:** データ ソースがサーバーのタイム ゾーン オフセットについての情報を含む場合、そのオフセットはクライアントで日付の描画時に適用されます。Tグリッドが MVC ラッパーによってインスタンス化された場合、デフォルトで `dateDisplayType` の 3 つ目のオプションが使用されます。

### 詳細例:
以下のシナリオを検討します。

-	ウェブサイトは米国 (東部標準時 UTC - 5:00) でホストされます。そのサイトで日付値の列を持つ igGrid があります。日付値が米国のタイム ゾーンで作成され、書式設定は dd/MM/yyyy HH:mm:ss です。
-	シンガポールからのクライアント (UTC + 8:00) が web サイトを使用しています。
-	`dateDisplayType` は列で `utc` に設定され、タイム ゾーン オフセットがデータ ソースで使用できます。

日付がサーバーのローカル時間で作成されます。
```csharp
//10 Jan 2015 7:00 AM in Eastern Time UTC -5:00 
DateTime date = new DateTime(2015, 1, 10, 7, 0, 0, 0, DateTimeKind.Local);  

```
シンガポールでグリッド セルに同じ時間が表示されます。
![](images/igniteui_Different_Time_Zones_1.png)

任意のタイム ゾーンで同じ時間が表示されます。表示される日付はサーバーから送信された同じ日付です。

サーバーのタイム ゾーン オフセットを日付に追加し、日付の UTC 表現になります。 

上の例での計算:

東部標準時の日付「1 Jan 2015」があります。この日付は JSON に解析され、Ticks の書式で送信されます。サーバーの timezoneOffset は - 18000000 ticks (- 5:00 時) です。
 JSON データは:
 
 ```js
 {
    "Records": [{
        "ID": 0,
        "Name": "Name0",
        "ExpirationDate": "2015-01-10T05:00:00.000Z"
    }],
    "TotalRecordsCount": 0,
    "Metadata": {
        "timezoneOffset": -18000000,
        "timezoneOffsets": {
            "0": {
                "ExpirationDate": -18000000
            }
        }
    }
}
 ```

 ローカル時間に変換されたサーバーから送信された元の日付は「Jan 10 2015 20:00:00」(13 時間の差) です。その値にサーバーのタイム ゾーン オフセット (- 5:00:00) を追加します。結果を UTC (- 8:00:00) に書式設定すると、表示値は「*Jan 10 2015 7:00*」になります。
 
日付を追加/更新する場合、新しい値は UTC で保存されます。たとえば、シンガポールのユーザーが値を「10/01/2015 07:00:00」から「10/01/2015 08:00:00」に変更すると、更新トランザクションで送信される日付値は UTC の値です。送信される値はローカル時間ではなく、UTC の「10/01/2015 08:00:00」になります。
値を変更してサーバーに変更を保存した後、サーバーによって受信された値は UTC の「10/01/2015 08:00:00」です。 

![](images/igniteui_Different_Time_Zones_2.png)

## igDatePicker および igDateEditor

`igDateEditor` および `igDatePicker` に別のタイム ゾーンで日付を正しく処理するために複数のオプションがあります。以下のプロパティは、エディターが日付を表示し、正しく送信するためにシリアル化する方法を説明します。
-	[`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) - UTC からのタイム ゾーン オフセットを分単位で取得または設定します。Tクライアント側の日付値は、ローカル オフセットの代わりにこのオフセットで表示されます。ローカル オフセットがクライアント ブラウザーによって自動的に変換されます。UTC 日付を表示するには、値を 0 に設定します。
-	[`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) -  ローカル時間およびゾーン値の代わりにクライアント側の日付を UTC ISO 8061 文字列としてのシリアル化を有効/無効にします。このオプションは "date" [`dataMode`](%%jQueryApiUrl%%/ui.igdateeditor#options:dataMode) のみで適用されます。

たとえば、GMT の前の 5 時のローカル オフセットを持つクライアントからの「10:00」は、デフォルトの 'false' 値のオプションで「2016-11-11T10:00:00+05:00」としてシリアル化されます。"true" に設定される場合、日付は ISO UTC 形式を使用します: "2016-11-11T05:00:00Z"。

> **注:** `enableUTCDates` の機能が 17.1 から変更されました。
> 
> 16.2 から 17.1 へのエディター移行や enableUTCDates オプションを使用した構成については、「[17.1 で日付処理の移行](igDateEditor-migrating-date-handling-in-17-1.html)」をご覧ください。

クライアント `igDateEditor`/`igDatePicker` ウィジェットは、UTC 書式で日付をシリアル化、またはローカルタイムを含んで `enableUTCDates` オプションに基づいてオフセットできます。両値が同じ時点を参照しますが、クライアントの追加情報も持っており、サーバー プラットフォームに基づいて提出した値を解析する際に違いが発生します。たとえば、.NET [`DateTimeOffset`](https://msdn.microsoft.com/ja-jp/library/system.datetimeoffset(v=vs.110).aspx) は、クライアント オフセットを別々に処理できます。

JavaScript `Date` は、処理ですべてのタイムゾーン オフセットを無視するため常に初期値をローカル タイムに変換するため、特に [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) が定義されている場合は `igDateEditor` および `igDatePicker` に UTC 標準値に設定することを推奨します。そうでない場合、ユーザー エージェントのローカル時間に基づいて特定の値またはあいまいなタイムゾーンは予期しない時間にマップされる場合があります。

日付エディターの ASP.NET MVC ラッパーと日付の選択を使用する場合、UTC 形式を使用したシリアル化した日付のみ送信します。UTC シリアル化されたデータに加え、クライアント ウィジェットに値として設定し、MVC ラッパーがデフォルトで [`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) オプションを設定します。オフセットがサーバーローカル時間から抽出されるため、提供される値がない場合も true になります。提供した値にオフセット (`DateTimeOffset` タイプの) がある場合または `DisplayTimeOffset` が MVC ラッパー オプションに設定する場合、値は代わりにクライアントへ送信されます。

以下は、[`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) および [`enableUTCDates`](%%jQueryApiUrl%%/ui.igdateeditor#options:enableUTCDates) を使用した場合の MVC ラッパーとクライアント ウィジェットの機能の例です。

### デフォルトの動作

MVC で日付エディターを以下の構成で定義し、サーバーの値を中央ヨーロッパ標準時 (GMT+01:00) に設定します。クライアント ブラウザーが FLE 標準時 (GMT+02:00) であると仮定します。日付の選択でも同じ結果となります。

```csharp
@(Html.Infragistics()
	.DateEditor()
	.Value(new DateTime(2016, 1, 9, 10, 55, 55))
	.ID("StartHour")
	.EnableUTCDates(true)
	.DateInputFormat("dd/MM/yyyy HH:mm")
	.DateDisplayFormat("yyyy-MM-dd HH:mm")
	.PlaceHolder("Select start hour")
	.Width(280)
	.Render())
```

その場合、時間が 10 AM となり、タイムゾーンが GMT+01:00 のため MVC ラッパーが値を 2016-01-09T09:35:55.0000000Z 形式で UTC へ変換します。更に 60 分の displayTimeOffset を追加します。これは応答でラッパーによって描画されます。

```js
$('#StartHour').igDateEditor({
	value: '2016-01-09T09:35:55.0000000Z',
	displayTimeOffset: 60,
	enableUTCDates: true,
	dateInputFormat: 'dd/MM/yyyy HH:mm',
	dateDisplayFormat: 'yyyy-MM-dd HH:mm',
	placeHolder: 'Select start hour',
	width: '280' });
```

上記の構成によってエディターに以下の値を描画します。

![](images/Time_Zones_Editor_1.png)

### サーバー オフセットを無視して特定のクライアント オフセットの表示

上記は、エディター MVC ラッパーでサーバーの時間を定義した場合の例です。クライアントではサーバー時間となり、クライアント タイムゾーンのオフセットは無視されますデフォルト動作で、各クライアントでタイムゾーンの時間を表示する場合、[`displayTimeOffset`](%%jQueryApiUrl%%/ui.igdateeditor#options:displayTimeOffset) ラッパー オプションを `null` に設定する必要があります。 前の例を使用してオプションを設定し、クライアントで `displayTimeOffset` オプションが無視されて時間が特定のタイム ゾーンに従って表示されます。

```csharp
@(Html.Infragistics()
	.DateEditor()
	.Value(new DateTime(2016, 1, 9, 10, 55, 55))
	.ID("StartHour")
	.EnableUTCDates(true)
	.DisplayTimeOffset(null)
	.DateInputFormat("dd/MM/yyyy HH:mm")
	.DateDisplayFormat("yyyy-MM-dd HH:mm")
	.PlaceHolder("Select start hour")
	.Width(280)
	.Render())
```

```js
$('#StartHour').igDateEditor({
	value: '2016-01-09T09:35:55.0000000Z',
	displayTimeOffset: null,
	enableUTCDates: true,
	dateInputFormat: 'dd/MM/yyyy HH:mm',
	dateDisplayFormat: 'yyyy-MM-dd HH:mm',
	placeHolder: 'Select start hour',
	width: '280' });
```

上記の構成では、FLE 標準時 (GMT+02:00) の場合に次の値をエディターで描画します。

![](images/Time_Zones_Editor_2.png)

### EnableUTCDates オプションの構成

上記に記述した通り、ラッパーで `EnableUTCDates` を設定した場合、クライアント ウィジェットが日付をシリアル化する方法に影響します。以前の例にあるように有効にした場合、エディターが送信する値は '2016-01-09T09:35:55.000Z' となり、MVC ラッパーがクライアントへ送信する値と同じです。これはクライアントとサーバー間の標準化された通信を許可します。

MVC ラッパー設定を変更する場合:

```csharp
@(Html.Infragistics()
	.DateEditor()
	.Value(new DateTime(2016, 1, 9, 10, 55, 55))
	.ID("StartHour")
	.EnableUTCDates(false)
	.DisplayTimeOffset(null)
	.DateInputFormat("dd/MM/yyyy HH:mm")
	.DateDisplayFormat("yyyy-MM-dd HH:mm")
	.PlaceHolder("Select start hour")
	.Width(280)
	.Render())
```

送信された値は、ローカル時間とオフセットとして書式設定されます。クライアントが GMT+02:00 であるため、結果は '2016-01-09T11:35:55+02:00' となります。

### DisplayTimeOffset オプションの構成

ロシア標準時 (GMT+03:00 ) で日付を表示する場合、UTC から適切なオフセットを分単位で定義する必要があります。 

```js
@(Html.Infragistics()
	.DateEditor()
	.Value(new DateTime(2016, 1, 9, 10, 55, 55))
	.ID("StartHour")
	.EnableUTCDates(true)
	.DisplayTimeOffset(180)
	.DateInputFormat("dd/MM/yyyy HH:mm")
	.DateDisplayFormat("yyyy-MM-dd HH:mm")
	.PlaceHolder("Select start hour")
	.Width(280)
	.Render())
```

MVC ラッパーは以下の `igDateEditor` ウィジェット構成を描画します。

```js
$('#StartHour').igDateEditor({
	value: '2016-01-09T09:35:55.0000000Z',
	displayTimeOffset: 180,
	enableUTCDates: true,
	dateInputFormat: 'dd/MM/yyyy HH:mm',
	dateDisplayFormat: 'yyyy-MM-dd HH:mm',
	placeHolder: 'Select start hour',
	width: '280' });
```

以下はブラウザーの結果です。

![](images/Time_Zones_Editor_3.png)

> **注:** `displayTimeOffset` は静的な値で、サマータイム用に変更しません。そのため、オフセットのみでなく特定のゾーンをターゲットとした場合、バックエンド ロジックでターゲット日が DST に該当し、特定の日時に正しいオフセット値を提供するかどうかを確認します。.NET で `DisplayTimeOffset` タイプが使用でき、MVC エディター ラッパーで自動的に処理できます。
