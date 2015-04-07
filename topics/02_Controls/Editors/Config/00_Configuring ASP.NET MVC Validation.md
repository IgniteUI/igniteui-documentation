<!--
|metadata|
{
    "fileName": "configuring-asp.net-mvc-validation",
    "controlName": "1",
    "tags": []
}
|metadata|
-->

# ASP.NET MVC 検証の構成



##トピックの概要


### 目的

Ignite UI エディター コントロールからなるフォームから始まり、このトピックではフォームを作成して、フォームをデータ注釈付きで検証する方法を示します。また、ASP.NET MVC ValidationMessage を構成し、検証テキストをさらにカスタマイズする方法も示します。

### 前提条件

####概念

-   ASP.NET MVC データ注釈バリデーター
-   igEditors および igCombo とその ASP.NET MVC ヘルパーの使用

####トピック

-	[コントロールを MVC プロジェクトに追加](Adding-NetAdvantage-Controls-to-an-MVC-Project.html): Ignite UI スクリプト、CSS、およびアセンブリを使用した ASP.NET MVC アプリケーションの設定の基本事項を実現するため。

-	[igTextEditor の概要](igTextEditor-Overview.html) : igTextEditor を ASP.NET MVC で使用するための基本事項に精通するため

-	[igNumericEditor の概要](igNumericEditor-Overview.html): igNumericEditor を ASP.NET MVC で使用するための基本事項に精通するため

-	[igCombo を使用した作業の開始](igCombo-Getting-Started.html): igCombo を ASP.NET MVC で使用するための基本事項に精通するため

####外部リソース

-   [データ注釈バリデーターを使用した検証](http://www.asp.net/mvc/tutorials/older-versions/models-%28data%29/validation-with-the-data-annotation-validators-cs)

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [ASP.NET MVC データ注釈検証の構成](#_Configuring_MVC_Data_Annotation_Validation)
    -   [概要](#_Introduction)
    -   [プレビュー](#_Preview)
    -   [要件](#_Requirements)
    -   [概要](#_Requirements_Overview)
    -   [手順](#_Steps)
-   [関連コンテンツ](#_Related_Content)
    -   [トピック](#_Topics)
    -   [サンプル](#_Samples)

##<a id="_Configuring_MVC_Data_Annotation_Validation"></a>ASP.NET MVC データ注釈検証の構成


### <a id="_Introduction"></a>概要

この手順では、Ignite UI コントロールを使用した ASP.NET MVC データ注釈検証の Person モデルを作成し構成します。

### <a id="_Preview"></a>プレビュー

以下のスクリーンショットは最終結果のプレビューです。

![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_1.png)

###<a id="_Requirements"></a> 要件

手順を完了するために、ASP.NET MVC プロジェクトと次のものが必要です。

-   必要な Ignite UI の JavaScript と CSS ファイル
-   参照されている Infragistics.Web.Mvc.dll アセンブリ

###<a id="_Requirements_Overview"></a> 概要

このトピックでは、データ注釈を使用したモデルの作成について順を追って説明します。以下はプロセスの概念的概要です。

1.  Person クラスの作成
2.  コントローラーとビューの作成
3.  データ注釈バリデーターの追加
4.  検証メッセージの構成 (オプション)

### <a id="_Steps"></a>手順

以下の手順は、Ignite UI コントロールのデータ注釈検証を構成する方法を示します。



**1. Person クラスを作成します**

1. Person クラスを追加します

	Person クラスを Models フォルダーに追加します。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_2.png)

2. クラス メンバーを作成します

	Person.cs ファイルを開き、以下のメンバーをクラスに追加します。

	**C# の場合:**

	```csharp
	public class Person
	{
		public string Name { get; set; }
		public int Age { get; set; }
		public string Email { get; set; }
		public string Group { get; set; }
	}
	```

3. データ用メンバーを作成します

	ビュー内の igCombo™ には、ドロップダウンを表示するためにデータが必要です。この例の目的上、Person オブジェクトに対して AvailableGroups というメンバーを定義し、コンボにデータを提供します。Person クラスは以下のようになります。

	**C# の場合:**

	```csharp
	public class Person
	{
		public string Name { get; set; }
		public int Age { get; set; }
		public string Email { get; set; }
		public string Group { get; set; }
		public string[] AvailableGroups
		{
			get
			{
				return new string[] { "Family", "Friends", "Colleagues" };
			}
		}
	}
	```

**2. コントローラーとビューの追加**

1. PersonController を作成します

	ASP.NET MVC アプリケーションの Controllers フォルダーに、PersonController.cs という名前で新しいコントローラーを作成します。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_3.png)

2. ActionMethods を作成します

	Person を作成するため、2 つの ActionMethods を Controller に追加します。1 つは初期要求用、1 つは POST 用です。

	**C# の場合:**

	```csharp
	public class PersonController : Controller
	{
		//
		// GET: /Person/Create
		public ActionResult Create()
		{
			var person = new Person();
			return View(person);
		}
		//
		// POST: /Person/Create
		[HttpPost]
		public ActionResult Create(Person person)
		{
			return View(person);
		}
	}
	```

3. View を作成します

	厳密に型指定されたビューを Create という名前で作成し、Person クラスをモデルとして使用します。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_4.png)

	**ASPX の場合:**

	```csharp
	<%@ Page Title="" Language="C#" Inherits="System.Web.Mvc.ViewPage<DataAnnotationValidation.Models.Person>" %>
	<%@ Import Namespace="Infragistics.Web.Mvc" %>
	```

4. JavaScript と CSS の参照を追加します。

	この例では、ASP.NET MVC アプリケーションでローカルに参照される、結合された JavaScript および CSS ファイルを使用します。

	**ASPX の場合:**
	
	```csharp
	<link href="/Content/css/themes/infragistics/infragistics.theme.css" rel="stylesheet" type="text/css" />
	<link href="/Content/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
	<script src="/Scripts/jquery.js" type="text/javascript"></script>
	<script src="/Scripts/jquery-ui.js" type="text/javascript"></script>
	<script src="/Scripts/js/infragistics.core.js" type="text/javascript"></script>
	<script src="/Scripts/js/infragistics.lob.js" type="text/javascript"></script>
	```

5. Person オブジェクト用のフォームを作成します。

	aspx マークアップで、Person クラスの各メンバー用のラベルを作成します。さらに、コード例で示すように、各メンバー用の適切なエディターのインスタンスを作成します。コンボが Model.Group プロパティと Model.AvailableGroups プロパティの両方を使用する点に注意してください。ビューは以下のようになります。

	**ASPX の場合:**

	```csharp
	<% using (Html.BeginForm()) %>
	<% { %>
		<p>
			<%= Html.LabelFor(m => m.Name) %>
			<%= Html.Infragistics()
				.TextEditorFor(m => m.Name)
				.Render() %>
		</p>
		<p>
			<%= Html.LabelFor(m => m.Age) %>
			<%= Html.Infragistics()
				.NumericEditorFor(m => m.Age)
				.Render() %>
		</p>
		<p>
			<%= Html.LabelFor(m => m.Email) %>
			<%= Html.Infragistics()
				.TextEditorFor(m => m.Email)
				.Render() %>
		</p>
		<p>
			<%= Html.LabelFor(m => m.Group) %>
			<%= Html.Infragistics()
				.ComboFor(m => m.Group)
				.DataSource(Model.AvailableGroups)
				.DataBind()
				.Render() %>
		</p>
		<p>
			<input type="submit" value="Create" />
		</p>
	<% } %>
	```

6. サンプルを実行します。

	サンプルを実行し、/person/create に移動します。フォームが、すべてのエディターとともに表示されます。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_5.png)

	上記の手順を完了すると、ビューのコードは以下のようになります。

	**ASPX の場合:**

	```csharp
	<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<DataAnnotationValidation.Models.Person>" %>
	<%@ Import Namespace="Infragistics.Web.Mvc" %>
	<asp:content id="Content2" contentplaceholderid="MainContent" runat="server">
		<h2>Create</h2>
		<link href="/Content/css/themes/infragistics/infragistics.theme.css" rel="stylesheet"
			type="text/css" />
		<link href="/Content/css/structure/infragistics.css" rel="stylesheet" type="text/css" />
		<script src="/Scripts/jquery.js" type="text/javascript"></script>
		<script src="/Scripts/jquery-ui.js" type="text/javascript"></script>
		<script src="/Scripts/js/infragistics.core.js" type="text/javascript"></script>    <script src="/Scripts/js/infragistics.lob.js" type="text/javascript"></script>
    
		<% using (Html.BeginForm()) %>
		<% { %>
			<p>
				<%= Html.LabelFor(m => m.Name) %>
				<%= Html.Infragistics()
					.TextEditorFor(m => m.Name)
					.Render() %>
			</p>
			<p>
				<%= Html.LabelFor(m => m.Age) %>
				<%= Html.Infragistics()
					.NumericEditorFor(m => m.Age)
					.Render() %>
			</p>
			<p>
				<%= Html.LabelFor(m => m.Email) %>
				<%= Html.Infragistics()
					.TextEditorFor(m => m.Email)
					.Render() %>
			</p>
			<p>
				<%= Html.LabelFor(m => m.Group) %>
				<%= Html.Infragistics()
					.ComboFor(m => m.Group)
					.DataSource(Model.AvailableGroups)
					.DataBind()
					.Render() %>
			</p>
			<p>
				<input type="submit" value="Create" />
			</p>
		<% } %>
	</asp:content>
	```

**3**. **データ注釈バリデーターの追加**

1. System.ComponentModel.DataAnnotations 名前空間をインポートします。

	次の手順は、バリデーターを実装することです。Person クラスで System.ComponentModel.DataAnnotations 名前空間をインポートします。

	**C# の場合:**

	```csharp
	using System.ComponentModel.DataAnnotations;
	```

2. 必須フィールド検証を追加します。

	Person クラスで、必須フィールド バリデーターとエラーメッセージを各メンバーに追加します。これらのバリデーターは、属性が設定された各メンバーが確実にフォームに入力されるようにします。

	**C# の場合:**

	```csharp
	[Required(ErrorMessage="Name Required")]
	public string Name { get; set; }
	[Required(ErrorMessage = "Age Required")]
	public int Age { get; set; }    
	[Required(ErrorMessage = "Email Required")]
	public string Email { get; set; }
	[Required(ErrorMessage = "Group Required")]
	public string Group { get; set; }
	```

3. Name フィールドに長さバリデーターを追加します。

	必須バリデーターと同様に、長さバリデーターを Name フィールドに追加して、入力できる文字数を制限する必要があります。

	**C# の場合:**

	```csharp
	[Required(ErrorMessage = "Name Required")]
	[StringLength(50, ErrorMessage = "Must be under 50 characters")]
	public string Name { get; set; }
	```

4. 範囲バリデーターを Age フィールドに追加します。

	範囲バリデーターを追加し、数値フィールドの最小値と最大値を制限します。

	**C# の場合:**

	```csharp
	[Required(ErrorMessage = "Age Required")]
	[Range(1, 120, ErrorMessage = "Age must be between 1 and 120")]
	public int Age { get; set; }
	```

5. 正規表現バリデーターを Email フィールドに追加します。

	この正規表現は、入力が正常な電子メール アドレスのパターンを満たしていることを確認します。

	**C# の場合:**

	```csharp
	[Required(ErrorMessage = "Email Required")]
	[RegularExpression("^[a-z0-9_+-]+(.[a-z0-9_+-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*.([a-z]{2,4})$", ErrorMessage = "Not a valid email")]
	public string Email { get; set; }
	```

	すべてのデータ注釈バリデーターを追加した後の Person コードは以下のようになります。

	**C# の場合:**

	```csharp
	using System.ComponentModel.DataAnnotations;
	namespace DataAnnotationValidation.Models
	{
		public class Person
		{
			[Required(ErrorMessage = "Name Required")]
			[StringLength(50, ErrorMessage = "Must be under 50 characters")]
			public string Name { get; set; }
			[Required(ErrorMessage = "Age Required")]
			[Range(1, 120, ErrorMessage = "Age must be between 1 and 120")]
			public int Age { get; set; }
			[Required(ErrorMessage = "Email Required")]
			[RegularExpression("^[a-z0-9_+-]+(.[a-z0-9_+-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*.([a-z]{2,4})$", ErrorMessage = "Not a valid email")]
			public string Email { get; set; }
			[Required(ErrorMessage = "Group Required")]
			public string Group { get; set; }
			public string[] AvailableGroups
			{
				get
				{
					return new string[] { "Family", "Friends", "Colleagues" };
				}
			}
		}
	}
	```

6. サンプルを実行します。

	バリデーターが実行され、フォームの送信が防止されることがわかります。また、Name フィールドの長さバリデーターにより、ユーザーが 50 文字を超える入力を行うことが防止されます。また、デフォルトでは、数値エディターにより、フォーカスを失ったときに最も近い有効な値に値が変更されます。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_6.png)

**4. 検証メッセージの構成 (オプション)**

1. 検証メッセージを View に追加します。

	外観が雑然としないように、ASP.NET 検証メッセージを使用できます。検証メッセージは、入力フィールドのすぐ右横ではなく、それらのメッセージ中に表示されます。View の各メンバーに対して検証メッセージを追加します。

	**ASPX の場合:**

	```csharp
	<p>
		<%= Html.LabelFor(m => m.Name) %>
		<%= Html.Infragistics()
			.TextEditorFor(m => m.Name)
			.Render() %>
		<%= Html.ValidationMessageFor(m => m.Name) %>
	</p>
	<p>
		<%= Html.LabelFor(m => m.Age) %>
		<%= Html.Infragistics()
			.NumericEditorFor(m => m.Age)
			.Render() %>
		<%= Html.ValidationMessageFor(m => m.Age)%>
	</p>
	<p>
		<%= Html.LabelFor(m => m.Email) %>
		<%= Html.Infragistics()
			.TextEditorFor(m => m.Email)
			.Render() %>
		<%= Html.ValidationMessageFor(m => m.Email)%>
	</p>
	<p>
		<%= Html.LabelFor(m => m.Group) %>
		<%= Html.Infragistics()
			.ComboFor(m => m.Group)
			.DataSource(Model.AvailableGroups)
			.DataBind()
			.Render() %>
		<%= Html.ValidationMessageFor(m => m.Group)%>
	</p>
	```

2. サンプルを実行します。

	これで、検証メッセージは各入力フィールドの右に表示されます。

	![](images/Configuring_ASP.NET_MVC_Data_Annotations_with_NetAdvantage_for_jQuery_1.png)


##<a id="_Related_Content"></a>関連コンテンツ


### <a id="_Topics"></a>トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。


-	[ランタイム時の igEditors の構成](Configuring-igEditors-at-Runtime.html) : ASP.NET MVC ヘルパーによりコントロールが表示される方法に関する重要な情報を含め、実行時のエディターの使用の詳細について学びます。


###<a id="_Samples"></a> サンプル

このトピックについては、以下のサンプルも参照してください。


-	[データ注釈の検証](%%SamplesUrl%%/editors/data-annotation-validation): このサンプルは、送信ボタンが押されたときのデータ注釈検証を示します。
