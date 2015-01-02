<!--
|metadata|
{
    "fileName": "igbulletgraph-known-issues-and-limitations",
    "controlName": "igBulletGraph",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題点および制限事項 (igBulletGraph)

## 既知の問題と制限

#### 概要

以下の表に、`igBulletGraph` コントロールの既知の問題点と制限事項を簡単に説明します。以下の概要表に、いくつかの問題に関する既知の問題の詳細説明と考えられる回避策が記載されています。

#### 凡例:
<table class="table">
	<tbody>
		<tr>
			<td>![](images/Known_Issues_and_Limitations_Solution.png)</td>
			<td>回避策</td>
		</tr>
		<tr>
			<td>![](images/Known_Issues_and_Limitations_NoSolution.png)</td>
			<td>既知の回避策はありません</td>
		</tr>
		<tr>
			<td>![](images/Known_Issues_and_Limitations_FixPlanned.png)</td>
			<td>修正予定です</td>
		</tr>
	</tbody>
</table>


#### [igBulletGraph](#igBulletGraph)

問題|説明|状態
---|---|---
[1 つのパフォーマンス バーと、1 つの比較マーカーのみがサポートされています](#_SingleCMAndPB)|`igBulletGraph` コントロールは、1 つのパフォーマンス バーと 1 つの比較マーカーのみをサポートします。 | ![](images/Known_Issues_and_Limitations_Solution.png)
[ラベル競合の検出なし](#_NoLabelsCollision)|`igBulletGraph` コントロールは、ラベル競合を検出する手段を提供していません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。 | ![](images/Known_Issues_and_Limitations_Solution.png)
パフォーマンス バーは、最小スケールの位置からのみ描画することができます。|パフォーマンス バーの開始位置は、スケールの最小値の位置のみです。パフォーマンス バーを任意の場所から始めることはできません。 | ![](images/Known_Issues_and_Limitations_NoSolution.png) ![](images/Known_Issues_and_Limitations_FixPlanned.png)


## <a id="igBulletGraph"></a> igBulletGraph

#### <a id="_SingleCMAndPB"></a> 1 つのパフォーマンス バーと、1 つの比較マーカーのみがサポートされています

`igBulletGraph` コントロールは、1 つのパフォーマンス バーと 1 つの比較マーカーのみをサポートします。

> **回避方法**
>
複数のパフォーマンス バーまたは複数の比較マーカーの描画効果は、コントロールの複数のインスタンスをオーバーレイすると達成できます。

#### <a id="_NoLabelsCollision"></a> ラベル競合の検出なし

`igBulletGraph` コントロールは、ラベル競合を検出する手段を提供していません。その結果、ラベルを表示するスペースが十分にない場合は、ラベル競合が発生する可能性があります。

> **回避方法**
>
コントロールのコンテナーに、ラベルを適切に表示できる十分なスペースがあることを確認してください。



 

 


