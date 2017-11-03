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

This topic explains the concept of the appointments in the `igScheduler` control and provides examples on how to bind and perform CRUD operations  with those appointments.

## 概要

予定は、指定した時間で開始し、指定した時間で終了するイベントを表します。The appointment can be associated with a resource, which means that the resource (a kind of entity, for example a person) is the owner of the activity represented by that appointment.

It is important to note that the scheduling control is built by the `igSchedulerCore` and the `igScheduler` controls. The `igSchedulerCore` is the engine and the `igScheduler` runs the user interface.

The `igScheduler` works with appointments that are simple JSON objects, containing only the properties listed in the [Appointment object properties section](#appointment-properties). The collection of appointments, assigned to the `dataSource` option by the developer, needs to contain this type of appointments.

At the same time the `igSchedulerCore` maps these objects to another type of appointment objects. In comparison to the other type of appointments, the appointments of the `igSchedulerCore` do not contain the properties listed in the [Appointment object properties section](#appointment-properties), but expose getter and setter methods with the same name and more. Please refer to [Appointment object methods section](#appointment-properties) below for more information.

The crossing point between those type are the events triggered on user interactions with the `igScheduler`. Attaching to a certain event, the developer may access the appointment that is being created, edited, etc. However, the developer may need to call .dataObject() in order to retrieve a simple JSON object representing the activity, and this JSON object then may be passed to other methods to work with it.

### Code example

The developer access the appointment that is created and then programatically creates the same event for a different location:

```javascript
$("#scheduler").igScheduler({
	dataSource: appointments,
	resources: resources,
	appointmentCreated: function (evt, ui) {
		console.log(ui.appointment.dataObject());
        ui.appointment.dataObject().location = "London";
        ui.owner.createAppointment(ui.appointment.dataObject());
	},
```

##<a id="appointment-properties"></a> Appointment オブジェクトのプロパティ

以下の表は、Appointment の主なプロパティとその使用目的を示します。

プロパティ|	目的 
---|---
id|このプロパティは、その他の予定からこの予定を識別します。一意にする必要があります。 | 
subject |この `string` 型プロパティは、アクティビティの短い説明です。コントロールのビューで表示される主な情報です。特定の予定をその他の予定から識別するために使用されます。
location|この `string` 型プロパティは、予定の場所を指定します。
start|この `Date` 型プロパティは、予定の開始日時を含みます。
end|この `Date` 型プロパティは、予定の終了日時を含みます。
resourceId |このプロパティは、現在の予定をリソースと関連付けるために使用されます。
recurrence | This property holds the recurrence pattern for the appointment.

##<a id="appointment-properties"></a> Appointment object methods

The following table lists the Appointment's key methods and their purpose:

Property |	Purpose 
---|---
id | Gets the `id` property value that is used to distinguish this activity amongst all other appointments. | 
subject | Gets/sets the `subject` property value that is used as short description of the activity.
location| Gets/sets the `location` property value that stores where the activity takes place.
start | Gets/sets the `start` property value that contains the start date and time of the appointment.
end | Gets/sets the `end` property value that contains the end date and time of the appointment.
resourceId | Gets/sets the `resourceId` property value that is used to associate the current appointment with a resource.
resource | Gets the resource object that is associated with the current appointment with.
recurrence | Gets/sets the `recurrence` property value that holds the recurrence pattern.
recurrenceId | Returns the `ID` of the root recurrence activity or null if the activity is not associated with a recurrence.
isRecurrenceRoot | Returns a boolean indicating whether this appointment is a recurrence root activity.
recurenceRoot | Returns the recurrence root activity or null if the appointment is not associated with a reccurence.
dataObject | Returns a simple JSON object with the properties listed in the [Appointment object properties section](#appointment-properties)

### コード例

The appointments are a collection of JSON objects, containing all or some of the appointment`s properties:

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

$("#scheduler").igScheduler({
    height: "650px",
    width: "100%",
    dataSource: appointments
});

```

## Getting all appointments in time range

A collection of all appointments for the given time range can be retrieved by the [getAppointmentsInRange method](%%jQueryApiUrl%%/ui.igscheduler#methods:getAppointmentsInRange)

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
$("#scheduler").igScheduler("deleteAppointment", appointment);
```

## 関連トピック

トピック|目的
---|---
[予定の構成 (igScheduler)](igScheduler-Configure-Appointments.html)|このトピックは、`igScheduler` の Appointments DataSource リストを設定して構成する方法を紹介します。
[ビューの構成 (igScheduler)](igScheduler-Configure-Views.html)|このセクションのトピックは、予定表のデータを表示する `igScheduler` コントロールで使用されるビューについての情報を提供します。
