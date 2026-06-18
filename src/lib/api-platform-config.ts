export type PlatformName = 'Angular' | 'React' | 'WebComponents' | 'Blazor';

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
    folder: string;
    prefix: string;
    pascalCaseMembers?: boolean;
    apiPackages: Record<string, ApiPackageDefinition>;
};

export const PLATFORM_MAP = {
    angular: 'Angular',
    react: 'React',
    wc: 'WebComponents',
    blazor: 'Blazor',
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
};

export function apiDocsPlatformPath(platform: PlatformName): string {
    return API_PLATFORM_CONFIGS[platform].folder;
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
