<!--
|metadata|
{
    "fileName": "mvc-aspnet-core3",
    "controlName": "",
    "tags": ["ASP.NET MVC","Getting Started"]
}
|metadata|
-->

# %%ProductNameASPNETCore%% の使用

## トピックの概要

このトピックでは、.NET 5 用にビルドされた ASP.NET Core Web アプリケーションで %%ProductNameASPNETCore%%™ コンポーネントを使用した作業の開始方法を説明します。

### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [Infragistics Web MVC NuGet パッケージの参照](#nuget)
-   [アップロード処理のために igUpload ミドルウェアを構成](#middleware)
-   [関連コンテンツ](#related)

## <a id="nuget"></a> Infragistics Web MVC NuGet パッケージの参照

### <a id="nuget-local"></a> ローカル フィードの使用

ASP.NET では、ほとんどのモジュールが NuGet パッケージとしてラップされています。これによってアプリケーションに必要な特定のモジュールのみを使用することができるため、共通アセンブリに依存する必要がなくなります。特定のモジュールのすべての依存関係は、追加設定なしに復元できます。

そのため、ASP.NET Core 上に構築されている新しい  MVC ラッパーも NuGet パッケージとして提供されます。製品をインストール時に必要なパッケージをインストールするためのローカル フィードを作成する NuGet パッケージ モジュールを必ず含めてください。詳細については、[%%ProductName%% NuGet パッケージの使用](Using-Ignite-UI-NuGet-Packages.html)を参照してください。

コントロールの宣言は、以前の MVC バージョンと同じ構文です。詳細および例については、[コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)を参照してください。

### <a id="nuget-licensed"></a> オンライン プライベート フィードの使用

Infragistics がホストする NuGet サーバーを使用して、Infragistics Web MVC NuGet パッケージをインストールすることもできます。詳細については、[オンライン プライベート フィードからの Ignite UI パッケージのインストール](using-ignite-ui-nuget-packages.html#privateFeedInstallation) トピックを参照してください。

## <a id="middleware"></a> アップロード処理のために igUpload ミドルウェアを構成

以前の ASP.NET では、複数ファイルアップロード、大きなファイルのアプロード、アップロード状況のレポートなどより信頼性の高い機能を処理するために HttpModule および (または) HttpHandler を実装する必要がありました。  
ASP.NET Core では、新しいミドルウェア定義関連に構築された新しい要求パイプラインを提供します。 
%%ProductNameASPNETCore%% ファイル アップロードは、新しいミドルウェア定義モデルを使用し、パイプラインに直接プラグインできます。
2 つのミドルウェア モジュール - アップロード処理とクライアントからコマンドを受け取るモジュールとクライアントへステータス フィードバックを返すモジュールです。 
パイプラインに追加するには、MVC モジュールの前に Startup.cs クラスの Configure メソッドに含める必要があります。  

**C# の場合:**

```csharp
	 public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory) 
        { 
			... 
            app.UseUploadModuleMiddleware(); 
            app.UseUploadHandlerMiddleware(); 
 
            app.UseMvc(routes => 
            { 
                routes.MapRoute( 
                    name: "default", 
                    template: "{controller=Home}/{action=Index}/{id?}"); 
            }); 
			
			...
		}
```

アップロードの追加設定は ConfigureServices メソッドで設定できます。オプションは宣言的に設定または構成ファイルによって設定できます。



**C# の場合:**

```csharp
	public void ConfigureServices(IServiceCollection services)
        {
        	...
			services.Configure<UploadAppSettings>(options => {
                options.FileUploadPath = Configuration["UploadAppSettings:fileUploadPath"]; 
            });
		}
```


## 関連コンテンツ
- [コントロールを MVC プロジェクトに追加](Adding-IgniteUI-Controls-to-an-MVC-Project.html)