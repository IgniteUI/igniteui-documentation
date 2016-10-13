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

NuGet はツールおよびサービスを提供するパッケージ マネージャーです。2010 年に .NET などの Microsoft 開発プラットフォームのオープンソース パッケージ マネージャーとして公開されました。NuGet を使用して開発を向上して自動化できます。NuGet でパッケージをインストールすると、ライブラリ ファイルがソリューションにコピーされ、プロジェクトを自動的に更新します。つまり、参照を追加、構成ファイルを変更、更に以前のバージョンのスクリプト ファイルを置き換えます。NuGet は Visual Studio 2010 以後で利用可能ですが、Visual Studio 2012 以後デフォルトで含まれます。使用方法の詳細については、[Nuget ヘルプ](http://docs.nuget.org/ndocs/guides/install-nuget)を参照してください。Infragistics Ignite UI は NuGet パッケージとして公開されています。NuGet パッケージは、プロジェクトに必要な Infragistics ファイルおよびアセンブリをインストールするもっとも簡単な方法です。Ignite UI NuGet パッケージを使用するには、NuGet インストーラーを使用します。インストールでプロダクト キー フィールドを空にすると、インストーラーはパッケージのトライアル版をインストールします。インストーラーは、利用可能な Ignite UI NuGet パッケージをすべて表示する「Infragistics (ローカル)」と呼ばれるローカル フィードを作成します。  

## Ignite UI パッケージのインストール

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