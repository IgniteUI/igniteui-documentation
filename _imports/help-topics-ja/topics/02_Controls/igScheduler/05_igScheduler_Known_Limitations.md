<!--
|metadata|
{
    "fileName": "igscheduler-known-limitations",
    "controlName": "igScheduler",
    "tags": ["Known Issues","Tips and Tricks"]
}
|metadata|
-->

# 既知の問題と制限 (igScheduler)


## 既知の問題点と制限の概要


### 既知の問題点と制約の概要表

以下の表で、`igScheduler`™ コントロールの既知の問題と制限を簡単に説明します。以下の表は、一部の問題の詳細な説明とその回避策を示します。

凡例|説明 |
---|---|---
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策なし
![](images/plannedFix.png) | 既知の回避策はありません。修正予定です。

以下は、`igScheduler` ウィジェットの最初バージョンの制限がリストされます。

問題|説明|状態
---|---|---
[タイム ゾーンのオフセット](#NoTimeZoneOffsetting) |時間が常にブラウザー オフセットで表示されます。|![](images/negative.png)
[カスタム色スキーマ](#NoCustomColorScheme) |定義済みのカスタム色スキーマが使用されます。 |![](images/negative.png)
[テンプレート化](#NoTemplating) |予定の外観のテンプレート化および変更がサポートされません。 |![](images/negative.png)
[カレンダー (Canvas) の予定の ARIA サポート](#ARIASupport) |カレンダー (Canvas) の予定の ARIA サポートがありません。 |![](images/negative.png)
[週の最初の曜日設定](#FirstDayOfWeek) |週の最初の曜日は常に `Sunday` に設定されます。 |![](images/negative.png)
[リモート データ ソースの使用がサポートされない](#remoteDS) |ローカル データ ソースを使用してください。 |![](images/negative.png)
[スワイプ ジェスチャのサポート](#SwipeGesture) |スワイプ ジェスチャのサポートがありません。 |![](images/negative.png)
[予定ポップオーバーへの Tab ナビゲーション](#NavigationToAppointmentPopover) |予定ポップオーバーへの Tab ナビゲーションがありません。 |![](images/negative.png)
[サポートされる最小幅は 320 px](#MinWidthSupport) |モバイル デバイスでサポートされる最小幅は 320 px です。 |![](images/negative.png)
[%%ProductNameMVC%% で views オプションの設定](#MVCWrappers) | ASP.NET MVC MVC で views オプションの設定に影響しません。  |![](images/plannedFix.png)


## 既知の問題点と制限の詳細

### <a id="NoTimeZoneOffsetting"></a>タイム ゾーン オフセット設定がない

`igScheduler` の時間が常にブラウザー オフセット (時) で表示されます。このリリースでは、スケジューラがブラウザーのタイム ゾーンと違うゾーンで時間の表示をサポートしません。

### <a id="NoCustomColorScheme"></a>カスタム色スキーマがない

スケジューラで 12 色の定義済みの色スキーマが提供されますが、エンド ユーザーは変更できません。

![](images/preDefinedColors.png)

### <a id="NoTemplating"></a>テンプレート

現在テンプレートによるスケジューラのイベントの外観のカスタマイズはサポートされません。

### <a id="ARIASupport"></a>igScheduler の ARIA サポート
スケジューラの予定が canvas で視覚化されるため、画面リーダーによって処理できません。アクセシビリティのために igGrid などで選択した予定を別にリストできます。

以下は、スケジューラに含まれるウィジェットで実装される WAI-ARIA サポートについての詳細へのリンクです。

- [igDatePicker](igdatepicker-accessibility-compliance.html#wai-aria)
- [igDateEditor](igdateeditor-accessibility-compliance.html#wai-aria)
- [igTextEditor](igtexteditor-accessibility-compliance.html#wai-aria)

### <a id="FirstDayOfWeek"></a>週の最初の曜日設定がない

週の最初の曜日として日曜日がデフォルトで使用されます。別の日 (月曜日など) を設定するためのオプションを公開しません。

### <a id="remoteDS"></a>リモート データ ソースのバインド機能の制限
igScheduler はローカル データ ソースのみを処理します。

### <a id="SwipeGesture"></a>スワイプ ジェスチャ機能の制限

`igScheduler` は`左へのスワイプ`または`右へのスワイプ`などの操作のスワイプ ジェスチャ サポートがありません。

### <a id="NavigationToAppointmentPopover"></a>予定ポップオーバーへの Tab ナビゲーション機能の制限

キーボードによって予定の`タブ ナビゲーション`および`選択`のアクセシビリティ制限があります。

### <a id="MinWidthSupport"></a>サポートされる最低幅は 320 px (モバイル環境)

モバイル デバイスで `igScheduler` のサポートされる最小解像度は `320 px` です。

以後のリリースで、最小解像度に到達した場合に表示されるメッセージを追加します。

### <a id="MVC"></a>%%ProductNameMVC%% views オプションの制限

%%ProductNameMVC%% で公開される `views` オプションを使用して初期化されるビュー (`Agenda`、`Week`、`Day`、`Month`) を制御できません。次バージョンのスケジューラで実際予定です。

