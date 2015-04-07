<!--
|metadata|
{
    "fileName": "igrating-data-attributes-reference",
    "controlName": "igRatingMobile",
    "tags": ["API"]
}
|metadata|
-->

# データ属性リファレンス

## トピックの概要

### 目的

このトピックでは、すべての `igRating`™ データ属性を示します。これらの属性を使用してマークアップで `igRating` を初期化できます。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [レーティング オプション データ属性参照](#options)
-   [関連コンテンツ](#related-content)



## <a id="introduction"></a>概要

以下に示す参照チャートは `igRating`™ コントロールのデータ属性を説明しています。これらの属性は、HTML マークアップのコントロールを構成するために使用します。

例: `igRating` マークアップの初期化

**HTML の場合:**

```html
<div id="igRatingViewMarkupInitializtion"
    data-role="igrating"
    data-value="2"
    data-vote-count="5"
    data-vote-width="44"
    data-voteheight="44"
    data-read-only="false"
    data-input-name="hdnValue">
</div>
```



## <a id="options"></a>レーティング オプション データ属性参照

次の表は、`igRating` コントロール特有のデータ属性の目的と機能について概要を示します。

<table class="table table-striped">
	<thead>
		<tr>
            <th>
プロパティ
			</th>
            <th>
説明
			</th>
            <th>
タイプ
			</th>
            <th>
値 (デフォルト)
			</th>
        </tr>
	</thead>
	<tbody>
        <tr>
            <td>
data-role
			</td>
            <td>
`igRating` コントロールの識別子
			</td>
            <td>
string
			</td>
            <td>
`igrating`
			</td>
        </tr>
        <tr>
            <td>
data-value
			</td>
            <td>
選択された投票値を取得または設定します。
			</td>
            <td>
number
			</td>
            <td>
Number(0)
			</td>
        </tr>

        <tr>
            <td>
data-vote-count
			</td>

            <td>
投票の数を取得または設定します。
			</td>

            <td>
number
			</td>

            <td>
Number(5)
			</td>
        </tr>
        <tr>
            <td>
data-vote-width
			</td>
            <td>
投票のカスタム幅 (ピクセル単位) を取得または設定します。
			</td>
            <td>
number
			</td>
            <td>
Number(0)
			</td>
        </tr>
        <tr>
            <td>
data-vote-height
			</td>
            <td>
投票のカスタム高さ (ピクセル単位) を取得または設定します。
			</td>
            <td>
number
			</td>
            <td>
Number(0)
			</td>
        </tr>
        <tr>
            <td>
data-read-only
			</td>
            <td>
レーティングが編集可能かどうかを取得または設定します。
			</td>
            <td>
bool
			</td>
            <td>
true|**false**
            </td>
        </tr>
        <tr>
            <td>
data-input-name
			</td>
            <td>
MVC で使用された非表示の入力の名前を取得または設定し、値をサーバーに送信します。
			</td>
            <td>
string
			</td>
            <td>
string(null)
			</td>
        </tr>
    </tbody>
</table>



## <a id="related-content"></a>関連コンテンツ

### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [プロパティ リファレンス](igRating-Property-Reference.html): このトピックでは、`igRating` コントロールのプロパティを紹介します。

- [メソッド リファレンス](igRating-Method-Reference.html): このトピックでは、`igRating` コントロールのメソッドを紹介します。

- [イベント リファレンス](igRating-Event-Reference.html): このトピックでは、`igRating` コントロールのイベントを紹介します。

- [CSS クラス](igRating-Classes-Reference.html): このトピックでは、`igRating` コントロールの CSS クラスを紹介します。



### サンプル

このトピックについては、以下のサンプルも参照してください。

- [基本的な使用方法](%%SamplesUrl%%/mobile-rating/basic-usage): `igRating` モバイルの初期化方法を示すサンプル。

- [カスタム項目](%%SamplesUrl%%/mobile-rating/custom-items): `igRating` モバイルにユーザー設定の画像を設定する方法を示すサンプルです。

- [API およびイベント](%%SamplesUrl%%/mobile-rating/api-and-events): このサンプルでは、モバイル レーティングの一般的なメソッドおよびイベントを紹介します。





 

 


