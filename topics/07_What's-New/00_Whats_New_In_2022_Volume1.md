<!--
|metadata|
{
    "fileName": "whats-new-in-2022-volume1",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 2022 Volume 1 の新機能

このトピックは、%%ProductFamilyName%%™ 2022 Volume 1 リリースの新機能について説明します。

## チャート機能
=== データ チャート:
 * 積層シリーズのアニメーションとトランジションインのサポートが追加されました。`IsTransitionInEnabled` プロパティを true に設定すると、アニメーションを有効にできます。そこから、`TransitionInDuration` プロパティを設定してアニメーションが完了するまでの時間を決定し、`TransitionInMode` でアニメーションのタイプを決定できます。
=== カテゴリ チャー、財務チャート、データ チャート
 * 追加された `AssigningCategoryStyle` イベントは、DataChart のすべてのシリーズで利用できるようになりました。このイベントは、背景色の `Fill` や強調表示など、シリーズ項目の外観を条件付きで構成する場合に処理されます。
 * CalloutLayer の新しい `AllowedPositions` 列挙体。チャート内のどこにコールアウトを配置するかを制限するために使用されます。デフォルトでは、コールアウトは最適な場所に配置されますが、これは TopLeft、TopRight、BottomLeft、または BottomRight を強制するために使用されます。
 * 注釈レイヤーに追加された新しいコーナー半径プロパティ。各コールアウトのコーナーを丸めるために使用されます。コーナー半径がデフォルトで追加されていることに注意してください。
	- CalloutLayer の `CalloutCornerRadius`
	- FinalValueLayer の `AxisAnnotationBackgroundCornerRadius`
	- CrosshairLayer の `XAxisAnnotationBackgroundCornerRadius` と `YAxisAnnotationBackgroundCornerRadius`	
 * さまざまな方法でスクロールバーを有効にするための新しい `HorizontalViewScrollbarMode` および `VerticalViewScrollbarMode` 列挙体。`IsVerticalZoomEnabled` または `IsHorizontalZoomEnabled` と組み合わせると、チャートをナビゲートするための軸に沿ったスクロールバーを、常設またはフェードインおよびフェードアウトすることができます。
 * 新しい `FavorLabellingScaleEnd` は、軸がスケールの最後にラベルを表示することを優先するかどうかを決定します。数値軸 (NumericX、NumericY、PercentChangeY など) とのみ互換性があります。
 * 新しい `IsSplineShapePartOfRange` は、軸に要求された軸範囲にスプライン形状を含めるかどうかを決定します。
 * 新しい `XAxisMaximumGap` は、`XAxisGap` を使用するときにプロットされたシリーズの最大許容値を決定します。ギャップは、プロットされたシリーズの列またはバー間のスペースの量を決定します。
 * 新しい `XAxisMinimumGapSize` は、XAxisGap を使用するときに、プロットされたシリーズの最小許容ピクセルベース値を決定し、各カテゴリ間に常にある程度の間隔があることを保証します。
