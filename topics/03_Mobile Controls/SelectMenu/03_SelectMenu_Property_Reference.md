<!--
|metadata|
{
    "fileName": "selectmenu-property-reference",
    "controlName": "SelectMenu",
    "tags": ["API","Editing","MVC","Selection"]
}
|metadata|
-->

# SelectMenu のプロパティ リファレンス

## SelectMenu プロパティ参照
### 概要

このトピックでは、`SelectMenu` ヘルパーのプロパティに関する参照情報を提供します。

### SelectMenu のプロパティ リファレンス チャート

次の表は、`SelectMenu` ASP.NET MVC ヘルパーのプロパティの説明とそれぞれの既定値をまとめたものです。

>**注:** 既定値が null になっているプロパティは、jQuery モバイル フレームワークの既定値でクライアントにウィジェットを表示します。このため、この表に示されたすべてのデフォルトの状態は、記載時のものであり、予告なく変更される場合があります。現行の既定値を確認するには、jQuery モバイル ドキュメントで [selectmenu](http://api.jquerymobile.com/selectmenu/) の項を調べてください。

<table class="table table-bordered">
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
[CloseText](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~CloseText.html)
			</td>

            <td>
string
			</td>

            <td>
閉じるボタンのテキストです。このテキストはヒントとして表示されます。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Corners](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Corners.html)
			</td>

            <td>
bool?
			</td>

            <td>
このプロパティを true に設定すると、メニューの四隅に丸みが付けられます。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[HidePlaceholderMenuItems](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~HidePlaceholderMenuItems.html)
			</td>

            <td>
bool?
			</td>

            <td>
このプロパティ値を true に設定すると、カスタム メニューの使用時にはプレースホルダーのメニュー項目が非表示になります。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Icon](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Icon.html)
			</td>

            <td>
string
			</td>

            <td>
ドロップダウン インジケーターに使用するアイコンです。指定可能な値の一覧を以下に示します。[Icons](http://api.jquerymobile.com/icons/)
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[IconPosition](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~IconPosition.html)
			</td>

            <td>
string
			</td>

            <td>
アイコンがある場合にアイコンが表示される位置です。指定可能な値は、「Left」、「Right」、「Top」、「Bottom」の 4 つです。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[IconShadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~IconShadow.html)
			</td>

            <td>
bool?
			</td>

            <td>
このプロパティは、selectmenu でアイコンに影を付けるかどうかを設定します。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Shadow](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Shadow.html)
			</td>

            <td>
bool?
			</td>

            <td>
このプロパティは、selectmenu に影を付けるかどうかを設定します。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Inline](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Inline.html)
			</td>

            <td>
bool?
			</td>

            <td>
selectmenu がインラインで表示されます。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Multiple](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Multiple.html)
			</td>

            <td>
bool
			</td>

            <td>
このオプションを設定すると、selectmenu で複数の項目を選択できるようになります。
			</td>

            <td>
false
			</td>
        </tr>

        <tr>
            <td>
[NativeMenu](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~NativeMenu.html)
			</td>

            <td>
bool?
			</td>

            <td>
ネイティブのメニューを使用するか、カスタムのメニューを使用するかを決定します。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Disabled](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Disabled.html)
			</td>

            <td>
bool?
			</td>

            <td>
このプロパティ値を true に設定すると、selectmenu は使用不可 (読み取り専用モード) になります。

                既定では、selectmenu は使用/編集可能になります。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[Label](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Label.html)
			</td>

            <td>
string
			</td>

            <td>
selectmenu のラベル テキストです。表示される HTML では、このラベルの記述は form 要素の前に挿入されます。

                既定では、selectmenu にラベルは表示されません。
			</td>

            <td>
null
			</td>
        </tr>

        <tr>
            <td>
[LabelAlignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~LabelAlignment.html)
			</td>

            <td>
[Infragistics.Web.Mvc.Mobile.Alignment](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.Alignment.html)
			</td>

            <td>
                (ラベルが表示される場合の) ラベルの表示位置です。

                有効な値：

                <ul>
                    <li>
Left
					</li>

                    <li>
Right
					</li>

                    <li>
Bottom
					</li>

                    <li>
Top
					</li>
                </ul>
            </td>

            <td>
Top
			</td>
        </tr>

        <tr>
            <td>
[HideLabel](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~HideLabel.html)
			</td>

            <td>
bool
			</td>

            <td>
プロパティを true に設定すると、ラベルは非表示になります。
			</td>

            <td>
false
			</td>
        </tr>

        <tr>
            <td>
[Mini](Infragistics.Web.Mvc.Mobile~Infragistics.Web.Mvc.Mobile.SelectMenuWrapper~Mini.html)
			</td>

            <td>
bool?
			</td>

            <td>
selectmenu を mini レイアウトで表示します。
			</td>

            <td>
null
			</td>
        </tr>
    </tbody>
</table>





 

 


