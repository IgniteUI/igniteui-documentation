<!--
|metadata|
{
    "fileName": "igolapxmladatasource-known-issues-and-limitations",
    "controlName": "igOlapXmlaDataSource",
    "tags": ["Known Issues"]
}
|metadata|
-->

# 既知の問題と制限 (igOlapXmlaDataSource)

## 関連コンテンツ
### 概要

以下の表は、%%ProductName%%™ %%ProductVersionShort%% リリースの `igOlapXmlaDataSource`™ コントロールの既知の問題および制限事項をまとめたものです。いくつかの問題および既存の回避策の詳細な説明は、サマリー表の後ろに記載されています。

凡例: |  
--------|-------
![](images/positive.png) | 回避策
![](images/negative.png) | 既知の回避策はありません
![](images/plannedFix.png) | 修正予定です




問題|説明|状態
---|---|---
アンドロイド ブラウザーの未対応|`igOlapXmlaDataSource` コンポーネントは、Android™ オペレーティング システム用ブラウザーでサポートされていません。 | ![](images/plannedFix.png)
[Mozilla Firefox ブラウザで機能しない認証済みクロスドメイン データ アクセス](#cross-domain-firefox)|Mozilla® Firefox® ブラウザーで認証済みクロスドメイン アクセスのある `igOlapXmlaDataSource` コンポーネントを使用する場合、[インターネット インフォメーション サービス](http://technet.microsoft.com/ja-jp/library/hh831725) (IIS) の追加構成が必要です。| ![](images/positive.png)
[信頼されていないドメインに対して Internet Explorer 8 および 9 で機能しない認証済みデータ アクセス](#authenticated-access-ie)|`igOlapXmlaDataSource` コンポーネントは Internet Explorer® ブラウザーのバージョン 8 および 9 で信頼されないドメインで多次元 (OLAP) データを取得できません。 | ![](images/positive.png)
[クロス ドメイン要求に対してクロム ブラウザーで表示されない認証のポップアップ](#cross-domain-chrome)|Chrome™ ブラウザの 13 以降では、認証ポップアップ ダイアログはデフォルトではクロスドメイン要求のために表示されません。 | ![](images/positive.png)



### <a id="cross-domain-firefox"></a> Mozilla Firefox ブラウザで機能しない認証済みクロスドメイン データ アクセス

Mozilla Firefox ブラウザーで認証済みクロスドメイン アクセスのある `igOlapXmlaDataSource` コンポーネントを使用する場合、ブラウザー内のバグのため認証プロセスは機能しません (プリフライト要求は未承認として登録されます)。[IIS](http://technet.microsoft.com/ja-jp/library/hh831725) の追加の構成など、回避策は存在します。

>**回避策: ** IIS でカスタム管理モジュールを登録し、Firefox の `OPTIONS` Verb をキャプチャして承認ヘッダーで応答を完了します。詳細については、「[Mozilla Firefox ブラウザーの認証済みアクセスの構成 (igOlapXmlaDataSource)](igOlapXmlaDataSource-Configuring-Authenticated-Access-for-Firefox.html)」トピックを参照してください。

### <a id="authenticated-access-ie"></a> 信頼されていないドメインに対して Internet Explorer 8 および 9 で機能しない認証済みデータ アクセス

`igOlapXmlaDataSource` コンポーネントは Internet Explorer® ブラウザーのバージョン 8 および 9 で信頼されないドメインで多次元 (OLAP) データを取得できません。SQL Server Analysis Services 用に `msmdpump.dll` HTTP データ プロバイダがホストされるドメインがブラウザーの信頼される側のドメインのリストにない場合、ブラウザーはサーバー データにアクセスできません。

> **回避策:** このソリューションは以下のいずれかになります。
> -    ブラウザーのこれらのバージョンを持つユーザーは、ブラウザーの信頼されるサイト リストに追加されるデータ プロバイダー ドメインを持たなければなりません。
> -    ユーザーのブラウザーにより信頼されるドメイン上でデータ プロバイダーをホストします。

### <a id="cross-domain-chrome"></a> クロス ドメイン要求に対してクロム ブラウザーで表示されない認証のポップアップ

Chrome ブラウザの 13 以降では、認証ポップアップ ダイアログはデフォルトではクロスドメイン要求のために表示されません。このビヘイビアーは、ブラウザーのデフォルト セキュリティ ポリシーで規定されています。(そのような条件下で資格情報ポップアップを表示することは、ブラウザーの製造元によるセキュリティリスクとみなされます)

> **回避策:**
> このソリューションは以下のいずれかになります。
> -    Web サイトと HTTP OLAP データ プロバイダ (msmdpump.dll) の両方を同じドメインでホストします。
> -    `--allow-cross-origin-auth-prompt` フラグを設定することにより Chrome ブラウザーを開始します。(Chrome ブラウザーが `--allow-cross-origin-auth-prompt` フラグで開始されると、クロスドメイン要求のためにも表示されます)



## 関連コンテンツ
### トピック

このトピックの追加情報については、以下のトピックも合わせてご参照ください。

- [igOlapXmlaDataSource](igOlapXmlaDataSource.html): これは、`igOlapXmlaDataSource` コンポーネントとその使用を説明しているトピックのグループです。





 

 


