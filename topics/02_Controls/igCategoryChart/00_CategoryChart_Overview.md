<!--
|metadata|
{
    "fileName": "categorychart-overview",
    "controlName": "igCategoryChart",
    "tags": ["API", "CategoryChart", "Axes"]
}
|metadata|
-->

# 概要 

### igCategoryChart について

igCategoryChart は軽量で高パフォーマンスなチャートです。このチャートは、シンプルで直感的な API を使用したカテゴリ データの表示を簡単に構成できます。データ (コレクションまたはコレクションのコレクション) をバインドするだけで後の作業はチャートがすべて行います。

以下のスクリーンショットは、柱状チャートを表示したカテゴリ チャートです。

![](images/categorychart-configuring-title-01.png)

スマート データ アダプターを使用して、データは分析されて適切なビジュアライゼーションが描画されます。たとえば `chartType` を `Auto` に設定した場合、大きなデータセットで折れ線チャートを描画する間、コントロールは小さなデータセットを提供して柱状チャートがプロットされるかどうかを決定します。

ただし、`chartType` を明示的に以下に設定してチャートタイプを指定することもできます。
    
- Line
- Area
- Column
- Point
- Spline
- SplineArea
- StepArea
- StepLine
- Waterfall

その他のカテゴリ チャート コントロールの直感的な動作の例は、明示的にラベルを設定する必要がないことです。カテゴリ チャートは、提供したデータ内で最初の適切な文字列プロパティを使用し、ラベルに使用します。

コントロールは簡単に構成できるよう構築されており、エンジンとしてデータチャート コントロールを使用しています。つまり、高パフォーマンスでパワフルなデータ チャートの利点を備えています。カテゴリ チャートは、データチャート コントロールのパワフルで広範な機能を拡張できます。

*関連トピック:* 

- [チュートリアル](igcategorychart-adding.html)

- [データ バインド](categorychart-binding-to-data.html)
