export type PlatformName = 'Angular' | 'React' | 'WebComponents' | 'Blazor' | 'WinUI' | 'Uno';

export type ApiPackageDefinition = {
    packageId: string;
    classSuffix?: string;
    pascalCaseMembers?: boolean;
};

export type ApiPackageRuntimeConfig = ApiPackageDefinition & {
    docRoot: string;
    noPackagePrefix: true;
    preserveCase: true;
};

export type ApiPlatformDefinition = {
    /** Internal folder used to store the checked-in ApiLink registry. */
    folder: string;
    /** Public path segment used by the hosted API documentation site. */
    publicPath?: string;
    prefix: string;
    pascalCaseMembers?: boolean;
    apiPackages: Record<string, ApiPackageDefinition>;
};

export const PLATFORM_MAP = {
    angular: 'Angular',
    react: 'React',
    wc: 'WebComponents',
    blazor: 'Blazor',
    winui: 'WinUI',
    uno: 'Uno',
} as const satisfies Record<string, PlatformName>;

export const API_PLATFORM_CONFIGS: Record<PlatformName, ApiPlatformDefinition> = {
    Angular: {
        folder: 'angular',
        prefix: 'Igx',
        apiPackages: {
            core:        { packageId: 'igniteui-angular', classSuffix: 'Component' },
            charts:      { packageId: 'igniteui-angular-charts', classSuffix: 'Component' },
            grids:       { packageId: 'igniteui-angular', classSuffix: 'Component' },
            gauges:      { packageId: 'igniteui-angular-gauges', classSuffix: 'Component' },
            maps:        { packageId: 'igniteui-angular-maps', classSuffix: 'Component' },
            inputs:      { packageId: 'igniteui-angular-inputs', classSuffix: 'Component' },
            layouts:     { packageId: 'igniteui-angular-layouts', classSuffix: 'Component' },
            dashboards:  { packageId: 'igniteui-angular-dashboards', classSuffix: 'Component' },
            fdc3:        { packageId: 'igniteui-angular-fdc3', classSuffix: 'Component' },
            spreadsheet: { packageId: 'igniteui-angular-spreadsheet', classSuffix: 'Component' },
            excel:       { packageId: 'igniteui-angular-excel' },
            'geo-core':  { packageId: 'igniteui-angular-core' },
            datasources: { packageId: 'igniteui-angular-datasources' },
        },
    },
    React: {
        folder: 'react',
        prefix: 'Igr',
        apiPackages: {
            core:         { packageId: 'igniteui-react' },
            charts:       { packageId: 'igniteui-react-charts' },
            grids:        { packageId: 'igniteui-react-grids' },
            gauges:       { packageId: 'igniteui-react-gauges' },
            maps:         { packageId: 'igniteui-react-maps' },
            inputs:       { packageId: 'igniteui-react' },
            layouts:      { packageId: 'igniteui-react' },
            dashboards:   { packageId: 'igniteui-react-dashboards' },
            fdc3:         { packageId: 'igniteui-react-fdc3' },
            spreadsheet:  { packageId: 'igniteui-react-spreadsheet' },
            datasources:  { packageId: 'igniteui-react-datasources' },
            excel:        { packageId: 'igniteui-react-excel' },
            'geo-core':   { packageId: 'igniteui-react-core' },
            'data-grids': { packageId: 'igniteui-react-grids' },
            'grid-lite':  { packageId: 'igniteui-react-grids' },
            dockmanager:  { packageId: 'igniteui-react-dockmanager' },
        },
    },
    WebComponents: {
        folder: 'webcomponents',
        prefix: 'Igc',
        apiPackages: {
            core:         { packageId: 'igniteui-webcomponents', classSuffix: 'Component' },
            charts:       { packageId: 'igniteui-webcomponents-charts', classSuffix: 'Component' },
            grids:        { packageId: 'igniteui-webcomponents-grids', classSuffix: 'Component' },
            gauges:       { packageId: 'igniteui-webcomponents-gauges', classSuffix: 'Component' },
            maps:         { packageId: 'igniteui-webcomponents-maps', classSuffix: 'Component' },
            inputs:       { packageId: 'igniteui-webcomponents', classSuffix: 'Component' },
            layouts:      { packageId: 'igniteui-webcomponents', classSuffix: 'Component' },
            dashboards:   { packageId: 'igniteui-webcomponents-dashboards', classSuffix: 'Component' },
            fdc3:         { packageId: 'igniteui-webcomponents-fdc3', classSuffix: 'Component' },
            spreadsheet:  { packageId: 'igniteui-webcomponents-spreadsheet', classSuffix: 'Component' },
            dockmanager:  { packageId: 'igniteui-dockmanager', classSuffix: 'Component' },
            excel:        { packageId: 'igniteui-webcomponents-excel' },
            datasources:  { packageId: 'igniteui-webcomponents-datasources' },
            'data-grids': { packageId: 'igniteui-webcomponents-data-grids' },
            'geo-core':   { packageId: 'igniteui-webcomponents-core' },
            gridlite:     { packageId: 'igniteui-grid-lite' },
            'grid-lite':  { packageId: 'igniteui-grid-lite' },
        },
    },
    Blazor: {
        folder: 'blazor',
        prefix: 'Igb',
        pascalCaseMembers: true,
        apiPackages: {
            core:          { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            charts:        { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            grids:         { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            gauges:        { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            maps:          { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            inputs:        { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            layouts:       { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            dashboards:    { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            spreadsheet:   { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            datasources:   { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            'data-grids':  { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            'geo-core':    { packageId: 'IgniteUI.Blazor', pascalCaseMembers: true },
            excel:         { packageId: 'IgniteUI.Blazor.Documents.Excel', pascalCaseMembers: true },
            documentsCore: { packageId: 'IgniteUI.Blazor.Documents.Core', pascalCaseMembers: true },
            lite:          { packageId: 'IgniteUI.Blazor.Lite', pascalCaseMembers: true },
            gridlite:      { packageId: 'IgniteUI.Blazor.GridLite', pascalCaseMembers: true },
            'grid-lite':   { packageId: 'IgniteUI.Blazor.GridLite', pascalCaseMembers: true },
        },
    },
    // -----------------------------------------------------------------------
    // WinUI / Uno
    //
    // `prefix: 'Xam'` is correct for the controls (XamRadialGauge, XamDataChart,
    // XamDataGrid, XamGeographicMap, …) but NOT for helper types, which are
    // unprefixed in shipping WinUI (RadialGaugeRange, LinearGraphRange,
    // DataGridToolbar, ColumnSortDescription). The resolver tries the prefixed
    // and the bare form and takes whichever the registry contains, so both
    // shapes resolve. See WINUI-UNO-PLAN.md §6.3.
    //
    // The package IDs below match the generated api-docs registry.
    // -----------------------------------------------------------------------
    WinUI: {
        folder: 'winui',
        prefix: 'Xam',
        pascalCaseMembers: true,
        apiPackages: {
            core:         { packageId: 'Infragistics.WinUI.Core', pascalCaseMembers: true },
            charts:       { packageId: 'Infragistics.WinUI.Charts', pascalCaseMembers: true },
            grids:        { packageId: 'Infragistics.WinUI.DataGrid', pascalCaseMembers: true },
            'data-grids': { packageId: 'Infragistics.WinUI.DataGrid', pascalCaseMembers: true },
            gauges:       { packageId: 'Infragistics.WinUI.Gauges', pascalCaseMembers: true },
            maps:         { packageId: 'Infragistics.WinUI.Maps', pascalCaseMembers: true },
            inputs:       { packageId: 'Infragistics.WinUI.Inputs', pascalCaseMembers: true },
            layouts:      { packageId: 'Infragistics.WinUI.Layouts', pascalCaseMembers: true },
            dashboards:   { packageId: 'Infragistics.WinUI.Dashboards', pascalCaseMembers: true },
            datasources:  { packageId: 'Infragistics.WinUI.DataVisualization', pascalCaseMembers: true },
            'geo-core':   { packageId: 'Infragistics.WinUI.DataVisualization', pascalCaseMembers: true },
        },
    },
    // Uno Platform shares the WinUI XAML surface with Uno-specific package IDs.
    Uno: {
        folder: 'uno',
        publicPath: 'uno-platform',
        prefix: 'Xam',
        pascalCaseMembers: true,
        apiPackages: {
            core:         { packageId: 'Infragistics.Uno.Core', pascalCaseMembers: true },
            charts:       { packageId: 'Infragistics.Uno.Charts', pascalCaseMembers: true },
            grids:        { packageId: 'Infragistics.Uno.DataGrid', pascalCaseMembers: true },
            'data-grids': { packageId: 'Infragistics.Uno.DataGrid', pascalCaseMembers: true },
            gauges:       { packageId: 'Infragistics.Uno.Gauges', pascalCaseMembers: true },
            maps:         { packageId: 'Infragistics.Uno.Maps', pascalCaseMembers: true },
            inputs:       { packageId: 'Infragistics.Uno.Inputs', pascalCaseMembers: true },
            layouts:      { packageId: 'Infragistics.Uno.Layouts', pascalCaseMembers: true },
            dashboards:   { packageId: 'Infragistics.Uno.Dashboards', pascalCaseMembers: true },
            datasources:  { packageId: 'Infragistics.Uno.DataVisualization', pascalCaseMembers: true },
            'geo-core':   { packageId: 'Infragistics.Uno.DataVisualization', pascalCaseMembers: true },
        },
    },
};

export function apiDocsPlatformPath(platform: PlatformName): string {
    const config = API_PLATFORM_CONFIGS[platform];
    return config.publicPath ?? config.folder;
}

export function apiDocRoot(apiDocsBaseUrl: string, platform: PlatformName, packageId: string): string {
    return `${apiDocsBaseUrl}/${apiDocsPlatformPath(platform)}/${packageId}/latest`;
}

export function createApiPackages(apiDocsBaseUrl: string, platform: PlatformName): Record<string, ApiPackageRuntimeConfig> {
    return Object.fromEntries(
        Object.entries(API_PLATFORM_CONFIGS[platform].apiPackages).map(([key, pkg]) => [
            key,
            {
                ...pkg,
                docRoot: apiDocRoot(apiDocsBaseUrl, platform, pkg.packageId),
                noPackagePrefix: true,
                preserveCase: true,
            },
        ])
    );
}

export function getPackageIds(platform: PlatformName): Record<string, string> {
    return Object.fromEntries(
        Object.entries(API_PLATFORM_CONFIGS[platform].apiPackages).map(([key, pkg]) => [key, pkg.packageId])
    );
}

export function getPackageClassSuffixes(platform: PlatformName): Record<string, string | undefined> {
    return Object.fromEntries(
        Object.entries(API_PLATFORM_CONFIGS[platform].apiPackages).map(([key, pkg]) => [key, pkg.classSuffix])
    );
}
