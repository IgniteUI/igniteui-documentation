<!--
|metadata|
{
    "fileName": "igdatachart-series-requirements",
    "controlName": "",
    "tags": []
}
|metadata|
-->

# シリーズ要件



`igDataChart`™ コントロールは、多数のさまざまなシリーズをサポートしており、これらのシリーズの一部はチャート プロット領域に正しく描画するために固有の軸タイプおよびデータ マッピングを必要とします。

###概要


トピックは以下のとおりです。

-   [カテゴリ シリーズの要件](#category)
-   [散布シリーズの要件](#scatter)
-   [極座標シリーズおよびラジアル シリーズの要件](#polar-and-radial)
-   [財務シリーズの要件](#financial)

##<a id="category"></a>カテゴリ シリーズの要件


表 1 は `igDataChart` コントロールでカテゴリ シリーズと共に使用できる軸タイプを示します。この表は、これらのシリーズによって必要とされるデータ メンバーも示します。

<div class="document-table-container">
    <table class="table table-striped">
        <tbody>
            <tr>
                <th>シリーズ タイプ</th>

                <th>numericXAxis</th>

                <th>numericYAxis</th>

                <th>categoryXAxis</th>

                <th>categoryYAxis</th>

                <th>categoryDateTimeXAxis</th>

                <th>valueMemberPath</th>

                <th>highMemberPath</th>

                <th>lowMemberPath</th>
            </tr>

            <tr>
                <td>エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>棒シリーズ</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>柱状シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>行シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ポイント シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>範囲領域シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>範囲柱状シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>スプライン シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>スプライン エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型棒シリーズ</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型柱状シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型折れ線シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型スプライン シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型スプライン エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 エリア シリーズ</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 棒シリーズ</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 柱状シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 折れ線シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 スプライン シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>積層型 100 スプライン エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X*</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ステップ エリア シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ステップ折れ線シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ウォーターフォール シリーズ</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>
        </tbody>
    </table>
</div>

##<a id="scatter"></a>散布シリーズの要件 


表 2 は `igDataChart` コントロールで散布シリーズと共に使用できる軸タイプを示します。この表は、これらのシリーズによって必要とされるデータ メンバーも示します。
<div class="document-table-container">
    <table class="table table-striped">
        <tbody>
            <tr>
                <th>シリーズ タイプ</th>

                <th>numericYAxis</th>

                <th>numericXAxis</th>

                <th>categoryXAxis</th>

                <th>categoryDateTimeXAxis</th>

                <th>xMemberPath</th>

                <th>yMemberPath</th>

                <th>labelMemberPath</th>

                <th>fillMemberPath</th>

                <th>radiusMemberPath</th>
            </tr>

            <tr>
                <td>ScatterSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ScatterLineSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>ScatterSplineSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>BubbleSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>HighDensityScatterSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>
        </tbody>
    </table>
</div>

##<a id="polar-and-radial"></a>極座標シリーズおよびラジアル シリーズの要件


表 3 は `igDataChart` コントロールで極座標シリーズおよびラジアル シリーズと共に使用できる軸タイプを示します。この表は、これらのシリーズによって必要とされるデータ メンバーも示します。
<div class="document-table-container">
    <table class="table table-striped">
        <tbody>
            <tr>
                <th>シリーズ タイプ</th>

                <th>numericRadiusAxis</th>

                <th>numericAngleAxis</th>

                <th>categoryAngleAxis</th>

                <th>valueMemberPath</th>

                <th>angleMemberPath</th>

                <th>radiusMemberPath</th>
            </tr>

            <tr>
                <td>PolarAreaSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PolarLineSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PolarScatterSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PolarSplineAreaSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PolarSplineSeries</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>RadialAreaSeries</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>RadialColumnSeries</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>RadialLineSeries</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>RadialPieSeries</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>
            </tr>
        </tbody>
    </table>
</div>

##<a id="financial"></a>財務シリーズの要件


表 4 は `igDataChart` コントロールで財務物価シリーズおよび財務インジケーターと共に使用できる軸タイプを示します。この表は、これらのシリーズによって必要とされるデータ メンバーも示します。
<div class="document-table-container">
    <table class="table table-striped">
        <tbody>
            <tr>
                <th>シリーズ タイプ</th>

                <th>numericYAxis</th>

                <th>numericXAxis</th>

                <th>categoryXAxis</th>

                <th>categoryDateTimeXAxis</th>

                <th>highMemberPath</th>

                <th>lowMemberPath</th>

                <th>openMemberPath</th>

                <th>closeMemberPath</th>

                <th>volumeMemberPath</th>
            </tr>

            <tr>
                <td>FinancialPriceSeries</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>AbsoluteVolumeOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>
            </tr>

            <tr>
                <td>AccumulationDistributionIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>AverageDirectionalIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>AverageTrueRangeIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>BollingerBandsOverlay</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>BollingerBandWidthIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>ChaikinOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>ChaikinVolatilityIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>CommodityChannelIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>DetrendedPriceOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>EaseOfMovementIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>
            </tr>

            <tr>
                <td>FastStochasticOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>ForceIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>FullStochasticOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>MarkerFacilitationIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>MassIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>MedianPriceIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>MoneyFlowIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>MovingAverageConvergenceDivergenceIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>NegativeVolumeIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>OnBalanceVolumeIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PercentagePriceOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td>X</td>
            </tr>

            <tr>
                <td>PercentageVolumeOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>
            </tr>

            <tr>
                <td>PositiveVolumeIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PriceVolumeTrendIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td>X</td>
            </tr>

            <tr>
                <td>PriceChannelOverlay</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>
            </tr>

            <tr>
                <td>RateOfChangeAndMomentumIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>RelativeStrengthIndexIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>SlowStochasticOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>StandardDeviationIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>StochRSIIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>TRIXIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td></td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>TypicalPriceIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>UltimateOscillatorIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>WeightedCloseIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>

            <tr>
                <td>WilliamsPercentRIndicator</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td>X</td>

                <td></td>

                <td>X</td>

                <td></td>
            </tr>
        </tbody>
    </table>
</div>

 


