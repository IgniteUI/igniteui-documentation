<!--
|metadata|
{
    "fileName": "ighierarchicalgrid-grouping-overview",
    "controlName": "igHierarchicalGrid",
    "tags": []
}
|metadata|
-->

# グループ化の概要 (igHierarchicalGrid)

## トピックの概要
### 目的

igHierarchicalGrid™ コントロールのグループ化機能を紹介し、この機能の設定項目に関する概要を示します。

#### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [概要](#introduction)
-   [グループ化構成の概要](#summary)
-   [関連コンテンツ](#related-content)

## <a id="introduction"></a> 概要

### igHierarchicalGrid におけるグループ化の概要

igHierarchicalGrid コントロールは、連携して機能するフラットなグリッド オブジェクトの集合体 (igGrid™) として実装されています。グループ機能は、階層グリッド内でフラットなグリッドがいくつもネスティングされているという状況にも対処できるように強化されています。

igHierarchicalGrid コントロールは列グループ化機能をサポートしています。ユーザーは、1 つまたは複数の列値をグループ化の基準 (たとえば、第 1 基準、第 2 基準、…等々) にしてグリッド列をグループ化することができ、複数の列値をグループ化の基準として選択した場合には、さらに各グループ内のレコードをグループ化することもできます。

igHierarchicalGrid におけるグループ化の仕組みは、Microsoft® Office Outlook® のグループ化機能と同じです。グループ化の基準として使用したい列をグリッドの上にある特別なグループ化基準領域にドラッグしてください。すると、選択した列値によってグリッド列がグループ化されて並べ替えられます　(グループは、当該の列値の種類と同じ数だけ作成されます)。また、各グループの内部でもレコードの並び替えが行われます。すでに存在するグループに追加の列をドロップすると、さらに各グループが細かくグループ化されます。

igGridGroupBy™ ウィジェットを使用することにより、カスタムのグループ化メソッドを定義/実装/管理できます。

次のスクリーンショットは、ルート レベルで Color 列の値を使用してグリッド内のデータをグループ化して並べ替えた階層グリッドを示したものです。つまり、このグリッドはルート レベルで Color 列によってグループ化されています。このグリッドの子のレベルに表示されているデータは、Shelf 列によるグループ化が設定されている ProductInventories テーブルのデータです。グループ化基準領域 (この領域が有効になっている場合) とグループ ヘッダー行には、グループ化の基準として使用されている列が、それぞれの列値とともに表示されます。

![](images/igHierarchicalGrid_Grouping_Overview_1.png)



## <a id="summary"></a> グループ化構成の概要
#### グループ化構成の概要図

igHierarchicalGrid コントロールに関連した igGridGroupBy ウィジェットのユーザー設定オプション。

<table class="table table-striped">
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
グループ化モード
			</td>

            <td>
igGridGroupBy ウィジェットはローカルおよびリモートのグループ化モードに対応しています。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [type](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
MVC: [Type](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~Type.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
列の設定
			</td>

            <td>
このオプションを使用すると、各列のグループ化基準を別個に設定できます。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [columnSettings](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
MVC: [ColumnSettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ColumnSettings.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
グループの集計
			</td>

            <td>
グループの集計には、個々のグループに固有な情報 (たとえば、そのグループに含まれる列数といった情報) が表示されます。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [summarySettings](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
MVC: [SummarySettings](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~SummarySettings.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
グループ化される行テキストのテンプレート
			</td>

            <td>
グループ化される行テキストのテンプレート。
			</td>

            <td>
                <ul>
                    <li>
jQuery: [groupedRowTextTemplate](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
MVC: [GroupedRowTextTemplate](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupedRowTextTemplate.html)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
クライアント イベント
			</td>

            <td>
                igGridGroupBy ウィジェットには、そのライフサイクル中に処理できる特殊なイベントがあります。こうしたイベントは、次のような場合に発生します。

                <ul>
                    <li>
グループ化アクションが開始したとき。(キャンセル可能)
					</li>

                    <li>
グループ化アクションが終了したとき。
					</li>
                </ul>
            </td>

            <td>
                jQuery:

                <ul>
                    <li>
[groupedColumnsChanging](%%jQueryApiUrl%%/ui.iggridselection_hg#events)
					</li>

                    <li>
[groupedColumnsChanged](%%jQueryApiUrl%%/ui.iggridselection_hg#events)
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
外観
			</td>

            <td>
グループ インジケーターのルック アンド フィールや各インジケーターのテキストを変更するための機能が数多く用意されています。
			</td>

            <td>
                jQuery:

                <ul>
                    <li>
[groupByAreaVisibility](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[initialExpand](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[emptyGroupByAreaContent](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[expansionIndicatorVisibility](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[groupByLabelWidth](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[labelDragHelperOpacity](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[indentation](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[expandTooltip](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[collapseTooltip](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>

                    <li>
[removeButtonTooltip](%%jQueryApiUrl%%/ui.iggridselection_hg#options)
					</li>
                </ul>

                MVC:

                <ul>
                    <li>
[GroupByAreaVisibility](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupByAreaVisibility.html)
					</li>

                    <li>
[InitialExpand](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~InitialExpand.html)
					</li>

                    <li>
[EmptyGroupByAreaContent](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~EmptyGroupByAreaContent.html)
					</li>

                    <li>
[ExpansionIndicatorVisibility](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ExpansionIndicatorVisibility.html)
					</li>

                    <li>
[GroupByLabelWidth](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~GroupByLabelWidth.html)
					</li>

                    <li>
[LabelDragHelperOpacity](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~LabelDragHelperOpacity.html)
					</li>

                    <li>
[Indentation](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~Indentation.html)
					</li>

                    <li>
[ExpandTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~ExpandTooltip.html)
					</li>

                    <li>
[CollapseTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~CollapseTooltip.html)
					</li>

                    <li>
[RemoveButtonTooltip](Infragistics.Web.Mvc~Infragistics.Web.Mvc.GridGroupBy~RemoveButtonTooltip.html)
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



## <a id="related-content"></a> 関連コンテンツ

### トピック
このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [グループ化の有効化と構成](igHierarchicalGrid-Grouping-Enabling-and-Configuring.html): このトピックでは、コード例を使用して、 jQuery および MVC の両方で igHierarchicalGrid™ コントロールのグループ化機能を有効にして構成する方法を示します。
- [igGridGroupBy jQuery リファレンス](%%jQueryApiUrl%%/ui.iggridselection_hg): igGridGroupBy コントロールに関する jQuery オプション、メソッド、イベント、およびスタイル クラスのリファレンスです。

