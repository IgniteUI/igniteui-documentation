<!--
|metadata|
{
    "fileName": "igupload-configuring-igupload",
    "controlName": "igUpload",
    "tags": []
}
|metadata|
-->

# igUpload の構成

## トピックの概要
### 目的

このトピックは、`igUpload`™ コントロールの構成方法をコード例を用いて説明します。

### 前提条件

このトピックを理解するために、以下のトピックを参照することをお勧めします。

**トピック**

- [igUpload の概要](igUpload-Overview.html): このトピックは `igUpload` コントロールおよびその機能について紹介します。このトピックでは、このコントロールを HTML ページへ追加する方法を示します。

- [HTTP ハンドラーとモジュールの使用](igUpload-Using-HTTP-Handler-and-Modules.html): このトピックは、HTTP モジュールおよび HTTP ハンドラーを構成して、`igUpload` コントロールでアップロードされるデータを承諾するのに必要なサーバー イベントを処理する方法をデモします。

**外部リソース**

-   [W3C: HTML ファイル型の入力](https://www.w3.org/wiki/HTML/Elements/input/file)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [igUpload 構成の概要](#overview)
    -   [igUpload 構成の概要](#config-summary)
    -   [igUpload 構成の概要表](#config-summary-chart)
-   [ファイル選択モードの構成 (単一/複数)](#config-selection-mode)
    -   [概要](#selection-mode-overview)
    -   [要件](#selection-mode-requirements)
    -   [プロパティ設定](#selection-mode-settings)
    -   [例](#selection-mode-example)
-   [アップロード トリガーの構成 (手動/自動)](#config-upload-trigger)
    -   [概要](#upload-trigger-overview)
    -   [プロパティ設定](#upload-trigger-settings)
    -   [例](#upload-trigger-example)
-   [許可されるファイル タイプの構成](#config-allowed-files)
    -   [概要](#allowed-files-overview)
    -   [プロパティ設定](#allowed-files-settings)
    -   [例](#allowed-files-example)
-   [アップロードするファイルの最大数を構成](#max-number-files)
    -   [概要](#number-files-overview)
    -   [プロパティ設定](#number-files-settings)
    -   [例](#number-files-example)
-   [同時にアップロードするファイルの最大数の構成](#simultaneously-uploaded-files)
    -   [概要](#simultaneously-uploaded-files-overview)
    -   [プロパティ設定](#simultaneously-uploaded-files-settings)
    -   [例](#simultaneously-uploaded-files-example)
-   [複数ファイルのアップロードで単一の要求を使用するための構成](#singleRequest)
    -   [概要](#singleRequest-overview)
    -   [プロパティ設定](#singleRequest-settings)
    -   [例](#singleRequest-example)
-   [ファイル表示モードの構成](#file-display-mode)
    -   [概要](#display-mode-overview)
    -   [プロパティ設定](#display-mode-settings)
    -   [例](#display-mode-example)
-   [関連コンテンツ](#related-content)
    -   [トピック](#topics)
    -   [サンプル](#samples)



## <a id="overview"></a>igUpload 構成の概要
### <a id="config-summary"></a>igUpload 構成の概要

`igUpload` コントロールには、特定のニーズに対してカスタマイズできる幅広いオプションがあります。使用できるファイル タイプを制御し、同時にアップロードするファイル数を指定し、ファイル パネルでユーザー操作を構成できます (アップロード可能なファイル数と `igUpload` パネルの表示)。また、アップロードが自動的に開始するか明示的なユーザー操作によって開始するかを選択します。詳細については、「[igUpload 構成の概要表](#config-summary-chart)」 とそれに続くセクションをご参照ください。

### <a id="config-summary-chart"></a>igUpload 構成の概要表

以下の表は、`igUpload` で構成可能な機能を示します。このメソッドについては、表の下にある解説も参照してください。

<table class="table">
	<thead>
		<tr>
            <th>
構成可能な要素
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
[ファイル選択モード (単一/複数)](#config-selection-mode)
			</td>

            <td>
ユーザーによるファイル選択が可能かどうか、いつファイルを選択するか、また一度に複数のファイルを選択できるかどうかを構成できます。
			</td>

            <td>
                <ul>
                    <li>
[mode](%%jQueryApiUrl%%/ui.igupload#options:mode)
					</li>

                    <li>
[multipleFiles](%%jQueryApiUrl%%/ui.igupload#options:multipleFiles)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[トリガーのアップロード (手動/自動)](#config-upload-trigger)
			</td>

            <td>
ユーザーが `igUpload` パネルにファイルを追加すると、アップロードが自動的に開始または手動で開始 (ユーザーの Upload ボタン押下によって) するかどうかを構成します。
			</td>

            <td>
                <ul>
                    <li>
[autostartupload](%%jQueryApiUrl%%/ui.igupload#options:autostartupload)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[許可されるファイル タイプ](#config-allowed-files)
			</td>

            <td>
ユーザーがアップロードできるファイルのタイプを構成できます。
			</td>

            <td>
                <ul>
                    <li>
[allowedExtensions](%%jQueryApiUrl%%/ui.igupload#options:allowedExtensions)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[アップロードするファイルの最大数](#max-number-files)
			</td>

            <td>
ページの更新ごとにアップロードできる最大ファイル数を構成できます。
			</td>

            <td>
                <ul>
                    <li>
[maxUploadedFiles](%%jQueryApiUrl%%/ui.igupload#options:maxUploadedFiles)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
[同時にアップロードするファイルの最大数の構成](#simultaneously-uploaded-files)
			</td>

            <td>
この設定は、同時ファイル アップロード数のしきい値を構成します。
			</td>

            <td>
                <ul>
                    <li>
[maxSimultaneousFilesUploads](%%jQueryApiUrl%%/ui.igupload#options:maxSimultaneousFilesUploads)
					</li>
                </ul>
            </td>
        </tr>

		<tr>
            <td>[複数ファイルのアップロードで単一の要求を使用](#singleRequest)</td>
            
            <td>
この設定はコントロールを単一の HTTP 要求を使用して複数のファイルのアップロードを構成します。
            </td>
            
            <td>
                <ul>
                    <li>
[useSingleRequest](%%jQueryApiUrl%%/ui.igupload#options:useSingleRequest)
                    </li>
                </ul>
            </td>
        </tr>
		
        <tr>
            <td>
[ファイル表示モード](#file-display-mode)
			</td>

            <td>
`igUpload` コントロールのパネルに表示するファイル数を構成できます。
			</td>

            <td>
                <ul>
                    <li>
[mode](%%jQueryApiUrl%%/ui.igupload#options:mode)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="config-selection-mode"></a>ファイル選択モードの構成 (単一/複数)
### <a id="selection-mode-overview"></a>概要

ユーザーによるファイル選択が可能かどうか、いつファイルを選択するか、また一度に複数のファイルを選択できるかどうかを構成できます。この機能は、`igUpload` のファイル選択モードにより管理されます。ファイル選択モードは、単一ファイル (ユーザーは 1 パスで 1 ファイル選択可能) または複数ファイル (ユーザーは 1 パスで複数ファイル選択可能) です。

ユーザーは複数ファイル選択モードで以下が可能です。

-   ファイルの開くダイアログから複数ファイルを選択。
-   ファイルを Windows® Explorer から`igUpload`  コントロールへドラッグ アンド ドロップ

単一ファイル選択モードでは、ファイルの開くダイアログでユーザーが選択できるのは 1 ファイルのみで、ファイルのドラッグ アンド ドロップもできません。複数ファイルをアップロードしたい場合、`igUpload` コントロール パネルでファイルを追加する操作を繰り返す必要があります。

以下の画像は、2 通りのファイルを選択する方法を示します。開く ダイアログから複数のファイルを選択して開く (左)、あるいは Windows エクスプローラーから `igUpload` コントロールパネル へドラッグ アンド ドロップしてそれらのファイルを開きます (右)。

#### ファイルを開くダイアログで複数のファイルの選択する 

![](images/Configuring_igUpload_1.png)

#### 選択したファイルを Windows エクスプローラーから `igUpload` へドロップする

![](images/Configuring_igUpload_2.png)

デフォルトのファイル選択モードは、単一ファイルです。

ファイル選択モードは、[mode](%%jQueryApiUrl%%/ui.igupload#options:mode) および [multipleFiles](%%jQueryApiUrl%%/ui.igupload#options:multipleFiles) オプションによって管理されます。[mode](%%jQueryApiUrl%%/ui.igupload#options:mode) が multiple の場合のみ [multipleFiles](%%jQueryApiUrl%%/ui.igupload#options:multipleFiles) を true に設定する意味があります。[mode](%%jQueryApiUrl%%/ui.igupload#options:mode) が single の場合、[multipleFiles](%%jQueryApiUrl%%/ui.igupload#options:multipleFiles) は効果がありません。

ファイル選択モード機能は、入力要素の [HTML 5 複数属性](http://www.w3.org/TR/html-markup/input.file.html#input.file) を採用します。これにより、機能がブラウザー依存となります。サポートされていないブラウザーが使用されると、機能のプロパティを設定しても効果はありません。つまり、ユーザーは、ファイルを開くダイアログまたは `igUpload` コントロールへドラッグ アンド ドロップして複数のファイルを選択することはできません。サポートされるブラウザーの一覧は、[要件](#selection-mode-requirements)をご覧ください。

### <a id="selection-mode-requirements"></a>要件

以下は、ファイル選択タイプを構成するための要件です。

-   入力要素の HTML 5 複数属性をサポートするブラウザー

この機能は以下のブラウザーでのみ使用できます。

Chrome|Firefox|Internet Explorer|Opera|Safari
---|---|---|---|---
1.0 またはそれ以降|3.6 またはそれ以降|10 またはそれ以降|10.62 またはそれ以降|5 またはそれ以降


### <a id="selection-mode-settings"></a>プロパティ設定

以下の表では、各プロパティ設定の構成です。

<table class="table">
	<thead>
		<tr>
            <th>
構成可能な要素
			</th>

            <th>
詳細
			</th>

            <th>
プロパティ
			</th>
        </tr>
	</thead>
	<tbody>


        <tr>
            <td>
[ファイル選択モード (単一/複数)](#config-selection-mode)
			</td>

            <td>
ユーザーによるファイル選択が可能かどうか、いつファイルを選択するか、また一度に複数のファイルを選択できるかどうかを構成できます。
			</td>

            <td>
                <ul>
                    <li>
[mode](%%jQueryApiUrl%%/ui.igupload#options:mode)
					</li>

                    <li>
[multipleFiles](%%jQueryApiUrl%%/ui.igupload#options:multipleFiles)
					</li>
                </ul>
            </td>
        </tr>

    </tbody>
</table>



### <a id="selection-mode-example"></a>例

これは、以下の設定の結果として複数のファイル選択を有効にする方法の例です。

プロパティ|値
---|---
mode|"multiple"
multipleFiles|true



![](images/Configuring_igUpload_1.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    mode: 'multiple', 
    multipleFiles: true
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .MultipleFiles(true)
    .Mode(UploadMode.Multiple)
    .Render()
)
```



## <a id="config-upload-trigger"></a>アップロード トリガーの構成 (手動/自動)
### <a id="upload-trigger-overview"></a>概要

ユーザーが `igUpload` パネルにファイルを追加すると、アップロードが自動的に開始または手動で開始 (ユーザーの Upload ボタン押下によって) するかどうかを構成します。`igUpload` コントロールの機能は、アップロード トリガーと呼ばれます。アップロード トリガーは、ファイル アップロードの自動スタートを有効または無効にします。

デフォルト アップロード トリガーは手動です。

アップロード トリガーは、`igUpload` コントロールの autostartupload オプションによって管理されます。

### <a id="upload-trigger-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。
プロパティ設定

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
自動アップロードを有効にする|[autostartupload](%%jQueryApiUrl%%/ui.igupload#options:autostartupload)|true
自動アップロードを無効にする|[autostartupload](%%jQueryApiUrl%%/ui.igupload#options:autostartupload)|false

### <a id="upload-trigger-example"></a>例

これは、以下の設定の結果として自動アップロードを有効にする方法の例です。

プロパティ|値
---|---
[autostartupload](%%jQueryApiUrl%%/ui.igupload#options:autostartupload)|true

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    autostartupload: true
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .AutoStartUpload(true)
    .Render()
)
```

## <a id="config-allowed-files"></a>許可されるファイル タイプの構成
### <a id="allowed-files-overview"></a>概要

ユーザーがアップロードできるファイルのタイプを構成できます。この機能は、許容されるファイル タイプの一覧で使用可能なファイル タイプのファイル名拡張子を明示的にリストして処理されます。このリストは、[allowedExtensions](%%jQueryApiUrl%%/ui.igupload#options:allowedExtensions) プロパティの値として使用可能なファイル拡張子を表す文字列の配列として設定されます。

デフォルトですべてのファイル タイプが更新できます。

ファイル拡張子の検証では、選択されたファイル拡張子を `allowedExtenstions` プロパティで宣言された拡張子の一覧と比較します。拡張子の検証が失敗すると、`igUpload` の onError イベントが発生します。onError ハンドラーの 2 つ目のパラメーターは、プロパティ `errorCode = 2` および `errorMessage = “ファイル拡張子の検証に失敗しました。”` のあるオブジェクトを含みます。ユーザーに表示するエラーはカスタマイズ可能です。

### <a id="allowed-files-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。
プロパティ設定

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
許可する拡張子を定義します。|[allowedExtensions](%%jQueryApiUrl%%/ui.igupload#options:allowedExtensions)|許可されるファイル拡張子を表す文字列の配列


### <a id="allowed-files-example"></a>例

この例は、.xls および .doc ファイルのアップロードを許可するユーザーを設定する方法を示します。

プロパティ|値
---|---
[allowedExtensions](%%jQueryApiUrl%%/ui.igupload#options:allowedExtensions)|["xls","doc"]



![](images/Configuring_igUpload_4.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$("#upload1").igUpload({
    allowedExtensions : ["xls","doc"]
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .AllowedExtensions(new List<string> { "xls", "doc"})
    .Render()
)
```



## <a id="max-number-files"></a>アップロードするファイルの最大数を構成
### <a id="number-files-overview"></a>概要

ページの更新ごとにアップロードできる最大ファイル数を構成できます。制限に達すると、`igUpload` コントロール パネルの [追加] ボタンが無効になります。ファイル選択モードが複数の場合、最大ファイル数を超えてファイルを選択するとエラーがスローされます。

デフォルトでは、アップロードするファイル数に制限はありません。

`multipleFiles = true` があると、ユーザーはしきい値より多くのファイルを選択できます。この場合、`igUpload` `onError` イベントが発生されます。`onError` ハンドラーの 1 つ目のパラメーターは、プロパティ `errorCode` = 2 および errorMessage `= “アップロードが可能な最大ファイル数を超えました。”` のあるオブジェクトを含みます。ユーザーに表示するエラーはカスタマイズ可能です。

### <a id="number-files-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。
プロパティ設定

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
最大アップロード ファイル数を設定|[maxUploadedFiles](%%jQueryApiUrl%%/ui.igupload#options:maxUploadedFiles)|必要な整数値



### <a id="number-files-example"></a>例

これは、最大ファイル アップロード数を 2 に設定します。

プロパティ|値
---|---
[maxUploadedFiles](%%jQueryApiUrl%%/ui.igupload#options:maxUploadedFiles)|2


以下の画像は、最大ファイル アップロード数に達した結果として、追加ボタンを無効にする方法を示します。

![](images/Configuring_igUpload_5.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    maxUploadedFiles: 2
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .MaxUploadedFiles(2)
    .Render()
)
```



## <a id="simultaneously-uploaded-files"></a>同時にアップロードするファイルの最大数の構成
### <a id="simultaneously-uploaded-files-overview"></a>概要

同時にアップロードできる最大ファイル数を構成できます。

アップロードするファイルが最大許容数より多い場合、アップロードするファイル数の数がその数を下回るまで、残りのファイルがスタンバイの間、最大数のファイルが同時にアップロードされます (先着ベース)。

同時アップロード可能な最大ファイル数は [maxSimultaneousFilesUploads](%%jQueryApiUrl%%/ui.igupload#options:maxSimultaneousFilesUploads) プロパティで管理されます。

### <a id="simultaneously-uploaded-files-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。
プロパティ設定

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
同時ファイル アップロードの最大数を設定します。|[maxSimultaneousFilesUploads](%%jQueryApiUrl%%/ui.igupload#options:maxSimultaneousFilesUploads)|必要な整数値


### <a id="simultaneously-uploaded-files-example"></a>例

以下のコード サンプルでは、最大ファイル アップロード数を設定する方法を示します。

プロパティ|値
---|---
[maxSimultaneousFilesUploads](%%jQueryApiUrl%%/ui.igupload#options:maxSimultaneousFilesUploads)|2

![](images/Configuring_igUpload_6.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    maxSimultaneousFilesUploads: 2
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .MaxSimultaneousFilesUploads(2)
    .Render()
)
```

## <a id="singleRequest"></a>複数ファイルのアップロードで単一の要求を使用するための構成

### <a id="singleRequest-overview"></a>概要

複数ファイルのアップロード処理がファイルごとの要求またはすべてのファイルを単一の要求で送信するかどうかを構成できます。

### <a id="singleRequest-settings"></a>プロパティ設定

以下の表では、各プロパティ設定の構成です。

目的:| 使用するプロパティ:| 設定の選択肢:
---|---|---
複数ファイルをファイルごとの要求でアップロードします。| [useSingleRequest](%%jQueryApiUrl%%/ui.igupload#options:useSingleRequest)| false (デフォルト)
複数のファイルを単一の要求でアップロードします。| [useSingleRequest](%%jQueryApiUrl%%/ui.igupload#options:useSingleRequest)| true

### <a id="singleRequest-example"></a>例

以下のコード例は、複数ファイルのアップロードに単一の要求を使用するための設定方法を紹介します。

プロパティ| 値
---|---
[useSingleRequest](%%jQueryApiUrl%%/ui.igupload#options:useSingleRequest)| true

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    useSingleRequest: true
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .useSingleRequest(true)
    .Render()
)
```

## <a id="file-display-mode"></a>ファイル表示モードの構成
### <a id="display-mode-overview"></a>概要

`igUpload` コントロールのパネルに表示するファイル数を構成できます。この機能は、`igUpload` のファイル表示モードにより管理されます。ファイル選択モードは、単一ファイル (パネルに 1 ファイルのみ表示) または複数ファイル (パネルに表示される複数ファイル)。

複数ファイル モードは、パネルに複数のファイルを垂直に表示します。

単一ファイル モードでは、一度に 1 ファイルのみ表示できます。

以下の画像は、単一ファイル モードと複数ファイル モードを比較します。

#### 単一ファイル モード 
---|---
![](images/Configuring_igUpload_7.png) 

#### 複数ファイル モード

![](images/Configuring_igUpload_8.png)

デフォルトのファイル選択モードは、単一ファイルです。

複数ファイルモードで表示されるファイル数は、[maxUploadedFiles](%%jQueryApiUrl%%/ui.igupload#options:maxUploadedFiles) で設定された数を超えることはできません。

### <a id="display-mode-settings"></a>プロパティ設定

以下の表では、任意の構成とプロパティ設定のマップを示します。
プロパティ設定

目的:|使用するプロパティ:|設定の選択肢:
---|---|---
表示モードを単一ファイルに設定する|mode|single
表示モードを複数ファイルに設定する|mode|"multiple"

### <a id="display-mode-example"></a>例

この例は、表示モードを複数ファイルに設定する方法を示します。これは以下の設定の結果です。

プロパティ|値
---|---
mode|"multiple"


![](images/Configuring_igUpload_8.png)

以下のコードはこの例を実装します。

**JavaScript の場合:**

```js
$('#upload1').igUpload({ 
    mode: 'multiple'
});
```

**ASPX の場合:**

```csharp
@(Html.Infragistics().Upload()
    .Mode(UploadMode.Multiple)
    .Render()
)
```



## <a id="related-content"></a>関連コンテンツ
### <a id="topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [ファイルをストリームとして保存](igUpload-Saving-Files-as-Stream.html): このトピックは、アップロード ファイルをファイルまたはメモリストリームとして処理し、保存する方法を説明します。詳細な手順は、各プロセスでメモリストリームとしてファイルを保存トピックをご参照ください。


### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [単一アップロード](%%SamplesUrl%%/file-upload/basic-usage): このサンプルは、`igUpload` のアップロード自動開始オプションの設定を示します。

- [複数アップロード](%%SamplesUrl%%/file-upload/multiple-upload): このサンプルは、`igUpload` の複数ファイルアップロードの構成を示します

- [進行状況の表示](%%SamplesUrl%%/file-upload/progress-information): このサンプルは、`igUpload` コントロールに対し、最大アップロード ファイル数と最大同時ファイル アップロード数を設定する例を示します。



 

 


