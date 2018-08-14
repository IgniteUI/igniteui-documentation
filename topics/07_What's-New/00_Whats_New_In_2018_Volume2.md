<!--
|metadata|
{
    "fileName": "whats-new-in-2018-volume2",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 2018 Volume 2 の新機能

このトピックでは、Ignite UI™ 2018 Volume 2 リリースのコントロールと新機能および拡張機能を紹介します。


### 概要

以下の表は、2018 Volume 2 リリースの新機能の概要です。機能の詳細については表の下をご覧ください。

### igSpreadsheet
機能 | 説明
---|---
[FormatCells ダイアログ](#FormatCellsDialog)| スプレッドシートの FormatCells ダイアログ

## FormatCellsDialog

### <a id="FormatCellsDialog"></a> スプレッドシートの FormatCellsDialog

igSpreadsheet を使用してセル データの表示方法を変更できます。たとえば、小数点の右にある桁数を指定、あるいはセルにパターンおよび境界線を追加できます。この設定を「セルの書式設定」ダイアログ ボックスでアクセスして変更できます。

- 表示形式タブ

デフォルトですべてのワークシート セルが一般的な数値形式で書式設定されます。一般的な形式では、セルに入力された値はそのまま使用されます。たとえば、セルに 36526 と入力して Enter を押した場合、セル コンテンツは 36526 と表示されます。セルで一般的な数値形式が使用されるためです。ただし、最初にセルを通貨として書式設定した場合、数字 36526 は $36,526.00 として表示されます。

![](images/Format_Cells_Dialog_Number.png)

- 配置タブ

テキストと数値を配置し、配置タブを使用してセルの方向を変更してテキスト コントロールを指定できます。

![](images/Format_Cells_Dialog_Alignment.png)

- フォント タブ

用語「フォント」は、書体 (Arial など) とその属性 (ポイント サイズ、フォント スタイル、下線、色、エフェクト) を指します。セル書式設定ダイアログ ボックスのフォント タブを使用してこれらの設定を制御します。ダイアログ ボックスのプレビュー セクションのレビューで設定のプレビューを表示できます。

![](images/Format_Cells_Dialog_Font.png)

- 罫線タブ

Excel で単一セルまたはセルの範囲の周りに境界線を配置できます。セルの左上角から右下角、またはセルの左下角から右上角へ線を描画できます。線のスタイル、線の太さ、または線の色を変更してデフォルト設定のセルの境界線をカスタマイズできます。

![](images/Format_Cells_Dialog_Border.png)

- 塗りつぶしタブ

セル書式設定ダイアログ ボックスの塗りつぶしタブを使用して選択セルの背景色を設定します。[パターン リスト] を使用して 2 色パターンまたはセル背景にシェードを適用できます。

![](images/Format_Cells_Dialog_Fill.png)

- 保護タブ

[保護] タブでワークシートをロックしてデータや数式を保護できます。このオプションは、ワークシートも保護しない限り、効果はありません。

![](images/Format_Cells_Dialog_Protection.png)

#### 関連トピック
[igSpreadsheet FormatCell ダイアログ](igspreadsheet-FormatCell-Dialog.html)

