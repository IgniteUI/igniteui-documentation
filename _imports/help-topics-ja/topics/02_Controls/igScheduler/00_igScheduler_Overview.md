<!--
|metadata|
{
    "fileName": "igScheduler-overview",
    "controlName": "igScheduler",
    "tags": ["Editing","Getting Started"]
}
|metadata|
-->

# igScheduler の概要

## トピックの概要

### 目的

このトピックでは、機能、構成、要件、テーマなど、`igScheduler`™ コントロール関連の概念について説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

- [最低必要条件](#minimum-requirements)

- [主要機能](#main-features)
    - [ビュー](#views)
        - [予定一覧ビュー](#agenda-view)
        - [月表示](#month-view)
		- [週表示](#week-view)
        - [日表示](#day-view)
    - [アクティビティ](#activities)
        - [予定](#appointments)

- [データ ソースにバインド](#binding-to-data-source)

- [関連トピック](#related-topics)

### 前提条件

以下の表は、このトピックを理解するために必要な前提条件です。

**トピック**

まず以下のトピックを読む必要があります。

-	[%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

-	[%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)

-	[%%ProductName%% でスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)


**外部リソース**

あらかじめ [jQuery ウィジェットの使用](http://learn.jquery.com/jquery-ui/getting-started/) を読んでおくことをお勧めします。

## <a id="minimum-requirements"></a>最低必要条件

### 概要

`igScheduler` コントロールは jQuery UI ウィジェットの 1 つであるため、jQuery コアと jQuery UI JavaScript ライブラリに依存します。また、`igScheduler` コントロールが機能の共有やデータのバインドを行うために使用する %%ProductName%%™ JavaScript リソースもいくつかあります。`igScheduler` コントロールをピュア JavaScript コンテキストの中でのみ使用するかどうかに関係なしでこうした JavaScript の参照が必要になります。

### 要件

下の表は、`igScheduler` コントロールの要件をまとめたものです。

<table class="table">
	<thead>
		<tr>
			<th>要件</th>
			<th>説明</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>jQuery および jQuery UI JavaScript リソース</td>
			<td>%%ProductName%% はこれらのフレームワークの最上部に構築されます。
				<ul>
					<li>[jQuery](http://jquery.com) (igScheduler の必要な jQuery バージョンは 1.8.3 です)</li>
					<li>[jQuery UI](http://jqueryui.com/) (igScheduler の必要な jQuery UI バージョンは 1.9.2 です)</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>共有の %%ProductName%% JavaScript 参照</td>
			<td>%%ProductName%% には、ほとんどのウィジェットが使用する共用 JavaScript リソースがいくつかあります。
				<ul>
					<li>infragistics.util.js</li>
					<li>infragistics.util.jquery.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igDataSource JavaScript リソース</td>
			<td>igScheduler は igDataSource を使用してデータ操作を行います。
				<ul>
					<li>infragistics.dataSource.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>igScheduler JavaScript リソース</td>
			<td>igScheduler ウィジェット用の JavaScript ファイル:
				<ul>
					<li>infragistics.ui.scheduler.js</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>IG テーマ</td>
			<td>このテーマには、%%ProductName%% 向けに作成されたカスタム ビジュアル スタイルが含まれます。</td>
		</tr>
		<tr>
			<td>ベース テーマ</td>
			<td>基本テーマには、主に各ウィジェットのフォームと機能を定義するスタイルが含まれています。</td>
		</tr>
	</tbody>
</table>

## <a id="main-features"></a>主要機能

### 機能の概要

下の表は、`igScheduler` の主要機能を簡潔にまとめたものです。

<table class="table">
    <tbody>
        <tr>
            <th>機能</th>
            <th>説明</th>
        </tr>
        <tr>
            <td>ビュー</td>
            <td>igScheduler で予定一覧、月表示、週表示、および日表示を使用するために構成できます。同時または別に使用できます。</td>
        </tr>
        <tr>
            <td>アクティビティ</td>
            <td>アクティビティは、指定した時間で開始し、指定した時間で終了するイベントを表します。</td>
        </tr>
    </tbody>
</table>

### <a id="views"></a>ビュー

`igScheduler` コントロールは、「ビュー」と呼ばれる方法でカレンダー情報を表示するために構成できます。ビューの種類は `views` および `viewMode` オプションを使用して構成できます。

```js
$("#scheduler").igScheduler({
    height: "100%",
    width: "100%",
    views: ["month", "agenda", "week", "day"],
    viewMode: "monthView"
});
```


#### <a id="agenda-view"></a>予定一覧ビュー
`igScheduler` の予定一覧ビューは、指定した時間範囲にあるアクティビティを視覚化します。アクティビティは件名、場所、および時間と予定一覧ビューで表示されます。アクティビティに関連付けられたリソースがあり、リソースに色スキーマが設定される場合、この色がアクティビティの時間およびアクティビティの件名の間の垂直セパレーターの描画で使用されます。

以下の画像は、予定一覧ビューおよびその視覚要素を表示します。

![](images/agendaView.png)

1. 日ヘッダー

2. アクティビティの件名

3. アクティビティの場所

4. 関連付けられたリソースの色で描画されるセパレーター

5. アクティビティの開始時間 (アクティビティが指定した日で開始する場合)

6. アクティビティの終了時間 (アクティビティが指定した日で終了する場合)

#### <a id="month-view"></a>月表示
`igScheduler` の月表示は月全体の日を視覚化します。各日は最大 3 つのアクティビティを含むセルに表示されます。月表示も「選択日」の概念があります。選択日は別のスタイル設定 (前景色、背景色、フォント サイズ、フォント スタイルなど) で表示されます。

以下の画像は、月表示およびその視覚要素を表示します。

![](images/monthView.png)

1. 月ヘッダー (月および年を含む)

2. 曜日ヘッダー

3. 週番号

4. 先頭日 (以前の月の日)

5. 後続日 (次の月の日)

6. 現在の日 (別のスタイルで表示)

7. アクティビティ インジケーターインジケーターがアクティビティを持つ日で描画されます。描画されるアクティビティ インジケーターの最大数は 3 です。インジケーターは関連リソースの色セットで描画されます。

8. 現在の月の日


以下の画像は、月表示、予定一覧ビュー、およびその視覚要素を表示します。

![](images/agendaWithMonthView.PNG)

1. アクティビティの件名

2. アクティビティの場所

3. このアクティビティと関連するリソースの色

4. このアクティビティと関連する時間

#### <a id="week-view"></a>週表示

`igScheduler` の週表示は、選択されている日に基づいて 7 日を表示します。このビューは、予定の時間範囲に基づいて別の高さを持つ同じ長さの時間帯セグメントを含みます。


以下の画像は、週表示およびその視覚要素を示します。

1. ナビゲーション ヘッダー
2. 時間帯
3. 日ヘッダー
4. 時間帯のアクティビティ

![](images/weekView.PNG)

以下のプロパティを使用すると、週表示の要素および動作を構成できます。

-	`weekViewDisplayMode` - 表示モード。週表示はすべての 7 日または稼動日として構成される日のみを表示できます。

-	`timeSlotInterval` - 時間帯の期間。時間帯の期間を構成します。現在 5、6、10、15、30、および 60 分がサポートされます。

-	`workingHoursDisplayMode` - 稼動日および稼働時間。このビューを稼働時間またはすべての 24 時間を表示するために構成できます。

#### <a id="day-view"></a>日表示

選択された日の時間レベルのビューを表示します。時間は垂直方向に上から下へ配置されます。このビューは、予定の時間範囲に基づいて別の高さを持つ同じ長さの時間帯セグメントを含みます。

以下の画像は、日表示およびその視覚要素を示します。

1. ナビゲーション ヘッダー
2. 時間帯
3. 日ヘッダー
4. 時間帯のアクティビティ

![](images/dayView.PNG)

以下のプロパティを使用すると、日表示の要素および動作を構成できます。

-	`dayViewDisplayMode` - 表示日。日表示で表示される日数を制御できます。現在 1 日から 7 日間がサポートされます。

-	`timeSlotInterval` - 時間帯の期間。時間帯の期間を構成します。現在 5、6、10、15、30、および 60 分がサポートされます。

-	`workingHoursDisplayMode` - 稼動日および稼働時間。このビューは、稼働時間または全 24 時間を表示するために構成できます。

#### トピック

-	[igScheduler の追加](igscheduler-adding-igscheduler.html)

#### 関連サンプル

-   [igScheduler 予定一覧ビュー](%%SamplesUrl%%/scheduler/agenda-view)

### <a id="activities"></a>アクティビティ

このセクションは、igScheduler コントロールのアクティビティ概念について説明します。

アクティビティは、指定した時間で開始し、指定した時間で終了するイベントを表します。


## <a id="appointments"></a>予定

アクティビティは、複数の時、日、またはそれより長い期間があります。

以下の表は、Appointment の主なプロパティおよび目的を説明します。

<table class="table">
	<thead>
		<tr>
			<th>フィールド</th>
			<th>目的</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>件名</td>
			<td>アクティビティの短い説明です。コントロールのビューで表示される主な情報です。特定のアクティビティをその他のアクティビティから識別するために使用されます。
			</td>
		</tr>
        <tr>
			<td>場所</td>
			<td>アクティビティの場所を指定します。
			</td>
		</tr>
        <tr>
			<td>開始日付</td>
			<td>
            アクティビティの開始日時を含みます。
			</td>
		</tr>
        <tr>
			<td>終了日付</td>
			<td>アクティビティの終了日時を含みます。
			</td>
		</tr>
        <tr>
			<td>リソース</td>
			<td>
            現在のアクティビティと関連付けられたリソースを取得します。色スキーマは、このリソースと関連するアクティビティを強調表示するために使用されます。
			</td>
		</tr>
        <tr>
			<td>説明</td>
			<td>
            予定についての情報を提供します。
			</td>
		</tr>
	</tbody>
</table>

![](images/newAppointment.png)


#### 関連サンプル
-   [igScheduler 予定一覧ビュー](%%SamplesUrl%%/scheduler/appointment-indicators)


## <a id="binding-to-data-source"></a>データ ソースにバインド


### データ ソースへのバインドに関する概要

`igScheduler` の `dataSource` および `resources` オプションはデータ バインディングに必須です。各オプションを対応する予定またはリソース コレクションを持つ配列に割り当てる必要があります。
詳細については、「[予定の構成](igscheduler-configure-appointments.html)」および「[リソースの構成](igscheduler-configure-resources.html)」トピックを参照してください。

## <a id="related-topics"></a>関連トピック


以下は、その他の役立つトピックです。

-   [%%ProductName%% の概要](IgniteUI-for-jQuery-Overview.html)

-   [%%ProductName%% で JavaScript リソースの使用](Deployment-Guide-JavaScript-Resources.html)

-   [%%ProductName%% でスタイル設定とテーマ設定](Deployment-Guide-Styling-and-Theming.html)

-   [igScheduler の概要](igScheduler-Overview.html)

-   [igScheduler の構成](igscheduler-configuring.html)

-   [予定の構成](igscheduler-configure-appointments.html)

-   [リソースの構成](igscheduler-configure-resources.html)

-	[igScheduler の追加](igscheduler-adding-igscheduler.html)

-	[igScheduler の構成](igscheduler-Configuring.html)

-	[igScheduler のスタイル設定](igscheduler-using-themes.html)

-	[アクセシビリティの遵守 (igScheduler)](igscheduler-accessibility-compliance.html)

-	[既知の問題と制限 (igScheduler)](igscheduler-known-limitations.html)


