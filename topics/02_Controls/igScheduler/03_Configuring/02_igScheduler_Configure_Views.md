<!--
|metadata|
{
    "fileName": "igscheduler-configure-views",
    "controlName": "igScheduler",
    "tags": ["views"]
}
|metadata|
-->

# ビューの構成 (igScheduler)


## 目的

このセクションのトピックは、予定表のデータを表示する `igScheduler` コントロールで使用されるビューについての情報を提供します。

## 概要

igScheduler コントロールは、「ビュー」と呼ばれる方法でカレンダー情報を表示するために構成できます。ビューの週類は [ViewMode](%%jQueryApiUrl%%/ui.igscheduler#options:viewMode) オプションを使用して構成できます。

## 前提条件

トピック|	目的
---|---
[概要 (igScheduler)](igScheduler-Overview.html) |このトピックでは、機能、構成、要件、テーマなど、`igScheduler`™ コントロール関連の概念について説明します。
[予定の構成 (igScheduler)](igScheduler-Configure-Appointments.html)|このトピックは、`igScheduler` の Appointments DataSource リストを設定して構成する方法を紹介します。
 [リソースの構成 (igScheduler)](igScheduler-Configure-Resources.html)|このセクションのトピックでは、`igScheduler` コントロールのリソース概念について説明します。

## 予定一覧ビュー

このトピックは、`igScheduler` の予定一覧でデータの表示方法を説明します。

### 構成

以下の表は、予定一覧の構成可能な要素または動作をオプションにマップします。

要素|説明|オプション
---|---|---
表示日の数|予定一覧で日の数を構成します。|[dateRangeInterval](%%jQueryApiUrl%%/ui.igscheduler#options:agendaViewSettings.dateRangeInterval)

以下の表は、ユーザー操作をコントロールで発生したイベントにマップします。

ユーザー インタラクション|説明|イベント
---|---|--
範囲を変更した後|[前へ] および [次へ] ボタンによって予定一覧ビューの範囲が変更した後に発生されます。|[agendaRangeChanged](%%jQueryApiUrl%%/ui.igscheduler#events:agendaRangeChanged)
範囲の変更|[前へ] および [次へ] ボタンによって予定一覧ビューの範囲が変更する前に発生されます。|[agendaRangeChanging](%%jQueryApiUrl%%/ui.igscheduler#events:agendaRangeChanging)

## 月単位の表示

このトピックは、igScheduler の月ビューでデータの表示方法を説明します。

### 構成

以下の表は、月ビューの構成可能な要素または動作をオプション/メソッドにマップします。

要素|説明|プロパティ
---|---|---
予定一覧で表示される予定|MonthView の AgendaView で表示される予定のスコープ。|[agendaVisibilityType](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.agendaVisibilityType)
予定インジケーターのモード|MonthView 日で予定が表示されるコンテンツのタイプ。|[appointmentMode](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.appointmentMode)
予定一覧の表示状態|MonthView で AgendaView の表示状態を制御します。有効な場合、MonthView は、Appointments のリストの上にある選択されている日の Appointments を表示する AgendaView を表示します。|[isAgendaVisible](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isAgendaVisible)
水平方向のセパレーター|MonthView の週の間の水平セパレーターの表示状態を制御します。|[isHorizontalSeparatorVisibile](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isHorizontalSeparatorVisibile)
次の月の日の表示状態|特定の月の最後の週にある以後の月の日の表示状態を制御します。|[isNextMonthShown](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isNextMonthShown)
以前の月の日の表示状態|特定の月の最初の週にある以前の月の日の表示状態を制御します。|[isPreviousMonthShown](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isPreviousMonthShown)
日の間の垂直方向のセパレーター|MonthView の曜日の間の垂直セパレーターの表示状態を制御します。|[isVerticalSeparatorVisibile](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isVerticalSeparatorVisibile)
曜日名の表示状態|MonthView で曜日名の表示状態を制御します。|[isWeekdayVisible](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isWeekdayVisible)
週番号の表示状態|MonthView で週番号の表示状態を制御します。|[isWeekNumberVisible](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.isWeekNumberVisible)
予定一覧と月ビューの分割の方向|MonthView および AgendaView が垂直方向または水平方向に分割されるかどうかを決定する方向を制御します。このオプションは、AgendaView が MonthView で表示される場合に使用可能です。| [viewSplitOrientation](%%jQueryApiUrl%%/ui.igscheduler#options:monthViewSettings.viewSplitOrientation)

## Week View

This topic explains how data is presented in the igScheduler's week view.

### Configuring

The following table maps some configurable aspect/behavior of the week view to the corresponding property/method:

Aspect | Description | Property
---|---|---
Display mode | The week view can be configured to show all 7 week days or only the days configured as working days. | [weekViewDisplayMode](%%jQueryApiUrl%%/ui.igscheduler#options:weekViewSettings.weekViewDisplayMode)
Time slot duration | Configure the time slots' duration. Currently 5, 6, 10, 15, 30 and 60 minutes are supported. | [timeSlotInterval](%%jQueryApiUrl%%/ui.igscheduler#options:weekViewSettings.timeSlotInterval)
Working days and hours | You can configure this view to display only working hours or all 24 hours. | [workingHoursDisplayMode](%%jQueryApiUrl%%/ui.igscheduler#options:weekViewSettings.workingHoursDisplayMode)

## Day View

This topic explains how data is presented in the igScheduler's day view.

### Configuring

The following table maps some configurable aspect/behavior of the day view to the property/method that is responsible for:

Aspect | Description | Property
---|---|---
Visible days | You can control how many days are visible at a time in the day view. Currently between 1 and 7 days are supported. | [dayViewNumberOfDays](%%jQueryApiUrl%%/ui.igscheduler#options:dayViewSettings.dayViewNumberOfDays)
Time slot duration | Configure the time slots' duration. Currently 5, 6, 10, 15, 30 and 60 minutes are supported. | [timeSlotInterval](%%jQueryApiUrl%%/ui.igscheduler#options:dayViewSettings.timeSlotInterval)
Working days and hours | You can configure this view to display only working hours or all 24 hours. | [workingHoursDisplayMode](%%jQueryApiUrl%%/ui.igscheduler#options:dayViewSettings.workingHoursDisplayMode)

## 関連トピック

トピック|目的
---|---
[予定の構成 (igScheduler)](igScheduler-Configure-Appointments.html)|このトピックは、`igScheduler` の Appointments DataSource リストを設定して構成する方法を紹介します。
[リソースの構成 (igScheduler)](igScheduler-Configure-Resources.html)|このトピックは、予定の Resources リストを追加して構成する方法を紹介します。
