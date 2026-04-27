<!--
|metadata|
{
    "fileName": "igdialog-property-reference",
    "controlName": "igDialog",
    "tags": ["API"]
}
|metadata|
-->

# プロパティ リファレンス (igDialog)

## トピックの概要

### 目的

このトピックでは、`igDialog`™ コントロールのプロパティを紹介します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [**jQuery プロパティのリファレンス**](#jquery)
-   [**MVC プロパティのリファレンス**](#mvc)
-   [**関連コンテンツ**](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="jquery"></a> jQuery プロパティのリファレンス

以下の表は、`igDialog` コントロールの主なプロパティの目的と機能の概要をまとめたものです。[`mainElement`](%%jQueryApiUrl%%/ui.igDialog#options:mainElement) と [`temporaryUrl`](%%jQueryApiUrl%%/ui.igDialog#options:temporaryUrl) の値以外、プロパティはすべて動的に変更できます。
<table class="table table-striped">
	<tbody>
		<tr>
			<th>
				<p>プロパティ</p>
			</th>

			<th>
				<p>タイプ</p>
			</th>

			<th>
				<p>値 (デフォルト値)</p>
			</th>

			<th>
				<p>説明</p>
			</th>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:mainElement" target="_blank">mainElement</a></p>
			</td>

			<td>
				<p>object</p>
			</td>

			<td>
				<p>**null**</p>

				<p>DOM オブジェクト</p>
			</td>

			<td>
				<p>このプロパティでは、jQuery HTML DIV オブジェクトの設定と取得ができます。このオブジェクトはダイアログのメイン コンテナーとして使用します。このプロパティの使用時には以下の制約が課せられるので注意してください。</p>

				<ul>
					<li>コンテナーはオプションであり、子は格納できません。</li>

					<li>コンテナーに親は設定できません。</li>

					<li>コンテナーに属性は収容できません。</li>

					<li>このオプションは変更できません。</li>
				</ul>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:container" target="_blank">container</a></p>
			</td>

			<td>
				<p>object</p>
			</td>

			<td>
				<p>**null**</p>

				<p>DOM オブジェクト</p>

				<p>jQuery オブジェクト</p>
			</td>

			<td>
				<p>igDialog の HTML コンテナー要素を取得または設定します。デフォルトで、オリジナル ターゲット要素の親フォームを使用します。親が利用できない場合は HTML body オブジェクトを使用します。CSS コンテナー プロパティ 「position」 の設定値が 「static」でない場合、位置の値は「relative」になります。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:state" target="_blank">state</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**opened**</p>

				<p>“closed”</p>

				<p>“minimized”</p>

				<p>“maximized”</p>
			</td>

			<td>
				<p>このプロパティでは、ダイアログの状態の設定と取得ができます。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:pinned" target="_blank">pinned</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ダイアログのピン留め状態を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:position" target="_blank">position</a></p>
			</td>

			<td>
				<p>object</p>
			</td>

			<td>
				<p>**null**</p>

				<p>[100, 200]</p>

				<p>{ my: “left top”,</p>

				<p>at: “left top”,</p>

				<p>offset: “100 200” }</p>
			</td>

			<td>
				<p>igDialog の初期位置を取得または設定します。位置は、左座標と上座標を表す 2 つの数値の配列で指定できます。もう 1 つのオプションは、jQuery <a href="http://jqueryui.com/demos/position/" target="_blank">`position()`</a> メソッドがサポートするオブジェクトです。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:modal" target="_blank">Modal</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog のモーダル状態を取得または設定します。ウィンドウが最小化やピン留めの状態では、この状態は利用できません。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:draggable" target="_blank">Draggable</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog コントロールをドラッグする機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:resizable" target="_blank">resizable</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog のサイズを変更する機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:trackFocus" target="_blank">trackFocus</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>ダイアログにあるコントロール自体と、その子要素のフォーカス イベントとブラー イベントを処理する機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:enableHeaderFocus" target="_blank">enableHeaderFocus</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>ヘッダーの状態を、フォーカス設定状態と非フォーカス状態に調節する機能を取得または設定します。このプロパティは、<a href="%%jQueryApiUrl%%/ui.igDialog#options:trackFocus" target="_blank">`trackFocus`</a> プロパティを有効にしたときにだけ機能します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:tabIndex" target="_blank">tabIndex</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**0**</p>
			</td>

			<td>
				<p>igDialog メイン HTML 要素に適用した <a href="%%jQueryApiUrl%%/ui.igDialog#options:tabIndex" target="_blank">`tabIndex`</a> 属性の値を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:zIndex" target="_blank">zIndex</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**1000**</p>
			</td>

			<td>
				<p>igDialog メイン HTML 要素に適用した  <a href="%%jQueryApiUrl%%/ui.igDialog#options:zIndex" target="_blank">`zIndex`</a> の値を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:temporaryUrl" target="_blank">temporaryUrl</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“”</p>
			</td>

			<td>
				<p>IFRAME src 属性の一時値を取得または設定します。基本要素の親が HTML IFRAME 要素の場合、このプロパティで親を変更します。このプロパティは必須ではありませんが、これが例外防止になる場合があります。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:enableDblclick" target="_blank">enableDblclick</a></p>
			</td>

			<td>
				<p>string/boolean</p>
			</td>

			<td>
				<p>**“auto”**</p>
				<p>true</p>
				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダーをダブル クリックしたときに生じるアクションを取得または設定します。</p>

				<p>値が false の場合、マウスをダブル クリックしてもウィンドウは反応しません。値を true に設定したときは反応します。また、auto 状態になると、ヘッダーに最大化アイコンがある場合にだけ、ダブル クリックに igDialog が反応します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<a href="%%jQueryApiUrl%%/ui.igDialog#options:height" target="_blank">height</a>
			</td>

			<td> number </td>

			<td>
				<p>**null**</p>
				<p>100</p>
				<p>“100px”</p>
				<p>“2em”</p>
				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログのピクセル単位の初期高さを取得または設定します。「%」を使用すると、window ブラウザー オブジェクトのサイズが適用され、igDialog を開くときにだけ反応します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:width" target="_blank">width</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**300**</p>
				<p>“300px”</p>
				<p>“2em”</p>
				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログのピクセル単位の初期幅を取得または設定します。「%」を使用すると、window ブラウザー オブジェクトのサイズが適用され、igDialog を開くときにだけ反応します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:minHeight" target="_blank">minHeight</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**100**</p>

				<p>“100px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最低高さを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:minWidth" target="_blank">minWidth</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**150**</p>

				<p>“150px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最低幅を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:maxHeight" target="_blank">maxHeight</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**null**</p>

				<p>1500</p>

				<p>“1500px”</p>

				<p>“5em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最高高さを取得または設定します。このオプションの値が反映されるのは、igDialog のサイズ変更時だけです。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:maxWidth" target="_blank">maxWidth</a></p>
			</td>

			<td>
				<p>number</p>
			</td>

			<td>
				<p>**null**</p>

				<p>1500</p>

				<p>“1500px”</p>

				<p>“5em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最大幅を取得または設定します。注: このオプションが有効なのは、エンド ユーザーがダイアログのサイズを変更するときだけです。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:closeOnEscape" target="_blank">closeOnEscape</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>Esc キーでダイアログを閉じる機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:showCloseButton" target="_blank">showCloseButton</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダー内の閉じるボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:showMaximizeButton" target="_blank">showMaximizeButton</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog ヘッダー内の最大化ボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:showPinButton" target="_blank">showPinButton</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ヘッダー内のピン留めボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:pinOnMinimized" target="_blank">pinOnMinimized</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ダイアログを最小化したときに igDialog を自動的にピン留めする機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:openAnimation" target="_blank">openAnimation</a></p>
			</td>

			<td>
				<p>string/number</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“slide”</p>

				<p>“explode”</p>

				<p>500</p>
			</td>

			<td>
				<p>ダイアログを開くときにダイアログに適用されるアニメーションを取得または設定します。jQuery show() メソッドがサポートするオブジェクトはすべて対象です。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:closeAnimation" target="_blank">closeAnimation</a></p>
			</td>

			<td>
				<p>string/number</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“slide”</p>

				<p>“explode”</p>

				<p>500</p>
			</td>

			<td>
				<p>ダイアログを閉じるときに適用されるアニメーションを取得または設定します。jQuery hide() メソッドがサポートするオブジェクトはすべて対象です。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:dialogClass" target="_blank">dialogClass</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“container-class”</p>
			</td>

			<td>
				<p>CSS クラスの名前を取得または設定します。このクラスは igDialog のメイン DIV 要素に適用します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:imageClass" target="_blank">imageClass</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>**“img-class”**</p>
			</td>

			<td>
				<p>CSS クラスの名前を取得または設定します。このクラスは igDialog ヘッダーの左側にある SPAN 要素に適用します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:headerText" target="_blank">headerText</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“HEADER”</p>
			</td>

			<td>
				<p>igDialog ヘッダーに表示されるテキストを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:showHeader" target="_blank">showHeader</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダーの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:showFooter" target="_blank">showFooter</a></p>
			</td>

			<td>
				<p>boolean</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog ヘッダーの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:footerText" target="_blank">footerText</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“FOOTER”</p>
			</td>

			<td>
				<p>igDialog フッターに表示するテキストを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:closeButtonTitle" target="_blank">closeButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“X”</p>
			</td>

			<td>
				<p>igDialog の閉じるボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:minimizeButtonTitle" target="_blank">minimizeButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“MIN”</p>
			</td>

			<td>
				<p>igDialog の最小化ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:maximizeButtonTitle" target="_blank">maximizeButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“MAX”</p>
			</td>

			<td>
				<p>igDialog の最大化ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:pinButtonTitle" target="_blank">pinButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“PIN”</p>
			</td>

			<td>
				<p>igDialog のピン留めボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:unpinButtonTitle" target="_blank">unpinButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“UNPIN”</p>
			</td>

			<td>
				<p>igDialog のピン留め解除ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="%%jQueryApiUrl%%/ui.igDialog#options:restoreButtonTitle" target="_blank">restoreButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**null**</p>

				<p>“RESTORE”</p>
			</td>

			<td>
				<p>igDialog の元に戻すボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>
	</tbody>
</table>





## <a id="mvc"></a> MVC メソッド リファレンス

以下の表は、* %%ProductNameMVC%% * `Dialog` の目的と機能をまとめたものです。[`mainElement`](%%jQueryApiUrl%%/ui.igDialog#options:mainElement) と [`temporaryUrl`](%%jQueryApiUrl%%/ui.igDialog#options:temporaryUrl) を除くほとんどのメソッドは、jQuery プロパティに対応します。対応する igDialog プロパティがない MVC メソッドには、これ以外にも、[`ContentJquerySelector`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentJquerySelector.html)、[`ContentID`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentID.html)、[`ID`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ID.html)、[`ContentHTML`](Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogWrapper~ContentHTML.html) などがあります。

<table class="table table-striped">
	<tbody>
		<tr>
			<th>
				<p>プロパティ</p>
			</th>

			<th>
				<p>パラメーター タイプ</p>
			</th>

			<th>
				<p>値 (デフォルト値)</p>
			</th>

			<th>
				<p>説明</p>
			</th>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentJquerySelector.html">ContentJquerySelector</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“#igDialog1”</p>
			</td>

			<td>
				<p>このプロパティは、%%ProductNameMVC%% Dialog のセレクターを定義します。このセレクターは jQuery のみのウィジェットを作成するときと同じセレクターにしてください。たとえば、HTML プレースホルダーの ID が “igDialog1” の場合、<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentJquerySelector.html">ContentJquerySelector</a> の値は 「#igDialog」になります。次に、%%ProductNameMVC%% は以下のコードをレンダリングします。</p>

				<p>$(“#igDialog”).igDialog();</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentID.html">ContentID</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“igDialog1”</p>
			</td>

			<td>
				<p>このプロパティは、%%ProductNameMVC%% Dialog のセレクターを定義します。<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentJquerySelector.html">ContentJquerySelector</a> プロパティと違って、渡す情報は # を除いた HTML プレースホルダーの ID だけです。%%ProductNameMVC%% はウィジェットを自動的にレンダリングします。<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentID.html">ContentID</a> の値が「igDialog」の場合、先のプロパティと同様の結果が得られます。</p>

				<p>$(“#igDialog”).igDialog();</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ID.html">ID</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“igDialog1”</p>
			</td>

			<td>
				<p>このプロパティは、%%ProductNameMVC%% Dialog のセレクターを定義します。このプロパティは <a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogWrapper~ContentID.html">ContentID</a> プロパティとまったく同じ働きをします。パラメーターでは同じフォーマットを使用し、同じコードをレンダリングします。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ContentHTML.html">ContentHTML</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“&lt;div id="igDialog1”&gt; igDialog Content &lt;/div&gt;”</p>
			</td>

			<td>
				<p>このプロパティでは、%%ProductNameMVC%% Dialog の一部として igDialog の HTML プレースホルダーを定義できます。この HTML コードは、igDialog のコンテンツになります。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Container.html">Container</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“#idContainer”</p>

				<p>“.classContainer”</p>
			</td>

			<td>
				<p>igDialog の HTML コンテナー要素を取得または設定します。デフォルトで、オリジナル ターゲット要素の親フォームを使用し、その親が利用できない場合は、HTML body オブジェクトを使用します。CSS コンテナー プロパティ「position」を設定しないと値は「static」になり、位置の値の設定は「relative」になります。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~State.html">State</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**DialogState.Opened**</p>

				<p>DialogState.Closed</p>

				<p>DialogState.Minimized</p>

				<p>DialogState.Maximized</p>
			</td>

			<td>
				<p>このプロパティでは、ダイアログの状態を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Pinned.html">Pinned</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ダイアログのピン留め状態を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Position.html">Position</a></p>
			</td>

			<td>
				<p>int</p>
			</td>

			<td>
				<p>Position(100, 200)</p>
			</td>

			<td>
				<p>igDialog の初期位置を取得または設定します。左と上の位置を引数として渡します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Modal.html">Modal</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog のモーダル状態を取得または設定します。ウィンドウを最小化したときやピン留めしたときは、この状態は利用できません。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Draggable.html">Draggable</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog コントロールをドラッグする機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Resizable.html">Resizable</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog のサイズを変更する機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~TrackFocus.html">TrackFocus</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>フォーカス状態を維持するため、igDialog にある子要素のフォーカス イベントとブラー イベントを処理する機能を取得または設定します。このオプションが有効な場合、そのダイアログのすべての子要素にフォーカス イベント ハンドラーとブラー イベント ハンドラーが追加されます。ダイアログがモーダルの場合や最大化されている場合、このオプションは無効にしないでください。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogWrapper~EnableHeaderFocus.html">EnableHeaderFocus</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>ヘッダーの状態を、フォーカス設定状態と非フォーカス状態に調節する機能を取得または設定します。このプロパティは、<a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~TrackFocus.html">trackFocus</a> プロパティを有効にしたときにだけ機能します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogWrapper~TabIndex.html">TabIndex</a></p>
			</td>

			<td>
				<p>int</p>
			</td>

			<td>
				<p>**0**</p>
			</td>

			<td>
				<p>igDialog メイン HTML 要素に適用した tabIndex 属性の値を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ZIndex.html">ZIndex</a></p>
			</td>

			<td>
				<p>int</p>
			</td>

			<td>
				<p>**1000**</p>
			</td>

			<td>
				<p>igDialog メイン HTML 要素に適用した  zIndex の値を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~EnableDblclick.html">EnableDblclick</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダーをダブル クリックしたときに生じるアクションを取得または設定します。</p>

				<p>値が false の場合、ウィンドウはマウスのダブル クリックに反応しません。一方、値が true のときは反応します。「auto」状態の場合、ダブルクリックで igDialog が反応するのはヘッダーのアイコンが最大化されているときだけです。</p>

				<p>「Auto」はデフォルト状態ですが、%%ProductNameMVC%% で動的に変更することはできません。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Height.html">Height</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>100</p>

				<p>“100px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログのピクセル単位の初期高さを取得または設定します。「%」を使用すると、window ブラウザー オブジェクトのサイズを使用し、igDialog が開いていないと結果は反映されません。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~Width.html">Width</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**300**</p>

				<p>“300px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログのピクセル単位の初期幅を取得または設定します。「%」を使用すると、window ブラウザー オブジェクトのサイズを使用し、igDialog が開いていないと結果は反映されません。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MinHeight.html">MinHeight</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**100**</p>

				<p>“100px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最低高さを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MinWidth.html">MinWidth</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>**150**</p>

				<p>“150px”</p>

				<p>“2em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最低幅を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MaxHeight.html">MaxHeight</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>1500</p>

				<p>“1500px”</p>

				<p>“5em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最高高さを取得または設定します。このオプションの値が反映されるのは、igDialog のサイズ変更時だけです。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MaxWidth.html">MaxWidth</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>1500</p>

				<p>“1500px”</p>

				<p>“5em”</p>

				<p>“100%”</p>
			</td>

			<td>
				<p>ノーマル状態ダイアログの最大幅を取得または設定します。注: このオプションが有効なのは、エンド ユーザーがダイアログのサイズを変更するときだけです。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~CloseOnEscape.html">CloseOnEscape</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>Esc キーでダイアログを閉じる機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ShowCloseButton.html">ShowCloseButton</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダー内の閉じるボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ShowMaximizeButton.html">ShowMaximizeButton</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog ヘッダー内の最大化ボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ShowPinButton.html">ShowPinButton</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ヘッダー内のピン留めボタンの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~PinOnMinimized.html">pinOnMinimized</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>ダイアログを最小化したときに igDialog を自動的にピン留めする機能を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~OpenAnimation.html">openAnimation</a></p>
			</td>

			<td>
				<p>string/integer</p>
			</td>

			<td>
				<p>“slide”</p>

				<p>“explode”</p>

				<p>500</p>
			</td>

			<td>
				<p>ダイアログを開くときに適用されるアニメーションを取得または設定します。jQuery show() メソッドがサポートするオブジェクトはすべて対象です。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~CloseAnimation.html">CloseAnimation</a></p>
			</td>

			<td>
				<p>string/integer</p>
			</td>

			<td>
				<p>“slide”</p>

				<p>“explode”</p>

				<p>500</p>
			</td>

			<td>
				<p>ダイアログを閉じるときに適用されるアニメーションを取得または設定します。jQuery hide() メソッドがサポートするオブジェクトはすべて対象です。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p>
                [DialogClass](Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~DialogClass.html)
                </p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“container-class”</p>
			</td>

			<td>
				<p>CSS クラスの名前を取得または設定します。このクラスは igDialog のメイン DIV 要素に適用します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ImageClass.html">imageClass</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“img-class”</p>
			</td>

			<td>
				<p>CSS クラスの名前を取得または設定します。このクラスは igDialog ヘッダーの左側にある SPAN 要素に適用します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~HeaderText.html">HeaderText</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“HEADER”</p>
			</td>

			<td>
				<p>igDialog ヘッダーに表示されるテキストを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ShowHeader.html">ShowHeader</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>**true**</p>

				<p>false</p>
			</td>

			<td>
				<p>igDialog ヘッダーの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~ShowFooter.html">ShowFooter</a></p>
			</td>

			<td>
				<p>bool?</p>
			</td>

			<td>
				<p>true</p>

				<p>**false**</p>
			</td>

			<td>
				<p>igDialog ヘッダーの可視性を取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~FooterText.html">FooterText</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“FOOTER”</p>
			</td>

			<td>
				<p>igDialog フッターに表示されるテキストを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~CloseButtonTitle.html">CloseButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“X”</p>
			</td>

			<td>
				<p>igDialog の閉じるボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MinimizeButtonTitle.html">minimizeButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“MIN”</p>
			</td>

			<td>
				<p>igDialog の最小化ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~MaximizeButtonTitle.html">MaximizeButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“MAX”</p>
			</td>

			<td>
				<p>igDialog の最大化ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~PinButtonTitle.html">PinButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“PIN”</p>
			</td>

			<td>
				<p>igDialog のピン留めボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~UnpinButtonTitle.html">UnpinButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“UNPIN”</p>
			</td>

			<td>
				<p>igDialog のピン留め解除ボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>

		<tr>
			<td>
				<p><a href="Infragistics.Web.Mvc~Infragistics.Web.Mvc.DialogModel~RestoreButtonTitle.html">RestoreButtonTitle</a></p>
			</td>

			<td>
				<p>string</p>
			</td>

			<td>
				<p>“RESTORE”</p>
			</td>

			<td>
				<p>igDialog の元に戻すボタンのツールチップを取得または設定します。</p>
			</td>
		</tr>
	</tbody>
</table>

## <a id="related-content"></a> 関連コンテンツ

### <a id="topics"></a> トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [メソッドのリファレンス (*igDialog*)](igDialog-Method-Reference.html): このトピックでは `igRating` コントロールのメソッドを紹介します。

- [イベント リファレンス (*igDialog*)](igDialog-Event-Reference.html): このトピックでは、`igDialog` コントロールのイベントを紹介します。

- [CSS クラス リファレンス (*igDialog*)](igDialog-Css-Classes-Reference.html): このトピックでは、`igDialog` コントロールの CSS クラスを紹介します。



### <a id="samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/dialog-window/basic-usage): このサンプルでは、`igDialog` の高さ、幅、状態を設定する方法を紹介します。

- [API およびイベント](igdialog-event-reference.html#attaching-handlers-jquery): このサンプルでは、ダイアログ ウィンドウ コントロールのイベントを処理および API を使用する方法を紹介します。

- [ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/dialog-window/aspnet-mvc-helper): このサンプルでは、ダイアログ ウィンドウの ASP.NET MVC ヘルパーを使用する方法を紹介します。

- [モーダル ダイアログ](%%SamplesUrl%%/dialog-window/modal-dialog): このサンプルでは、モーダル ダイアログを作成する方法を紹介します。

- [外部ページの読み込み](%%SamplesUrl%%/dialog-window/loading-external-page): このサンプルでは、URL から外部のコンテンツを読み込む方法を紹介します。





 

 


