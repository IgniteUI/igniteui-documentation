<!--
|metadata|
{
    "fileName": "igpopover-property-reference",
    "controlName": "igPopover",
    "tags": ["API","Events","How Do I"]
}
|metadata|
-->

# プロパティ リファレンス (igPopover)



## igPopover のプロパティ リファレンス
### 概要

このトピックでは、`igPopover`™ コントロールのプロパティについて説明し、デフォルト値の一覧を示します。

### igPopover プロパティのリファレンス チャート

以下の表では、`igPopover`™ コントロールのプロパティについて説明し、デフォルト値の一覧を示します。プロパティはアルファベット順に紹介します。

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
[animationDuration](%%jQueryApiUrl%%/ui.igpopover#options:animationDuration)
            </td>

            <td>
number
            </td>

            <td>
アニメーション化したポップオーバーの表示/非表示の時間。
            </td>

            <td>
150
            </td>
        </tr>

        <tr>
            <td>
[closeOnBlur](%%jQueryApiUrl%%/ui.igpopover#options:closeOnBlur)
            </td>

            <td>
bool
            </td>

            <td>
ぼかし時にポップオーバーを閉じるかどうかを制御します。
            </td>

            <td>
true
            </td>
        </tr>

        <tr>
            <td>
[containment](%%jQueryApiUrl%%/ui.igpopover#options:containment)
            </td>

            <td>
object
            </td>

            <td>
ポップオーバーのコンテインメント設定。

                コンテインメントは、ポップオーバーを表示できる領域を制限する、境界線が機能するオブジェクト (DIV コンテナーなど) を指定することにより機能します。
            </td>

            <td>
null
            </td>
        </tr>

        <tr>
            <td>
[contentTemplate](%%jQueryApiUrl%%/ui.igpopover#options:contentTemplate)
            </td>

            <td>
string|function
            </td>

            <td>
ポップオーバー コンテナーのコンテンツ。null 値のままの場合、コンテンツはターゲットから取り出されます。
            </td>

            <td>
null
            </td>
        </tr>

        <tr>
            <td>
[direction](%%jQueryApiUrl%%/ui.igpopover#options:direction)
            </td>

            <td>
enumerable
            </td>

            <td>
                ターゲット要素に対するポップオーバーの位置。direction は、ポップオーバー コンテナーをターゲットのどちら側に表示するか指定します。有効な設定は以下のとおりです。

                <ul>
                    <li>
"auto”
                    </li>

                    <li>
“left”
                    </li>

                    <li>
”right”
                    </li>

                    <li>
“top”
                    </li>

                    <li>
“bottom"
                    </li>
                </ul>
            </td>

            <td>
“auto”
            </td>
        </tr>

        <tr>
            <td>
[headerTemplate.closeButton](%%jQueryApiUrl%%/ui.igpopover#options:headerTemplate.closeButton)
            </td>

            <td>
bool
            </td>

            <td>
ポップオーバーに閉じるボタンを表示するかどうかを制御します。
            </td>

            <td>
false
            </td>
        </tr>

        <tr>
            <td>
[headerTemplate.title](%%jQueryApiUrl%%/ui.igpopover#options:headerTemplate.title)
            </td>

            <td>
string
            </td>

            <td>
ポップオーバー ヘッダーのコンテンツ。
            </td>

            <td>
null
            </td>
        </tr>

        <tr>
            <td>
[height](%%jQueryApiUrl%%/ui.igpopover#options:height)
            </td>

            <td>
number
            </td>

            <td>
ポップオーバーの高さ。auto の場合は null のままにします。
            </td>

            <td>
null
            </td>
        </tr>

        <tr>
            <td>
[maxHeight](%%jQueryApiUrl%%/ui.igpopover#options:maxHeight)
            </td>

            <td>
string|number
            </td>

            <td>
[height](%%jQueryApiUrl%%/ui.igpopover#options:height) が指定されていない場合のポップオーバーの最大の高さ。
            </td>

            <td>
200
            </td>
        </tr>

        <tr>
            <td>
[maxWidth](%%jQueryApiUrl%%/ui.igpopover#options:maxWidth)
            </td>

            <td>
string|number
            </td>

            <td>
[width](%%jQueryApiUrl%%/ui.igpopover#options:width) が指定されていない場合のポップオーバーの最大幅。
            </td>

            <td>
200
            </td>
        </tr>

        <tr>
            <td>
[position](%%jQueryApiUrl%%/ui.igpopover#options:position)
            </td>

            <td>
enumerable
            </td>

            <td>
                ポップオーバーがターゲットより大きい場合のターゲット要素に対するポップオーバーの位置。ポップオーバーが小さい場合は、常にターゲット要素の `direction` で設定された側の表示領域の中央に表示されます。

                有効な設定は以下のとおりです。

                <ul>
                    <li>
"auto”
                    </li>
                </ul>

                ポップオーバーの位置は自動的に決定されます。

                <ul>
                    <li>
“balanced”
                    </li>
                </ul>

                ポップオーバーは、ターゲット要素の `direction` で設定された側の中央に置かれます。

                <ul>
                    <li>
“start”
                    </li>
                </ul>

                ポップオーバーは、ターゲット要素の `direction` で設定された側の始点に置かれます。
                    
設定された側の始点とは、direction が「top」/「bottom」の場合は左側のセクション、「left」/「right」の場合は上部のセクションとみなされます。

                <ul>
                    <li>
“end"
                    </li>
                </ul>

                ポップオーバーは、ターゲット要素の `direction` で設定された側の終点に置かれます。

                設定された側の終点とは、direction が「top」/「bottom」の場合は右側のセクション、「left」/「right」 の場合は下部のセクションとみなされます。
            </td>

            <td>
“auto”
            </td>
        </tr>

        <tr>
            <td>
[selectors](%%jQueryApiUrl%%/ui.igpopover#options:selectors)
            </td>

            <td>
string
            </td>

            <td>
どの項目がポップオーバーを表示するかを示すセレクター。jQuery セレクターはすべて有効な設定です。事前定義された設定は [title] で、項目のタイトル属性が表示されることを意味します。

                タイトル属性以外の情報を表示する場合、またはイベント デリゲートのために別のセレクターが必要な場合は、カスタマイズしてください。

                このオプションを変更する場合は、[`contentTemplate`](%%jQueryApiUrl%%/ui.igpopover#options:contentTemplate) オプションの変更も必要になる場合があります。
            </td>

            <td>
null
            </td>
        </tr>

        <tr>
            <td>
[showOn](%%jQueryApiUrl%%/ui.igpopover#options:showOn)
            </td>

            <td>
enumerable
            </td>

            <td>
                ポップオーバーを表示するイベント。有効な設定は以下のとおりです。

                <ul>
                    <li>
"mouseenter" (マウスオーバーで発生)
                    </li>

                    <li>
"click"
                    </li>

                    <li>
"focus" (ターゲット要素がフォーカスを取得)
                    </li>
                </ul>

                注:

                <blockquote>
                    [`showOn`](%%jQueryApiUrl%%/ui.igpopover#options:showOn) 設定は、タッチ環境では機能しません。
                    タッチ デバイスでは、ポップオーバーはタップ時に表示され、このアクティブ化は構成できません。
                </blockquote>
            </td>

            <td>
"mouseenter"
            </td>
        </tr>

        <tr>
            <td>
[width](%%jQueryApiUrl%%/ui.igpopover#options:width)
            </td>

            <td>
number
            </td>

            <td>
ポップオーバーの幅。auto の場合は null のままにします。
            </td>

            <td>
null
            </td>
        </tr>
    </tbody>
</table>



 

 


