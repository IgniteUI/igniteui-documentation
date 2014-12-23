<!--
|metadata|
{
    "fileName": "toggleswitch-property-reference",
    "controlName": "ToggleSwitch",
    "tags": ["API","Editing"]
}
|metadata|
-->

# ToggleSwitch プロパティ参照

## Toggle Switch のプロパティ参照

このトピックでは、`Toggle Switch` ウィジェットのプロパティに関する参照情報を提供します。

以下の表では、`Toggle Switch` MVC ラッパーのプロパティについて説明し、デフォルト値を示しています。

>**注:**
> デフォルトで null 値を持つプロパティでは、jQuery モバイル フレームワークのデフォルト設定でウィジェットを描画します。このため、この表に示されたすべてのデフォルトの状態は、記載時のものであり、予告なく変更される場合があります。最新のデフォルト設定を確認するには、[Toggle Switch の反転](http://view.jquerymobile.com/1.3.1/dist/demos/widgets/sliders/switch.html)を参照してください。



### Toggle Switch (プロパティ参照チャート)

<table class="table table-striped">
    <thead>
        <tr>
            <th>
プロパティ
            </th>
            <th>
タイプ
            </th>
            <th>
説明
            </th>
            <th>
デフォルト値
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
[OnText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OnText.html)
            </td>
            <td>
文字列
            </td>
            <td>
スイッチが有効な状態でユーザーに表示されるテキスト。
            </td>
            <td >
*On*
            </td>
        </tr>
        <tr>
            <td>
[OffText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~OffText.html)
            </td>
            <td>
文字列
            </td>
            <td>
スイッチが無効な状態でユーザーに表示されるテキスト。
            </td>
            <td >
*Off*
            </td>
        </tr>
        <tr>
            <td>
[Width](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Width.html)
            </td>
            <td>
文字列
            </td>
            <td>
`Toggle Switch` の幅 (ピクセル数)(このプロパティを変更すると、`Toggle Switch` を保持する div の幅が再定義されます)。
            </td>
            <td >
*null*
            </td>
        </tr>
        <tr>
            <td>
[SwitchedState](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~SwitchedState.html)
            </td>
            <td>
bool?
            </td>
            <td>
スイッチの状態 (有効または無効)。`Toggle Switch` のデフォルトの状態は無効です。
            </td>
            <td >
*null*
            </td>
        </tr>
        <tr>
            <td>
[Theme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Theme.html)
            </td>
            <td>
文字列
            </td>
            <td>
`Toggle Switch` の主要テーマ。主要テーマによって、トラック (スイッチを表す円) を除き、ウィジェットに関するあらゆるスタイルが設定されます。
            </td>
            <td >
*null*
            </td>
        </tr>
        <tr>
            <td>
[TrackTheme](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~TrackTheme.html)
            </td>
            <td>
文字列
            </td>
            <td>
`Toggle Switch` のトラック テーマ。トラック テーマによって、ウィジェットのトラック (スイッチを表す円) のスタイルが設定されます。
            </td>
            <td>
*null*
            </td>
        </tr>
        <tr>
            <td>
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Disabled.html)
            </td>
            <td>
bool?
            </td>
            <td>
*true* の場合、スイッチのユーザー操作が無効 (読み取り専用モード) になります。デフォルトでは、`Toggle Switch` はユーザー操作が可能 (編集モード) です。
            </td>
            <td>
*null*
            </td>
        </tr>

        <tr>
            <td>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Label.html)
            </td>

            <td>
文字列
            </td>
            <td>
`Toggle Switch` のラベルのテキスト(コード内では、フォーム要素の前に示されます)。デフォルトでは、`Toggle Switch` にはラベルは表示されません。
            </td>
            <td >
*null*
            </td>
        </tr>
        <tr>
            <td>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~LabelAlignment.html)
            </td>
            <td>
[Infragistics.Web.Mvc.Mobile.Alignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.Alignment.html)
            </td>
            <td>
ラベルの配置 (ラベルが表示されている場合)。有効な値：
                <ul>
                    <li>
*Left*
                    </li>
                    <li>
*Right*
                    </li>
                    <li>
*Bottom*
                    </li>
                    <li>
Top
                    </li>
                </ul>
            </td>
            <td >
*Top*
            </td>
        </tr>

        <tr>
            <td>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~HideLabel.html)
            </td>
            <td>
bool
            </td>
            <td>
*true* の場合、ラベルは非表示になります。
            </td>
            <td >
*false*
            </td>
        </tr>
        <tr>
            <td>
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.ToggleSwitchWrapper~Mini.html)
            </td>
            <td>
bool?
            </td>
            <td>
ミニ スタイルによって `Toggle Switch` をレンダリングします。
            </td>
            <td >
*null*
            </td>
        </tr>
    </tbody>
</table>




