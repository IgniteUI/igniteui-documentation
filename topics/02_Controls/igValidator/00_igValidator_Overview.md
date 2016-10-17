<!--
|metadata|
{
    "fileName": "igvalidator-overview",
    "controlName": ["igValidator"],
    "tags": ["Getting Started"]
}
|metadata|
-->

# igValidator の概要

`igValidator` コントロールは、従来とは異なる新しいルック アンド フィールを提供します。このコントロールは、すべてのフォーム要素およびエディター、コンボ ボックスなどの既存のコンポーネントやユーザー入力を収集するためのその他のコンポーネントで簡単に操作できるように設計されています。このコントロールは、通知ウィジェットのデザインを活用し、その視覚エフェクトを使用して、必要な success メッセージと error メッセージを表示します。

### このトピックの内容

- [概要](#introduction)
- [igValidator のセットアップ](#setting-up)
- [Validation triggers](#triggers)
- [Validation rules](#validation-priority)
- [ASP.NET MVC and Data Annotations](#mvc-annotations)
- [関連コンテンツ](#related-content)

## <a id="introduction"></a> 概要

`igValidator` コントロールの主な目的は、デフォルトで、合格した検証と失敗した検証について直ちにエンドユーザーに通知することです。ユーザーがエディターの入力をぼかした場合、フィードバック メッセージが即座に表示され、エディターの状態に関する有益な情報を提供します。たとえば、現在のフィールドの必要の有無、要求されたデータの入力の有無などの詳細を示すメッセージを表示できます。

`igValidator` は、success と error のメッセージを使用して、異なる[構成](#setting-up)や複数の[検証ルール](#validation-priority)をサポートします。メッセージは、定義済みの [`messageTarget`](%%jQueryApiUrl%%/ui.igValidator#options:messageTarget) に配置、または `igNotifier` ウィジェットに渡すことができます。ウィジェットの場合は、入力されたデータが検証ルールに適合しないと特定の入力が赤色で表示され、現在の操作に問題があることを通知します。

`requiredIndication` プロパティを使用すると、オプションで必要なフォーム要素を事前にアドバイスできます。また、`optionalIndication` プロパティで特定のフィールドがオプションであることを示すこともできます。

すべての`igValidator` オプションについては、[igValidator API](%%jQueryApiUrl%%/ui.igvalidator) を参照してください。

## <a id="setting-up"></a> igValidator のセットアップ

バリデーター コントロールは、複数のターゲット (フィールド) で個別に、またはサポートされる Ignite UI コントロール、エディター、コンボおよびレーティングを統合した状態で構成できます。このコントロールのカスタマイズと構成で使用できる多数のオプションがあります。

### 他の Ignite UI コントロールからの構成

```html
<div id="textEditor"></div>
```
```js
$('#textEditor').igTextEditor({
  inputName: "pass",
  textMode: "password",
  validatorOptions: {
    required: true,
    onblur: true,
    lengthRange: [6, 20],
    requiredIndication: true
  }
});
```

![](images/igValidator.png)

> **注:** エディター コントロールから構成するとバリデーターは、追加の`フィールド`のコレクションをサポートしません。

### 1 つのフィールドのスタンドアロンの igValidator
以下の例では、単一のターゲット ファイルによるバリデーターの基本的な使用方法を示します。特定のエディター コントロールおよびコンボのみでなく、任意のHTML フォーム要素がターゲットになります。

```html
<div id="validator"></div>
```

```js
$('#validator').igTextEditor();

$('#validator').igValidator({
  required: true,
  onblur: true,
  requiredIndication: true
});
```

### 複数のフィールドによるスタンドアロンの igValidator
このコントロールは、複数の検証オプションと 1 つのセレクターを持つ各フィールドが記述された、[`フィールド`](%%jQueryApiUrl%%/ui.igvalidator#options:fields)のコレクションをサポートします。有効な jQuery [`selector`](%%jQueryApiUrl%%/ui.igvalidator#options:fields.selector) を提供する必要があるフィールドは、すべての検証ルールとトリガーを含むことができますが、その他のフィールドまたはイベント ハンドラーは含まれません。主要なオプションのレベルのルールは、そのようなオプションが提供されない場合、フィールドにより継承されます。

```html
<form id="validationForm">
    <fieldset>
        <h4> Feedback form</h4>
        <p> Enter your name: (Validation onsubmit, required)</p>
        <input type="text" id="grpEdit1"></input>
        <p> Enter date: (Validation onblur, not required on submit)</p>
        <input type="text" id="grpEdit2"></input>
        <p> Give us rating: ( Validation onsubmit, minimum value = 1.5) </p>
        <div id="rating"></div>
        <p> Subscribe for free samples : (Validation onsubmit,required)</p>
        <div id="igCheckboxEditor"></div>
        <br>
        <input type="submit" value="Submit"></input>
    </fieldset>
</form>
```

```js
$("#rating").igRating({
		precision : "half",
		valueAsPercent : false
	});
	$("#igCheckboxEditor").igCheckboxEditor();

	$('#validationForm').igValidator({
		required : true, //inherited
		fields : [{
				selector : "#grpEdit1",
				onblur : false // override default
			}, {
				selector : "#grpEdit2",
				date : true,
				required : false, // override
				onchange : true
			}, {
				selector : "#rating",
				successMessage : "Thanks!",
				onchange : true,
				valueRange : {
					min : 1.5,
					errorMessage : "At least 1.5 stars required (custom message)"
				},
				notificationOptions : {
					mode : "popover"
				}
			}, {
				selector : "#igCheckboxEditor",
				onchange : true
			}
		]
	});
```

> **注**: 前述の 2 つのスタンドアロン構成ではどちらも、Ignite UI エディター コントロールで強化されたフィールドをサポートしますが、バリデーターがそれらのフィールドを検出し、正しく処理するためには、事前に初期化する必要があります。他のコントロールより先にバリデーターを初期化できない場合は、[`updateField`](%%jQueryApiUrl%%/ui.igvalidator#methods:updateField) メソッドを使用して、バリデーターのフィールドを更新できます。

## <a id="triggers"></a> Validation triggers

Triggers allow specifying when validation should be performed and include three settings - [`onchange`](%%jQueryApiUrl%%/ui.igValidator#options:onchange), [`onblur`](%%jQueryApiUrl%%/ui.igValidator#options:onblur)  and [`onsubmit`](%%jQueryApiUrl%%/ui.igValidator#options:onsubmit). These options resemble the native DOM events that they relay to and allow to control how often should the value be checked based on standard user interactions. By default only `onchange` is disabled to accommodate most common scenarios. Note that the `onsubmit` trigger will have no effect unless there's a parent form for the target input or the validator is initialized on the form itself.

### <a id="threshold"></a> Threshold
While the [`threshold`](%%jQueryApiUrl%%/ui.igValidator#options:threshold) option is not technically a validation trigger, it is still an integral part of the validation cycle. When set, if the **length** of the value is less than the threshold then none of the validation rules will be run. This is most useful in scenarios where there's no value in showing an error message too early (for example when `onchange` is enabled) as the value cannot realistically fulfil the requirements under a certain length.

> **Note:** Using the [`isValid`](%%jQueryApiUrl%%/ui.igvalidator#methods:isValid) and [`validate`](%%jQueryApiUrl%%/ui.igvalidator#methods:validate) methods or validation on submit will ignore the threshold option. This allows required fields to properly prevent submitting for example. API methods will also ignore trigger conditions.


## <a id="validation-priority"></a> Validation rules

The `igValidator` rules define a number of conditions for a value to be accepted and in some scenarios you might need to use multiple rules on a single input in order to validate upon different criteria. On a single input the rules are executed per validation and in a particular order. 

Default validation rules include (by priority):

1.	Required
2.	Infragistics' editor (optional)
3.	Number
4.	Date
5.	LengthRange
6.	ValueRange
7.	EqualsTo
8.	Email
9.  Credit Card
10.	Pattern (regular expression)
11.	Custom function

For detailed information for each rule, refer to the [**Validation Rules topic**](igValidator-Validation-Rules.html).


## <a id="mvc-annotations"></a> ASP.NET MVC and Data Annotations

To setup a validator in ASP.NET MVC the Infragistics HTML Helper [Validator()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.InfragisticsSuite`1~Validator().html) extension can be used:

**In Razor:**
```csharp
	@(Html.Infragistics().Validator()
		.ID("firstName")
		.Required(true)
		.Render())
```
The helper can also be initialized with an [ValidatorModel](Infragistics.Web.Mvc~Infragistics.Web.Mvc.ValidatorModel.html). Model properties and helper methods follow the jQuery API of the control as closely as possible.  

Besides configuring the validator through the dedicated wrapper, when using strongly-typed editors the Model will be automatically inspected for Data Annotations and the appropriate validation rules and their messages will be added to the control configuration. Additionally, the [ValidatorOptions()](Infragistics.Web.Mvc~Infragistics.Web.Mvc.BaseEditorWrapper`2~ValidatorOptions.html) helper method can still be used to add or override rules.

For a step-by-step guide please refer to the [Configuring ASP.NET MVC Validation (Editors)](Configuring-ASP.NET-MVC-Validation.html) topic.

## <a id="related-content"></a> 関連コンテンツ

- [バリデーターの概要のサンプル](%%SamplesUrl%%/validator/overview)
- [Data Annotation Validation Sample](%%SamplesUrl%%/editors/data-annotation-validation)
- [igValidator jQuery API](%%jQueryApiUrl%%/ui.igValidator)
