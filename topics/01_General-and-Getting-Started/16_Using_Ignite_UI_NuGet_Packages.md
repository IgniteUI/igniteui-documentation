<!--
|metadata|
{
    "fileName": "Using-Ignite-UI-NuGet-Packages",
    "controlName": [],
    "tags": ["NuGet"]
}
|metadata|
-->

# Ignite UI NuGet パッケージの使用

NuGet はツールおよびサービスを提供するパッケージ マネージャーです。2010 年に .NET などの Microsoft 開発プラットフォームのオープンソース パッケージ マネージャーとして公開されました。NuGet を使用して開発を向上して自動化できます。

NuGet でパッケージをインストールすると、ライブラリ ファイルがソリューションにコピーされ、プロジェクトを自動的に更新します。つまり、参照を追加、構成ファイルを変更、更に以前のバージョンのスクリプト ファイルを置き換えます。NuGet は Visual Studio 2010 以後で利用可能ですが、Visual Studio 2012 以後デフォルトで含まれます。使用方法の詳細については、[Nuget ヘルプ](http://docs.nuget.org/ndocs/guides/install-nuget)を参照してください。

Infragistics Ignite UI controls are available to explore as a NuGet package and this is the easiest and the fastest way to install the Infragistics files and assemblies required for your project.

There are two approaches to start using the NuGet packages. We suggest you to set up and use our private NuGet feed hosted on  [https://packages.infragistics.com/nuget/licensed](https://packages.infragistics.com/nuget/licensed) which will keep you up to date with all the NuGet packages Infragistics provide. Using this approach you will be able to get the latest version of the packages each time you create a new project or restore the packages of an existing one.

The alternative approach to the Ignite UI NuGet packages is to install them locally by running the NuGet installer. The installer will automatically create a local feed named "Infragistics (Local)", which will display all the Ignite UI NuGet packages that are available. During the installation if you leave the product key field empty, the installer will install the trial version of the packages. Have in mind that if you choose this way of working with the Ignite UI NuGet packages you will have to install a later version of the packages manually if you want to update the assemblies you use to the latest version available. 

## Installing Ignite UI packages from the online private feed

The first step is to add the Infragistics feed as a package source. To do that, the user needs go to Tools/Options/Package Sources. To do that the user needs to go to Tools/Options/NuGet Package Manager/Package Sources.

Add a new package source using Add new source button and name it Infragistics feed (in fact, you can name it however you want). Set the Source to [*https://packages.infragistics.com/nuget/licensed*](https://packages.infragistics.com/nuget/licensed) and click OK to save the source.

![](images/Infragistics_feed.jpg)

After that you have several ways to add references to the packages. The most "visual" way is to right click on the project and select "Manage Nuget Packages".

Inside the NuGet packages manager dialog you will need to select "Infragistics feed" as your Package Source and you will get prompted for a user/password where you will need to use your infragistics.com credentials:

![](images/package_credentials.jpg)

If you check the "Remember my password" checkbox the credentials will be stored in Windows and you will be able to manage them from the Credential Manager. After authenticating you will get a list of the packages that are available to install. When you pick a package, you get the required assemblies installed in the project and the packages.config is updated with the installed packages.

## Installing Ignite UI packages from the local feed

Ignite UI NuGet パッケージをプロジェクトにインストールするには、GUI またはコンソールを使用できます。両方を以下に説明します。すべての手順およびスクリーンショットは Visual Studio 2015 に基づいていますが、Visual Studio の以前のバージョンもほとんど同じです。このトピックで詳細に説明するため、NuGet を使用した経験がない場合も作業をすぐに開始できます。

 1. 新しい Ignite UI Web アプリケーション プロジェクトを作成します。名前を IgniteUIProject に設定します。
![](images/IgniteUIProject_NuGet_Packages.png)
 2. 空のプロジェクトを選択します。
![](images/Empty_Project_for_NnuGet_Packages.png)
 3. プロジェクトを作成した後、ソリューション エクスプローラーは以下のようになります。
 ![](images/Solution_Explorer_View_NuGet_Packages.png)
 プロジェクトはプロパティ、参照、および Web.config の 3 つのデフォルト ノードを含みます。

 
### Ignite UI パッケージを GUI によりインストール

Ignite UI NuGet パッケージを GUI からインストールするには、プロジェクト名を右クリックし、「NuGet パッケージの管理」をコンテキスト メニューから選択します。
 ![](images/NuGet_Manager.png)

これは **NuGet パッケージの管理**ビューを開きます。このビューでプロジェクトで利用可能なすべてのパッケージを表示します。

パッケージ ソースを **Infragistics (ローカル)** に変更します。
![](images/NuGet_Packages_Infragistics_IgniteUI.png)

「参照」タブに移動すると、利用可能な Infragistics Ignite UI NuGet パッケージのリストが表示されます。

パッケージを選択すると、右パネルに詳細情報が表示されます。ここに選択したパッケージの依存関係のリストがあります。これらのアセンブリは自動的にプロジェクトにインストールされます。

[インストール] ボタンをクリックして、選択したパッケージはプロジェクトに追加されます。 
![](images/Install_Button_for_NuGet_Packages.png)

### Ignite UI パッケージをパッケージ マネージャー コンソールによりインストール

以下で、Ignite UI パッケージをパッケージ マネージャー コンソールを使用して追加する方法を説明します。コンソールでは、インストールするパッケージを検索する必要がないため、より速くアセンブリを追加します。


コンソールを表示するには、Visual Studio の**ツール** メニューを選択し、**NuGet パッケージ マネージャー** の **パッケージ マネージャー コンソール** を選択します。
![](images/NuGet_Manager_Console.png)

**パッケージ マネージャー コンソール**は画面の下部に表示されます。インストールを開始するには、「Install-Package *パッケージ名*」を入力するだけです。たとえば、「IgniteUI.MVC.JP」をインストールする場合、「Install-Package IgniteUI.MVC.JP」と入力すると、マネージャーがこのアセンブリおよびすべての依存関係をインストールします。コンソールでパッケージ ソース ドロップダウンから Infragistics (ローカル) を選択することに注意してください。

インストールが完了した後、コンソールに Ignite UI パッケージがプロジェクトに正常に追加されましたというメッセージが表示されます。
![](images/Console_Installation_of_NuGet_Packages.png)

## Ignite UI NuGet パッケージのインストール ファイル

![](images/Added_Files_from_NuGet_packages.png)

Ignite UI パッケージをインストールする場合、JavaScript および Content フォルダーがプロジェクトに追加されます。このフォルダーは Infragistics JS および CSS リソースを含みます。MVC パッケージをインストールする場合、必要なアセンブリも参照に追加されます。

## Ignite UI NuGet パッケージのアンインストール

パッケージによりインストールされるアセンブリをアンインストールできます。GUI またはパッケージ マネージャー コンソールで行うことができます。インストール方法に関係なく、いずれかの方法を使用できます。

アセンブリを解除するには、プロジェクトを右クリックして **NuGet パッケージの管理**を選択します。すべてのインストールされたアセンブリが表示されます。アンインストールするアセンブリを選択して **[アンインストール]** ボタンをクリックします。

![](images/Uninstall_NuGet_Package.png)

これは選択したアセンブリのみをアンインストールします。パッケージで依存関係としてインストールされるアセンブリが保持されることに注意してください。 

また、アセンブリにその他のアセンブリと依存関係がある場合、アンインストールできません。たとえば、**IgniteUI.MVC.JP** をプロジェクトにインストールしましたが、依存関係としてインストールされた IgniteUI をアンインストールしようとすると、依存関係があるため、アンインストールできないことを説明するエラー メッセージが表示されます。アンインストールするには、依存関係のアセンブリを最初にすべてアンインストールする必要があります。 

![](images/Error_When_uninstaling_depending_packages.png)

コンソールでアセンブリをアンインストールするには、「Uninstall-Package *パッケージ名*」を入力します。たとえば、「Uninstall-Package IgniteUI.MVC.JP」。高パフォーマンスアプリケーションの開発を簡単にすばやく開始できます。