<!--
|metadata|
{
    "fileName": "igolapxmladatasource-configuring-iis-for-cross-domain-olap-data",
    "controlName": "igOlapXmlaDataSource",
    "tags": ["How Do I","Tips and Tricks"]
}
|metadata|
-->

# クロスドメイン OLAP データの IIS の構成 (igOlapXmlaDataSource)

## トピックの概要
### 目的

このトピックでは、インターネット インフォメーション サービス (IIS) のホスト HTTP データ プロバイダー (`msmdpump.dll`) を SQL Server Analysis Services (SSAS) のクロスドメイン アクセス (認証済みアクセスおよび認証されていないアクセス) のために構成する方法を紹介します。この設定は、[igOlapXmlaDataSource](igOlapXmlaDataSource-Overview.html) コントロールの特定の使用シナリオで必要です。

Mozilla Firefox ブラウザー (作成時間にバージョン 17) の認証済みアクセスの構成の場合、[Mozilla Firefox ブラウザーの認証済みアクセスの構成](igOlapXmlaDataSource-Configuring-Authenticated-Access-for-Firefox.html)トピックを参照してください。

### 前提条件

以下の表は、このトピックを理解するための前提条件として必要な概念とトピックの一覧です。

**概念**

-   [SQL Server Analysis Services (SSAS)](http://msdn.microsoft.com/ja-jp/library/ms175609%28v=sql.90%29.aspx)
-   [XML for Analysis (XMLA)](http://en.wikipedia.org/wiki/XML_for_Analysis)
-   [オンライン解析処理 (OLAP)](http://en.wikipedia.org/wiki/OLAP)

**トピック**

- [igOlapXmlaDataSource の概要](igOlapXmlaDataSource-Overview.html): このトピックでは、データの取得に SSAS インスタンスを使用する `igOlapXmlaDataSource` コンポーネントの概要を説明します。



### このトピックの内容

このトピックは、以下のセクションで構成されます。

-   [クロスドメイン OLAP データ (認証されていないアクセス) のために IIS の構成 - 概念的概要](#conceptual-overview)
    -   [クロスドメイン OLAP データ (認証されていないアクセス) のために IIS の構成の概要](#summary)
    -   [手順](#overview-steps)
    -   [HTTP 応答ヘッダーの設定](#http-response)
    -   [OPTIONSVerbHandler マッピング設定](#mapping-settings)
-   [クロスドメイン OLAP データ (認証されていないアクセス) のために IIS の構成 - 手順](#procedure)
    -   [概要](#introduction)
    -   [前提条件](#prerequisites)
    -   [概要](#overview)
    -   [手順](#steps)
-   [関連コンテンツ](#related-contnt)
    -   [サンプル](#samples)
    -   [リソース](#resources)



## <a id="conceptual-overview"></a>クロスドメイン OLAP データのために IIS の構成 - 概念的概要
### <a id="summary"></a>クロスドメイン OLAP データの IIS の構成の概要

`igOlapXmlaDataSource` コントロールは、HTTP アクセス プロバイダー (`msmdpump.dll`) へのクロスドメイン アクセスを許可します。ただし、HTTP アクセス プロバイダーを実行する IIS アプリケーションに設定を変更する必要があります。信頼される側のドメインのみからのアクセスを許可する場合、IIS 設定の変更の必要がありません。

クロスドメイン アクセスのために、データ要求を送信する有効なドメインを指定し、データを送信する方法、要求に使用可能なヘッダーを制御するフィールド、および認証済みアクセスの場合、ユーザー資格情報を提供する必要があることを示す必要があります。複数の HTTP 応答ハンドラーを構成する必要があります。

また、OPTIONS メソッド要求のサーバー応答を構成する必要があります。このために、OPTIONSVerbHandler を構成します。

3 つの HTTP 応答ヘッダーは名前および値を含みます。名前は [World Wide Web Consortium (W3C)](http://www.w3.org/) の[クロスオリジン リソースの共有](http://www.w3.org/TR/access-control/)ドキュメントの定義のために必須で、値は要求の特定の動作を指定します。以下の表は各の HTTP 応答ヘッダーの目的を説明します。

ヘッダー名|説明
---|---
Access-Control-Allow-Headers |要求で使用可能なヘッダー フィールド名を処理します。
Access-Control-Allow-Origin|要求が承諾するドメインを構成します。
Access-Control-Request-Method|要求で使用するメソッドを指定します。
Access-Control-Request-Method  (認証済みアクセスのみ)|要求で使用するメソッドを指定します。



トピックの以下のセクションで詳細な構成情報を提供します。

-   カスタム ヘッダーを作成して構成する方法について、[HTTP 応答ヘッダーの設定](#http-response)セクションを参照してください。
-   OPTIONSVerbHandler を構成する方法について、[OPTIONSVerbHandler マッピング設定](#mapping-settings)セクションを参照してください。
-   詳細な手順について、[クロスドメイン OLAP データ (認証されていないアクセス) のために IIS の構成 - 手順](#procedure)セクションを参照してください。

### <a id="overview-steps"></a>手順

以下は、認証せずにクロスドメイン OLAP データのために IIS の構成の手順です。

1. HTTP 応答ヘッダーの構成

2. OPTIONSVerbHandler の構成

### <a id="http-response"></a>HTTP 応答ヘッダーの設定

以下の表は、認証せずにクロスドメイン OLAP データのために IIS を構成するための HTTP 応答ヘッダーの必要な設定をリストします。設定は、HTTP アクセス プロバイダーをホストするアプリケーションの HTTP 応答ヘッダー オプションからカスタム ヘッダーとして構成されます。

<table class="table">
	<thead>
		<tr>
            <th>
ヘッダー名
			</th>

            <th>
値
			</th>

            <th>
詳細
			</th>
        </tr>
	</thead>
	<tbody>
        

        <tr>
            <td>
**Access-Control-Allow-Headers**
			</td>

            <td>
Origin, Content-Type, Accept
			</td>

            <td>
                要求に使用する必要があるフィールドの名前です。名前はコンマで分割されます。

                この特定のフィールドは `igOlapXmlaDataSource` コントロールによって必要です。設定されない場合、クロスオリジン要求は失敗します。

                <ul>
                    <li>
Origin - このヘッダー フィールドは、クロスオリジン要求またはプリフライト要求の送信元を示します。この設定は、サーバーが要求の送信元を確認するために必要です。
					</li>

                    <li>
Content-Type - このヘッダー フィールドは送信したエンティティ ボディのコンテンツ タイプ (MIME) を示します。サーバーおよび `igOlapXmlaDataSource` の値のコミュニケーションのコンテンツ タイプは「text/xml」です。
                        text/xml.
					</li>

                    <li>
Accept - このヘッダー フィールドは応答の許可されるメディア タイプを指定します。Accept ヘッダーを使用すると、要求のタイプを制限できます。
					</li>
                </ul>
            </td>
        </tr>

        <tr>
            <td>
**Access-Control-Allow-Origin**
			</td>

            <td>
許可されるドメインの名前、またはすべてのドメインを許可するためにアスタリスク (\*)。
			</td>

            <td>
複数のドメインにアクセスを許可するには、ドメイン名をコンマ (,) に分割して設定します。
			</td>
        </tr>

        <tr>
            <td>
**Access-Control-Request-Method**
			</td>

            <td>
POST
			</td>

            <td>
要求に使用する HTTP メソッドの名前。

                `igOlapXmlaDataSource` コントロールは、要求メソッドが POST の必要があります。
			</td>
        </tr>

        <tr>
            <td>
<b>Access-Control-Allow-Credentials</b> (認証済みアクセスのみ)
			</td>

            <td>
true
			</td>

            <td>
                利用可能な値:

                <ul>
                    <li>
true - 要求と共に資格情報の提供は有効です
					</li>

                    <li>
false - 要求と共に資格情報の提供は無効です。ヘッダーを定義しないことと同じです。
					</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>



### <a id="mapping-settings"></a>OPTIONSVerbHandler マッピング設定

以下の表は、HTTP ハンドラーの必要な設定をリストします。

HTTP ハンドラー名|必要なアクセス レベル|詳細
---|---|---
*OPTIONSVerbHandler*|Read|ハンドラーは要求へ読み取りアクセスが必要のことを指定します。





## <a id="procedure"></a>クロスドメイン OLAP データ (認証されていないアクセス) のために IIS の構成 - 手順
### <a id="introduction"></a>概要

この手順は、IIS アプリケーションを何でもドメインから HTTP ヘッダーを承諾するために構成します。アクセスは認証済みまたは認証されていないです。認証済みアクセスの追加の設定が提供されています。

### <a id="prerequisites"></a>前提条件

この手順を実行するには、以下のリソースが必要です。

-   HTTP アクセス プロバイダーをホストされる IIS OLAP アプリケーションへのアクセス

### <a id="overview"></a>概要

以下はプロセスの概念的概要です。

1. IIS OLAP アプリケーションへのアクセス

2. HTTP 応答ヘッダーの構成

3. OPTIONSVerbHandler の構成

### <a id="steps"></a>手順

以下の手順は、HTTP ヘッダーを承認するために IIS を設定する方法を紹介します。

1. IIS OLAP アプリケーションへアクセスします。

	1. サーバーへ接続します。
	
		リモート デスクトップ接続などのツールを使用してアプリケーションがあるリモート サーバーに接続します。
	
	2. IIS マネージャーを起動します。
	
		サーバーの IIS マネージャーを起動します。
	
	3. IIS アプリケーションへ移動します。
	
		IIS マネージャー インターフェイスを使用して、HTTP アクセス プロバイダー (msmdpump.dll) をホストするアプリケーションへ移動します。この場合、OLAP アプリケーションにアクセスします。

		![](images/igXmlaDataSource_Configuring_IIS_1.png)

2. HTTP 応答ヘッダーを構成します。

	アプリケーションでは、必要なヘッダーを追加して構成します。
	
	以下の表は各のヘッダーに使用する設定を指定します。この例では、すべてのドメインからの要求を承諾します (Access-Control-Allow-Origin で * を設定します)。特定のドメインからの要求のみを承諾するには、アスタリスク (*) の代わりにドメイン名を入力します。匿名アクセスを有効にするには、Access-Control-Allow-Credentials ヘッダーを定義しません。値の説明について、[HTTP 応答ヘッダーの設定](#http-response)を参照してください。
	
	<table class="table">
	    <thead>
	        <tr>
	            <th>名前</th>
	            <th>値</th>
	        </tr>
	    </thead>
	    <tbody>
	        <tr>
	            <td>Access-Control-Allow-Headers</td>
	            <td>Origin, Content-Type, Accept</td>
	        </tr>
	        <tr>
	            <td>Access-Control-Allow-Origin</td>
	            <td>\*</td>
	        </tr>
	        <tr>
	            <td>Access-Control-Request-Method</td>
	            <td>POST</td>
	        </tr>
	        <tr>
	            <td>Access-Control-Allow-Credentials (認証済みアクセスのみ)</td>
	            <td>true</td>
	        </tr>
	    </tbody>
	</table>	
		
	 **ヘッダーを追加して構成するには:**

	1. アプリケーションのホーム ペインでは、**HTTP 応答ヘッダー**をダブルクリックします。

		HTTP 応答ヘッダーのモジュールを開きます。
		
		![](images/igXmlaDataSource_Configuring_IIS_2.png)

	2. カスタム HTTP 応答ヘッダーを追加します。

		A. **アクション** ペインでは、**「追加...」**リンクをクリックします。
		
		「**カスタム HTTP 応答ヘッダー**」ダイアログが表示されます。
		
		![](images/igXmlaDataSource_Configuring_IIS_3.png)
		
		ヘッダーを構成します。
		
		**Name** フィールドに、**HTTP 応答ヘッダーの名前** (たとえば `Access-Control-Allow-Headers`) を入力します。Value フィールドに **HTTP 応答ヘッダーの値を入力します** (たとえば `Origin`, `Content-Type`, `Accept`)。
		
		C. OK をクリックします。
		
		D. 他のヘッダーのために、その設定を使用して A - C の手順を繰り返します。

3. OPTIONSVerbHandler を構成します。

	1. **ハンドラー マッピング** モジュールにアクセスします。
	
		OLAP アプリケーションに移動して、**HandlerMappings** をダブルクリックします。ハンドラー マッピングのモジュールを開きます。
		
		![](images/igXmlaDataSource_Configuring_IIS_4.png)
	
	2. OPTIONSVerbHandler をダブルクリックします。モジュール マッピングの編集ダイアログを開きます。
	
		![](images/igXmlaDataSource_Configuring_IIS_5.png)
	
	3. Read アクセスを許可します。
	
		**要求制限**ボタンをクリックします。「要求制限」ダイアログが表示されます。
		
		![](images/igXmlaDataSource_Configuring_IIS_6.png)
		
		B. アクセス タブでは、アクセス設定を Read に設定します。
		
		Ｃ. OK をクリックします。「要求制限」ダイアログが閉じて、モジュール マッピングの編集ダイアログに戻ります。
		
		D. OK をクリックします。モジュール マッピングの編集 ダイアログが閉じ、呼び出す画面に戻ります。

4. OPTIONSVerbHandler がハンドラー マッピング リストの上にあることを確認します。

	ハンドラー マッピングをアクセスするには、アクション メニューから順序リストの表示…をクリックします。OPTIONSVerbHandler がハンドラー マッピング リストの上に設定する必要があります。上にない場合、OPTIONSVerbHandler を選択し、アクション メニューの上へ移動コマンドを使用して上に移動します。

	![](images/igXmlaDataSource_Configuring_IIS_7.png)



## <a id="related-contnt"></a>関連コンテンツ
### <a id="samples"></a>サンプル

このトピックについては、以下のサンプルも参照してください。

- [XMLA にバインドした KPI の表示](%%SamplesUrl%%/pivot-view/binding-to-xmla-data-source): このサンプルでは、`igPivotView` を `igOlapXmlaDataSource` にバインドする方法を紹介します。

- [リモート XMLA プロバイダー](%%SamplesUrl%%/pivot-grid/remote-xmla-provider): このサンプルは、`igOlapXmlaDataSource` のネットワーク トラフィックのより少ないリモート プロバイダー機能を使用するメリットのいずれかを示します。すべての要求は、クロス ドメインの問題を防止するためにサーバー アプリケーションを介してプロキシーされます。また、応答のサイズを小さくなるために、データが JSON に変換されます。



### <a id="resources"></a>リソース

以下の資料 (Infragistics のコンテンツ ファミリー以外でもご利用いただけます) は、このトピックに関連する追加情報を提供します。

- [HTTP ヘッダー フィールドのリスト](http://en.wikipedia.org/wiki/List_of_HTTP_header_fields): すべての HTTP ヘッダー フィールドをリストして説明します。

- [暫定的なメッセージ ヘッダーのフィールド名](http://www.iana.org/assignments/message-headers/prov-headers.html): ヘッダー フィールド名のオフィシャル リスト。

- [クロスオリジンのリソース共有](http://www.w3.org/TR/access-control/): このドキュメントは、クライアント側のクロスオリジン要求を有効にする方法を定義します。

- [オンライン解析処理 (OLAP) との操作](http://msdn.microsoft.com/ja-jp/library/ms175367%28v=SQL.90%29.aspx): このトピックは OLAP データの操作の概要です。

- [チュートリアル: カスタム HTTP モジュールの作成と登録](http://msdn.microsoft.com/ja-jp/library/ms227673%28v=vs.100%29.aspx): このチュートリアルは、カスタム HTTP モジュールの基本機能を紹介します。





 

 


