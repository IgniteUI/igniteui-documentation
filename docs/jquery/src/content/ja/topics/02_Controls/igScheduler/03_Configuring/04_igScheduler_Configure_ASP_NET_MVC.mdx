<!--
|metadata|
{
    "fileName": "igscheduler-asp-net-mvc-wrapper",
    "controlName": "igScheduler",
    "tags": ["Scheduler","MVC"]
}
|metadata|
-->

# ASP.NET MVC スケジューラの構成

%%ProductName%% は、JavaScript ベースの機能豊かなインタラクティブ web アプリケーションを作成するための jQuery UI コントロール セットです。%%ProductNameMVC%% の場合、直接 JavaScript を使用または %%ProductNameMVC%% ヘルパーを使用するオプションがあります。

%%ProductNameMVC%% ヘルパーは、%%ProductName%% コントロールで必要な HTML マークアップおよび JavaScript コードを生成する .NET クラスおよび拡張機能メソッドのコレクションです。ページに描画された後、手動的に JavaScript で作成したコードと %%ProductName%% MVC ヘルパーによって生成されたコードの違いはほとんどありませんが、以下の場合はヘルパーが役立ちます。

* HTML および JavaScript より MVC ビュー エンジンの構文またはマネージ コードでの操作を望む場合。

このトピックでは、%%ProductNameMVC%% Scheduler ヘルパーについて説明します。ビューの構築で利用可能な構文オプションについて、またスケジューラにデータを提供するためのサーバーとの操作方法も説明します。

> **注:** このトピックは Razor ビュー エンジンおよび C# でサンプル コードを表示します。

### このトピックの内容
- [**はじめに**](#getting-started)
	- [%%ProductName%% MVC アセンブリの参照](#referencing-igniteui-mvc-assembly)
	- [スタイルおよびスクリプトの参照](#referencing-styles-and-scripts)
- [**構文方法**](#syntax-variations)
 	- [スケジューラ モデル](#syntax-scheduler-model)
    - [チェーン](#syntax-chaining)
- [**関連コンテンツ**](#related-content)
	- [関連トピック](#related-topics)



## <a id="getting-started"></a> はじめに
%%ProductNameMVC%% Scheduler を使用する前に、`Infragistics.Web.Mvc` アセンブリへの参照を作成し、ページで関連するスクリプトおよびスタイル シートを参照します。

### <a id="referencing-igniteui-mvc-assembly"></a>%%ProductNameMVC%% アセンブリの参照
ASP.NET アプリケーションで、以下の場所にある %%ProductNameMVC%% アセンブリへの参照を作成します。

```
%%InstallPathMVC%%\<MVC_VERSION_NUMBER>\Bin\Infragistics.Web.Mvc.dll
```

### <a id="referencing-styles-and-scripts"></a>スタイルおよびスクリプトの参照
次に、必要なスタイル シートおよびスクリプト ファイルをページで参照します。

```html
<link type="text/css" href="css/themes/infragistics/infragistics.theme.css" rel="stylesheet" />
<link type="text/css" href="css/structure/infragistics.css" rel="stylesheet" />

<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery-ui.js"></script>
<script type="text/javascript" src="infragistics.core.js"></script>
<script type="text/javascript" src="infragistics.lob.js"></script>
<script type="text/javascript" src="infragistics.scheduler-bundled.js"></script>
```
> **注**: %%ProductNameMVC%% ヘルパーを使用するには、jQuery、jQuery UI、および %%ProductName%% への参照をページの上に追加する必要があります。

## <a id="syntax-variations"></a>構文方法
%%ProductNameMVC%% ヘルパーを igScheduler で使用する場合にページを構成する重要なパーツがいくつかあります。ページが要求されたときに %%ProductName%% MVC ヘルパーがページでコントロールを描画するために、Model データが Controller で収集され、View に渡されます。コントローラーで Appointments および Resources データの表現を含む `IQueryable<T>` コレクション (`T` は `Appointment` モデルまたは `Resource`) として Model クラスを渡します。2 つの Model は `Infragistics.Web.Mvc.IModel` 名前空間にある `IModel` インターフェイスを継承します。また、モデルの `JSON` 表記を表す `ToJson` メソッドを実装します。

> **注**: Scheduler MVC ヘルパーのデータ ソースおよびリソースは `IQueryable<T>` のインスタンスのみを受けます。

> **注**: `Render` メソッドが発生されない場合、コントロールは表示されません。

したがって、Scheduler MVC ヘルパーの使用で、以下のような構文パターンを使用します。

```html
@(Html.Infragistics().Scheduler()
    .DataSource(/* collection of the appointments data */)
    .Resources(/* collection of the resources data */)
    .Render()
)
```

### <a id="syntax-scheduler-model"></a>スケジューラ モデル
igScheduler を構成するには、スケジューラのすべてのオプション (データ ソースおよびリソース) をコントローラーで定義し、Helper に `Resource` および `Appointment` モデルの 2 つのコレクション表現を作成したカスタム スケジューラ モデルを渡します。 たとえば、コントローラーがカスタム クラスのインスタンスを作成し、`DataSource` および `Resources` プロパティを `IQueryable<T>` コレクションのインスタンスに設定します。

```csharp
using Infragistics.Web.Mvc;

...

public class SchedulerModelController : Controller
{
    public ActionResult Index()
    {
        PersonRepository repository = new PersonRepository();

        SchedulerModel model = new SchedulerModel();
        model.DataSource = repository.Appointments.GetAll();
        model.Resources = repository.Resources.GetAll();

        return View(model);
    }
}
```

スケジューラ モデルが作成されビューに送信された後、コントロールを描画するために MVC ヘルパーにビューのモデルが渡されます。

```html
@using Infragistics.Web.Mvc
@model Project.Namespace.Models.SchedulerModel

...

@(Html.Infragistics().Scheduler()
    .DataSource(Model.DataSource)
    .Resources(Model.Resources)
    .MonthViewSettings(mw =>
    {
        mw.WeekNumberVisible(true);
        mw.WeekdayVisible(true);
    })
    .WeekViewSettings(wv =>
    {
        wv.TimeSlotInterval(SchedulerTimeSlotInterval.SixMinutes);
        wv.WeekViewDisplayModel(SchedulerWeekViewDisplayMode.All7Days);
        wv.WorkingHoursDisplayMode(SchedulerWorkingHoursDisplayMode.WorkingHoursOnly);
    })
    .DayViewSettings(dv =>
    {
        dv.TimeSlotInterval(SchedulerTimeSlotInterval.SixMinutes);
        dv.DayViewDisplayMode(3);
    })
    .Render()
)
```

ビューで API を利用可能にするには、ページの上に `Infragistics.Web.Mvc` をインポートするための `using` ディレクティブが必要です。`model` の宣言された型はカスタム モデルで、コントローラーによってビューに渡された型と一致します。この場合、`Scheduler` メソッドの返却型が `MvcHtmlString` (ページの HTML および JavaScript の描画された文字列) のため、コントロールを描画するための追加の呼び出しは必要ありません。

<a id="scheduler-model-source"></a>この例の結果で描画されたページのソースを表示すると、以下のようなコードになります。

```html
<div id="scheduler"></div>
```

```javascript
<script type="text/javascript">
    $(function () {
        $('#scheduler').igScheduler({ 
            height: '700px', 
            width: '1200px', 
            dataSource: [ 
                {
                    "id":11,
                    "resourceId":1,
                    "start":"2017-04-08T00:00:00",
                    "end":"2017-04-08T00:00:00",
                    "subject":"Some Subject",
                    "location":null,
                    "description":"Description"
                }, 
                {
                    "id":5,
                    "resourceId":6,
                    "start":"2017-04-10T00:00:00",
                    "end":"2017-04-10T00:00:00",
                    "subject":"Some Subject",
                    "location":null,
                    "description":"Description"
                }, 
                {
                    "id":10,
                    "resourceId":11,
                    "start":"2017-04-20T00:00:00",
                    "end":"2017-04-20T00:00:00",
                    "subject":"Some Subject",
                    "location":null,
                    "description":"Description"
            ], 
            resources: [ 
                {"id":1, "displayName":"grape", "colorScheme":"Teal"}, 
                {"id":6, "displayName":"grape", "colorScheme":null}, 
                {"id":11,"displayName":"grape","colorScheme":null}
            ], 
            monthViewSettings: { 
                isWeekNumberVisible: true, 
                isWeekdayVisible: true 
            }, 
            weekViewSettings: { 
                timeSlotInterval: 'sixMinutes', 
                weekViewDisplayMode: 'all7Days',
                workingHoursDisplayMode: 'workingHoursOnly' 
            }, 
            dayViewSettings: { 
                timeSlotInterval: 'sixMinutes', 
                dayViewNumberOfDays: 3 
            } 
        });
    });
</script>
```

このコードをすべて理解する必要はありませんが、MVC ヘルパーを使用して描画されるコードについて説明するために本トピックに含まれます。`scheduler` の `ID` を持つ HTML `DIV` 要素が生成されます。jQuery `ready` の匿名関数の直後にある `SCRIPT` 要素に、宣言された `DIV` 要素にデータおよびオプションを関連付ける `$('#scheduler')` の jQuery セレクターがあります。 

#### 予定およびリソース モデルの実例
以下のセクションは `Appointment` および `Resource` モデルの表現の実例を表示します。両方の実例はオブジェクトのシリアル化のために `Newtonsoft.Json` を使用します。

```csharp
    public class AppointmentItem : IModel
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("resourceId")]
        public int ResourceId { get; set; }

        [JsonProperty("start")]
        public DateTime Start { get; set; }

        [JsonProperty("end")]
        public DateTime End { get; set; }

        [JsonProperty("subject")]
        public string Subject { get; set; }

        [JsonProperty("location")]
        public string Location { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }

    public class ResourceItem : IModel
    {
        [JsonProperty("id")]
        public int ID { get; set; }

        [JsonProperty("displayName")]
        public string DisplayName { get; set; }

        [JsonProperty("colorScheme")]
        [JsonConverter(typeof(StringEnumConverter))]
        public SchedulerResourceColorScheme? ColorScheme { get; set; }

        public string ToJson()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
```

> **注**: `ResourceItem` モデル表現の `ColorScheme` プロパティを作成する場合、その型は `Infragistics.Web.Mvc.SchedulerResourceColorScheme` です。 `Infragistics.Web.Mvc.SchedulerResourceColorScheme` は、リソース色スキーマとして使用可能な 12 色の列挙体表現です。`ColorScheme` プロパティをこの列挙体の表現に明示的に設定します。上の実例で、列挙体の文字列値と一致します。

### <a id="syntax-chaining"></a>チェーン

スケジューラ モデルの定義はチェーン構文で設定されます。MVC ヘルパーにデータのコレクションを渡すと、`Scheduler` メソッドは、ページでコントロールを定義するためにメソッドのチェーン呼び出しが可能な fluent インターフェイスを公開する `SchedulerWrapper` インスタンスを返します。


## <a id="related-content"></a>関連コンテンツ
### <a id="related-topics"></a>トピック

トピック | 目的
---|---
[予定の構成 (igScheduler)](igScheduler-Configure-Appointments.html) | このトピックは、`igScheduler` の Appointments DataSource リストを設定して構成する方法を紹介します。
[ビューの構成 (igScheduler)](igScheduler-Configure-Views.html) | このセクションのトピックは、予定表のデータを表示する `igScheduler` コントロールで使用されるビューについての情報を提供します。
[繰り返しの構成 (igScheduler)](igScheduler-Configure-Recurrence.html) | このセクションのトピックでは、`igScheduler` コントロールの定期的な予定の概念について説明します。
[リソースの構成 (igScheduler)](igScheduler-Configure-Resources.html) | このトピックは、予定の Resources リストを追加して構成する方法を紹介します。