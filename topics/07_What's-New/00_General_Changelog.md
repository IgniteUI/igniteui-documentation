<!--
|metadata|
{
    "fileName": "general-changelog",
    "controlName": [],
    "tags": []
}
|metadata|
-->

# 変更ログ

- **リリースされたバージョン**
    - 2025 年 4 月
        - [24.2.7](#2427)
        - [24.1.12](#24112)
    - 2025 年 2 月
        - [24.2.6](#2426)
        - [24.1.11](#24111)
        - [23.2.60](#23260)
    - 2025 年 1 月
        - [24.2.3](#2423)
    - 2024 年 9 月
        - [24.1.9](#2419)
        - [23.2.58](#23258)

## <a id="2427"></a> 24.2.7

### 修正

- 非推奨となった以下の jQuery API の使用を置き換えました:
    - `jQuery.css` による `outline` の 0 設定
    - `jQuery.isArray`
    - `keydown`、`mousedown`、`dblclick`、`focus`、`select` などのショートハンド関数

## <a id="24112"></a> 24.1.12

### 修正

- 非推奨となった以下の jQuery API の使用を置き換えました:
    - `jQuery.css` による `outline` の 0 設定
    - `jQuery.isArray`
    - `keydown`、`mousedown`、`dblclick`、`focus`、`select` などのショートハンド関数

## <a id="2426"></a> 24.2.6

### 修正

- さまざまな 3.x リリースから非推奨の jQuery API の使用を置き換えました。

## <a id="24111"></a> 24.1.11

### 修正

- さまざまな 3.x リリースから非推奨の jQuery API の使用を置き換えました。

## <a id="23260"></a> 23.2.60

### 修正

- さまざまな 3.x リリースから非推奨の jQuery API の使用を置き換えました。

## <a id="2423"></a> 24.2.3
### 追加
- Infragistics %%ProductNameASPNETCore%% で ASP.NET Core for .NET 9 プロジェクトがサポートされます。詳細情報は、[%%ProductNameASPNETCore%% の使用](Using-IgniteUI-Controls-in-ASP.NET-Core-project.html)トピックを参照してください。
- Infragistics %%ProductName%% は、最近リリースされた jQuery 3.7 および jQuery UI 1.14 をサポートするようになりました。
- igGrid および igHierarchicalGrid
   - 新しいプロパティ `rowAttributeTemplate` を使用すると、行に任意の属性を追加できます [#2249](https://github.com/IgniteUI/ignite-ui/issues/2249)
- igGridFiltering
   - 新しいプロパティ `filterCellLabelTemplate` (対応する列設定を通じて列ごとにオーバーライド可能) を使用すると、列フィルターに関する追加情報を提供する視覚的なラベルをヘッダー セルに表示できます [#2244](https://github.com/IgniteUI/ignite-ui/issues/2244)

## <a id="2419"></a> 24.1.9

### 修正

- グリッド フィルタリング - アクセシビリティ ツールの使用時に条件ドロップダウンをナビゲートできるようになりました [#2245](https://github.com/IgniteUI/ignite-ui/issues/2245)

### 追加

- グリッド フィルタリング - 条件ドロップダウンの展開/縮小状態を示す ARIA 属性 [#2241](https://github.com/IgniteUI/ignite-ui/issues/2241)、[#2243](https://github.com/IgniteUI/ignite-ui/issues/2243)
- グリッド フィルタリング - フィルタリング行のボタンの ARIA ロール [#2240](https://github.com/IgniteUI/ignite-ui/issues/2240)
- グリッド フィルタリング - フィルター入力用のより詳細な ARIA ラベル [#2242](https://github.com/IgniteUI/ignite-ui/issues/2242)

### 変更

- グリッド - グリッドのコンテナー要素はフォーカスできなくなりました [#2251](https://github.com/IgniteUI/ignite-ui/issues/2251)


## <a id="23258"></a> 23.2.58

### 修正

- グリッド フィルタリング - アクセシビリティ ツールの使用時に条件ドロップダウンをナビゲートできるようになりました [#2245](https://github.com/IgniteUI/ignite-ui/issues/2245)

### 追加

- グリッド フィルタリング - 条件ドロップダウンの展開/縮小状態を示す ARIA 属性 [#2241](https://github.com/IgniteUI/ignite-ui/issues/2241)、[#2243](https://github.com/IgniteUI/ignite-ui/issues/2243)
- グリッド フィルタリング - フィルタリング行のボタンの ARIA ロール [#2240](https://github.com/IgniteUI/ignite-ui/issues/2240)
- グリッド フィルタリング - フィルター入力用のより詳細な ARIA ラベル [#2242](https://github.com/IgniteUI/ignite-ui/issues/2242)

### 変更

- グリッド - グリッドのコンテナー要素はフォーカスできなくなりました [#2251](https://github.com/IgniteUI/ignite-ui/issues/2251)


