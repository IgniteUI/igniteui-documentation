<!--
|metadata|
{
    "fileName": "ignumericeditor-known-issues",
    "controlName": "igEditors",
    "tags": ["Editing","Known Issues"]
}
|metadata|
-->

# igNumericEditor の既知の問題


##既知の制約事項

- 数値エディターは編集モードでは、グループ、または 1000 のセパレーターおよび記号をサポートしません。
- [`minValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:minValue) または [`maxValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxValue) オプションを設定せずに [`spinWrapAround`](%%jQueryApiUrl%%/ui.ignumericeditor#options:spinWrapAround) を true に設定した場合、データモードで設定したデフォルトの上限に達したときにスピンをラップできません。これは [`dataMode`](%%jQueryApiUrl%%/ui.ignumericeditor#options:dataMode) オプションを float、long、または double の値に設定した場合です。
この動作の原因は、JavaScript でデータモードの最大値が指数表記で表される大きな数値であることです。
この制限を回避するには、[`maxValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:maxValue) および [`minValue`](%%jQueryApiUrl%%/ui.ignumericeditor#options:minValue) を JavaScript の指数表記を使用しない数値に設定します。あるいは、数値エディター、パーセント エディター、または通貨エディターで [`scientificFormat`](%%jQueryApiUrl%%/ui.ignumericeditor#options:scientificFormat) オプションを有効にしてください。

## 関連リンク
- [igNumericEditor の概要](igNumericEditor-Overview.html)
