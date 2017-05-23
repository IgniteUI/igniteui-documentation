<!--
|metadata|
{
    "fileName": "igscheduler-configure-appointments",
    "controlName": "igScheduler",
    "tags": ["appointments"]
}
|metadata|
-->

# 予定の構成 (igScheduler)


## 目的

このトピックは、`igScheduler` コントロールで予定をバインド、作成、更新、および削除する方法を紹介します。

## 概要

予定は、指定した時間で開始し、指定した時間で終了するイベントを表します。予定はリソースと関連付けが可能です。

## Appointment オブジェクトのプロパティ

以下の表は、Appointment の主なプロパティとその使用目的を示します。

プロパティ|	目的 
---|---
id|このプロパティは、その他の予定からこの予定を識別します。一意にする必要があります。 | 
subject |この `string` 型プロパティは、アクティビティの短い説明です。コントロールのビューで表示される主な情報です。特定の予定をその他の予定から識別するために使用されます。
location|この `string` 型プロパティは、予定の場所を指定します。
start|この `Date` 型プロパティは、予定の開始日時を含みます。
end|この `Date` 型プロパティは、予定の終了日時を含みます。
resourceId |このプロパティは、現在の予定をリソースと関連付けるために使用されます。

### コード例

予定は `ScheduleListDataSource` の appointmentItemsSource に渡される [$.ig.DataSource](%%jQueryApiUrl%%/ig.datasource) のインスタンスです。

```javascript
var appointments = [{
        "id": 11,
        "start": new Date(currentYear, currentMonth, 2, 6, 45),
        "end": new Date(currentYear, currentMonth, 3, 6, 45),
        "subject": "Marketing conference",
		"resourceId": 1
    },
    {
        "id": 5,
        "end": new Date(currentYear, currentMonth, 3, 12, 45),
        "start": new Date(currentYear, currentMonth, 3, 13, 45),
        "subject": "Dentist appointment"
		"resourceId": 6
    },
    {
        "id": 10,
        "start": new Date(currentYear, currentMonth, 4, 8),
        "end": new Date(currentYear, currentMonth, 4, 8, 30),
        "subject": "Distributions sync",
        "description": "Sync with distributions team"
		"resourceId": 11
    }
],
scheduleListDataSource = new $.ig.scheduler.ScheduleListDataSource();

scheduleListDataSource.appointmentItemsSource(resources);

$("#scheduler").igScheduler({
    height: "650px",
    width: "100%",
    dataSource: scheduleListDataSource
});

```

## ID によって予定の検索

予定は、[getAppointmentById](%%jQueryApiUrl%%/ui.igscheduler#methods:getAppointmentById) メソッドを使用してアクセスできます。

### コード例

```javascript
var appointment = $("#scheduler").igScheduler("getAppointmentById", 4);
```

## API で予定の追加

予定は、予定オブジェクトを引数として渡して [createAppointment](%%jQueryApiUrl%%/ui.igscheduler#methods:createAppointment) メソッドで追加できます。

### コード例

```javascript
var appointment = $("#scheduler").igScheduler("createAppointment", {
    id: 1,
    subject: "Some subject",
    location: "Somewhere",
    start: new Date(2017, 04, 05, 12, 30),
    end: new Date(2017, 04, 05, 12, 30),
    resourceId: 4,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
});
```

## API で予定を編集

予定は、予定オブジェクトおよび変更するプロパティを含むオブジェクトを引数として渡して [editAppointment](%%jQueryApiUrl%%/ui.igscheduler#methods:editAppointment) メソッドで編集できます。

### コード例

```javascript
var appointment = var appointment = $("#scheduler").igScheduler("getAppointmentById", 4);

$("#scheduler").igScheduler("editAppointment", appointment, {
    subject: "Some subject",
    location: "Somewhere",
    start: new Date(2017, 04, 05, 12, 30),
    end: new Date(2017, 04, 05, 12, 30),
    resourceId: 4,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
});
```

## API で予定を削除

予定は、予定オブジェクトを引数として渡して [deleteAppointment](%%jQueryApiUrl%%/ui.igscheduler#methods:deleteAppointment) メソッドで削除できます。

### コード例

```javascript
var appointment = var appointment = $("#scheduler").igScheduler("getAppointmentById", 4);

$("#scheduler").igScheduler("deleteAppointment", appointment);
```

## 関連トピック

トピック|目的
---|---
[予定の構成 (igScheduler)](igScheduler-Configure-Appointments.html)|このトピックは、`igScheduler` の Appointments DataSource リストを設定して構成する方法を紹介します。
[ビューの構成 (igScheduler)](igScheduler-Configure-Views.html): このセクションのトピックは、予定表のデータを表示する `igScheduler` コントロールで使用されるビューについての情報を提供します。
