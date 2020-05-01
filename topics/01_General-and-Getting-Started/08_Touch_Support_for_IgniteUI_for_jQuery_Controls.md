<!--
|metadata|
{
    "fileName": "touch-support-for-igniteui-for-jquery-controls",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# %%ProductName%% コントロールのタッチ サポート



##トピックの概要


#### 目的

このトピックは、%%ProductName%% コントロールがタッチ対応の環境の概要、ベスト プラクティス、特定の %%ProductName%% コントロールのタッチ サポートの詳細を提供します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#_Introduction)
    -   [タッチ サポートの概要](#_Touch_support_summary)
    -   [タッチ環境でのスクロール](#_Scrolling_in_touch_environment)
    -   [モバイル ページのベスト プラクティス](#_Mobile_Pages_Best_Practices)
-   [特定のコントロールのタッチ サポートの詳細](#_Touch_Support_Specifics_of_Individual_Controls)
    -   [igGrid](#_igGrid)
    -   [igHierarchicalGrid](#_igHierarchicalGrid)
    -   [igPopover](#_igPopover)
    -   [igVideoPlayer](#_igVideoPlayer)



##<a id="_Introduction"></a>概要


####<a id="_Touch_support_summary"></a> タッチ サポートの概要

すべての %%ProductName%% コントロールがタッチ操作をサポートしています。タッチ操作と互換性のある動作をサポートするため、新しい機能とコンポーネントを追加することで、このサポートが可能になります。

タッチ操作対応環境で表示されたどの %%ProductName%% コントロールも、デスクトップ プラットフォームとタッチ プラットフォームで同じ外観を持ち、同じ動作をします。たとえば、igGrid™ ウィジェットはタッチ デバイスの完全に新しいコントロールではありませんが、タッチ操作対応環境で使用できるタッチ操作に最適化された機能が組み込まれています。ほとんど構成が必要ないこの適応性により、アプリケーションにマルチプラットフォーム コントロールを持たせることができます。個々のコントロールに関する詳細については、「コントロールの概要」のセクションを参照してください。

>**注:** Modernizr JavaScript ライブラリを %%ProductName%% コントロールとともに使用することをお勧めします。これらのコントロールは Modernizr がなくても正常に動作しますが、ライブラリがページで使用できる場合、よりタッチしやすいモードに適応します。

###<a id="_Scrolling_in_touch_environment"></a> タッチ環境でのスクロール

すべての %%ProductName%% コントロールは、タッチ操作対応環境で動作している場合、デフォルトで並べ替えをサポートしています。並べ替え動作は、内部 *igScroll* コンポーネントで制御されます。

タッチ環境でスクロール動作を使用するには、ページで igScroll スクリプトを参照する必要があります。[Infragistics® Loader](Using-Infragistics-Loader.html) を使用する場合、これは自動的に参照されています。Loader を使用しない場合、手動的に参照するか、igScroll を含む infragistics.core.js ファイルを参照する必要があります。

手動的に igScroll を参照する:

**HTML の場合:**

```html
<script type="text/javascript" src="js/modules/infragistics.ui.scroll.js"></script>
```

*igScroll* コンポーネントを使用して、`<div>` のような他の HTML 要素をスクロールできるようにします。

**HTML の場合:**

```html
<div data-scroll=”true”></div>
```

このようにして、*igScroll* コンポーネントは、タッチ対応のブラウザーでコンテナーをスクロールできるようにします。

####<a id="_Mobile_Pages_Best_Practices"></a>モバイル ページのベスト プラクティス

%%ProductName%% コントロールは、タッチ操作だけでなく、標準のデスクトップ Web ブラウザー操作にも最適化されています。stock コントロールを使用することに加えて、各コントロールで最高のパフォーマンスと応答を実現するため、以下に示すいくつかのベスト プラクティスに従ってください。

-   Modernizr の使用 - 可能な限りタッチ操作が最適化されたモードでコントロールが表示されるよう、Modernizr JavaScript ライブラリを %%ProductName%% コントロールと合わせて使用します。
-   ビューポート メタ タグの定義 - ページのビューポート ディメンションを明示的に設定すると、ページが正しいディメンションと割合で表示されます。以下のコード リストは、ページのビューポート メタ タグを構成する方法を示しています。

**HTML の場合:**

```html
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1, 
               maximum-scale=2.5, 
               minimum-scale=0.1, 
               user-scalable=yes" />
```

##<a id="_Touch_Support_Specifics_of_Individual_Controls"></a>特定のコントロールのタッチ サポートの詳細


###タッチ サポート コントロールの概要

以下の表は、タッチ対応の環境でコントロールの詳細を表示します。表の後に、アップデートされた各コントロールのその他の詳細が紹介されています。

<table class="table table-striped">
    <thead>
        <tr>
            <th>
コントロール
            </th>

            <th>
説明
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
[*igGrid*](#_igGrid)
            </td>
            <td>
一部の機能に、タッチ操作に最適化されているプロパティが組み込まれています。
            </td>
        </tr>

        <tr>
            <td>
[*igHierarchicalGrid*](#_igHierarchicalGrid)
            </td>
            <td>
igHierarchicalGrid™ は内部的に igGrid ウィジェットを使用します。したがって、igGrid のすべてのタッチ対応機能も igHierarchicalGrid ウィジェットで使用できます。
            </td>
        </tr>

        <tr>
            <td>
[*igPopover*](#_igPopover)
            </td>
            <td>
コントロールは、タッチ環境で完全に機能します。唯一の制限はアクティブ化イベントを構成できないことです。アクティブ化が設定されたイベントでも、タッチ対応デバイスでタップした場合は常にポップオーバーが表示されます。
            </td>
        </tr>

        <tr>
            <td>
[*igVideoPlayer*](#_igVideoPlayer)
            </td>

            <td>
Modernizr ライブラリが使用できる場合、igVideoPlayer™ はデフォルト ブラウザーのビデオ プレーヤーにフォールバックします。
            </td>
        </tr>
    </tbody>
</table>

###<a id="_igGrid"></a> igGrid

以下のリストに、タッチ機能をサポートするプロパティがあるか、タッチ操作対応環境で正常に動作するよう特殊な変更が必要な igGrid 機能についてまとめています。

-   **機能セレクター**
-   **Groupby**
-   **非表示**
-   **複数選択** - タッチ プラットフォームで複数セルを選択する可能になる特別な選択プロパティがあります。
-   **複数並べ替え**
-   **行セレクター** - タッチ プラットフォームで複数の行を選択する場合、明示的に行セレクターを定義する必要があります。(複数の行を選択するには、行セレクター ウィジェットを使用する必要があります。)
-   **ツールチップ** - popover スタイルを使用します。タッチのために実装されるツールチップ スタイルです。

### 関連コンテンツ

<table class="table table-striped">
    <thead>
        <tr>
            <th>
機能
            </th>

            <th>
コンテンツ
            </th>
        </tr>
    </thead>
    <tbody>
        

        <tr>
            <td>
**機能セレクター**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](igGrid-Feature-Chooser.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](%%SamplesUrl%%/grid/feature-chooser)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**非表示**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 列選択の非表示](igGrid-Hiding-Column-Chooser.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](%%SamplesUrl%%/grid/feature-chooser)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**Groupby**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid モーダルのグループ化ダイアログ](igGrid-Group-By-Dialog-Overview.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid グループ化のカスタマイズ](%%SamplesUrl%%/grid/grouping-customization)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**複数選択**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 複数セルの選択](igGrid-Multiple-Cell-Selection.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 選択](%%SamplesUrl%%/grid/selection)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**複数並べ替え**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 多重並べ替えダイアログ ウィンドウ](igGrid-Multiple-Sorting-Dialog.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](%%SamplesUrl%%/grid/feature-chooser)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**行セレクター**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 行セレクターの有効化](igGrid-Row-Selectors.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 行セレクター](%%SamplesUrl%%/grid/row-selectors)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**ツールチップ**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid ツールチップ ポップオーバー](igGrid-Popover-Style-for-Tooltips.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid ツールチップ](%%SamplesUrl%%/grid/tooltips)
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



###<a id="_igHierarchicalGrid"></a>igHierarchicalGrid

*igHierarchicalGrid* 機能をタッチ対応にするには、*igGrid* コントロールと同じように設定を構成します。

以下のリストに、タッチ機能をサポートするプロパティについて、およびタッチ操作対応環境で正常に動作するよう特殊な変更が必要な *igHierarchicalGrid* 機能についてまとめています。

-   **機能セレクター**
-   **Groupby**
-   **非表示**
-   **複数選択** - タッチ プラットフォームで複数セルを選択する可能になる特別な選択プロパティがあります。(igHierarchicalGrid については、選択機能が継承されていないため、親グリッドで選択機能を有効にする必要があります。)
-   **複数並べ替え**
-   **行セレクター** - タッチ プラットフォームで複数の行を選択する場合、明示的に行セレクターを定義する必要があります。(複数の行を選択するには、行セレクター ウィジェットを使用する必要があります。)
-   **ツールチップ** - popover スタイルを使用します。タッチのために実装されるツールチップ スタイルです。

>**注:** igHierarchicalGrid は内部的に *igGrid* を使用しているため、これらの機能に関するトピックは *igGrid* トピックになります。唯一の例外は、2 つのグリッド間でモーダル ダイアログが異なる *igHierarchicalGrid* の *igGrid* Group By 機能です。

### 関連コンテンツ

<table class="table table-striped">
    <thead>
        <tr>
            <th>
機能
            </th>

            <th>
コンテンツ
            </th>
        </tr>
    </thead>
    <tbody>
        

        <tr>
            <td>
**機能セレクター**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](igGrid-Feature-Chooser.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](%%SamplesUrl%%/grid/feature-chooser)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**非表示**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 列選択の非表示](igGrid-Hiding-Column-Chooser.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid 機能セレクター](%%SamplesUrl%%/grid/feature-chooser)
                    </li>
                </ul>

                
            </td>
        </tr>

        <tr>
            <td>
**Groupby**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid モーダルのグループ化ダイアログ](igGrid-Group-By-Dialog-Overview.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[集計とグループ化](%%SamplesUrl%%/grid/grouping)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**複数選択**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 複数セルの選択](igGrid-Multiple-Cell-Selection.html)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**複数並べ替え**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid 多重並べ替えダイアログ ウィンドウ](igGrid-Multiple-Sorting-Dialog.html)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**行セレクター**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igHierarchicalGrid 行セレクターの有効化](igHierarchicalGrid-Enabling-RowSelectors.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igHierarchicalGrid 行セレクター](%%SamplesUrl%%/hierarchical-grid/row-selectors)
                    </li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**ツールチップ**
            </td>

            <td>
                <h4>関連トピック</h4>

                <ul>
                    <li>
[igGrid ツールチップ ポップオーバー](igGrid-Popover-Style-for-Tooltips.html)
                    </li>
                </ul>

                <h4>関連サンプル</h4>

                <ul>
                    <li>
[igGrid ツールチップ](%%SamplesUrl%%/grid/tooltips)
                    </li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



### <a id="_igPopover"></a>igPopover

*igPopover* はデフォルトでタッチ デバイスにサポートされます。タッチ環境では、activating イベントを制御できません。コントロールは常にタップで表示されます。activating として設定されるイベントは無視されます。つまり、[showOn](%%jQueryApiUrl%%/ui.igpopover#options) オプションの設定は無視されます。

######関連トピック

-   [igPopover の概要](igPopover-Overview.html)

###### 関連サンプル

-   [基本的な使用方法](%%SamplesUrl%%/popover/basic-popover)
-   [ASP.NET MVC の基本的な使用方法](%%SamplesUrl%%/popover/aspnet-mvc-helper)

###<a id="_igVideoPlayer"></a> igVideoPlayer

Modernizr ライブラリがページで使用できる場合にモバイル デバイスで *igVideoPlayer* コントロールを実行しているとき、ブラウザーのデフォルト ビデオ プレーヤーがユーザーに表示されます。Modernizr ライブラリが使用できない場合、実際の *igVideoPlayer* コントロールがユーザーに表示されます (*igVideoPlayer* コントロールの方が、デフォルトのコントロールよりタッチ機能が少ない場合もあります)。

###### 関連サンプル

-   [ビデオ プレーヤーの基本的な使用方法](%%SamplesUrl%%/video-player/basic-usage)



 

 


