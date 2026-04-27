<!--
|metadata|
{
    "fileName": "igcheckboxeditor-accessibility-compliance",
    "controlName": "igEditors",
    "tags": ["Editing","Section 508"]
}
|metadata|
-->

# igCheckboxEditor アクセシビリティの遵守

## igCheckboxEditor アクセシビリティの遵守
すべての %%ProductName%%™ コントロールおよびコンポーネントは、1973 年リハビリテーション法第 508 条第 1194 部 22 条を遵守しています。表 1 には、コントロールに関連する第 1194 部 22 条の特定の規則が記載されています。また、`igCheckboxEditor` コントロールが各規則を遵守する方法の詳細も含まれています。

各アクセシビリティ規則の要件を満たすために、場合によっては、コントロールを操作して特定のプロパティを設定する必要がありますが、それ以外の場合は、コントロール自身がこの作業を行います。

>**注:** jQuery コントロールはクライアント専用のため、一部の規則はサポートされず、制限とされています。

表 1: 第 508 条遵守の説明

<table class="table">
	<thead>
		<tr>
            <th>
規則
			</th>

            <th>
規則を遵守する方法
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
(c)
			</td>

            <td>
クライアント側イベントを使用すると、現在の状態を反映する任意のコントロールの DOM 要素の属性を変更することができます。
			</td>
        </tr>

        <tr>
            <td>
(d)
			</td>

            <td>
コントロールのマークアップは、クライアント側のコントロールで、CSS のルールに依存するため、関連付けられたスタイル シートなしで読み取り可能です。
			</td>
        </tr>

        <tr>
            <td>
(l)
			</td>

            <td>
コントロールのスクリプトでページ マークアップを変更している場合、ルール (c) で説明する属性により、新しく作成されたコンテンツはスクリーン リーダーに準拠します。
			</td>
        </tr>

        <tr>
            <td>
(n)
			</td>

            <td>
                `igCheckboxEditor` にフォーカスがある場合(編集モード)、キーボード ナビゲーションが使用可能です。使用可能なキー操作と、それらに対応するアクションの
詳細なリストについては、[igCheckboxEditor 概要のトピック](igCheckboxEditor_Overview.html#keyboard-navigation)を参照してください。

            </td>
        </tr>
    </tbody>
</table>

\* エディター入力の説明ラベルは提供されていません。

## <a id="wai-aria"></a> WAI-ARIA サポート

2014 年に W3C は [WAI-ARIA 仕様](http://www.w3.org/TR/wai-aria/) を完成しました。障害を持つユーザーに Web コンテンツおよび Web アプリケーションへのアクセシビリティを提供するデザインを定義したものです。`igCheckboxEditor` のデザインは、このガイドラインに準拠しています。

以下のリストは、WAI-ARIA をサポートするための `igCheckboxEditor` の変更点の詳細を提供します。この変更は、デフォルトですべて有効にされることに注意してください。

- `igCheckboxEditor` の入力要素が `igCheckboxEditor` の <b>tabindex</b> オプションからの相対値を持つ <b>tabindex</b> 属性を描画します。TAB および SHIFT+TAB キーの使用で要素へアクセスできます。 

>**注:** tabindex オプションは指定されていません。-1 と等しい tabindex は、入力要素の属性として描画されます。

- `igCheckboxEditor` は <b>checkbox</b> ロールで装飾されます。

- `igCheckboxEditor` は、チェック済み状態に基づいた相対値の <b>aria-label</b> 属性で装飾されます。



