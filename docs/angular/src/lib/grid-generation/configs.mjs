// @ts-check

export const GRID_CONFIGS = {
    grid: {
        igPath: 'grid',
        componentKey: 'Grid',
        igMainTopic: 'grid',
        igObjectRef: 'grid',
        igDemoBasePath: 'grid',
        igComponent: 'Grid',
        igxName: 'IgxGrid',
        igTypeDoc: 'igxgridcomponent',
        igSelector: 'igx-grid',
    },
    treeGrid: {
        igPath: 'treegrid',
        componentKey: 'TreeGrid',
        igMainTopic: 'tree-grid',
        igObjectRef: 'treeGrid',
        igDemoBasePath: 'tree-grid',
        igComponent: 'Tree Grid',
        igxName: 'IgxTreeGrid',
        igTypeDoc: 'igxtreegridcomponent',
        igSelector: 'igx-tree-grid',
    },
    hierarchicalGrid: {
        igPath: 'hierarchicalgrid',
        componentKey: 'HierarchicalGrid',
        igMainTopic: 'hierarchical-grid',
        igObjectRef: 'hierarchicalGrid',
        igDemoBasePath: 'hierarchical-grid',
        igComponent: 'Hierarchical Grid',
        igxName: 'IgxHierarchicalGrid',
        igTypeDoc: 'igxhierarchicalgridcomponent',
        igSelector: 'igx-hierarchical-grid',
    },
    pivotGrid: {
        igPath: 'pivotGrid',
        componentKey: 'PivotGrid',
        igMainTopic: 'pivot-grid',
        igObjectRef: 'pivotGrid',
        igDemoBasePath: 'pivot-grid',
        igComponent: 'Pivot Grid',
        igxName: 'IgxPivotGrid',
        igTypeDoc: 'igxpivotgridcomponent',
        igSelector: 'igx-pivot-grid',
    },
};

/**
 * Builds replacement context for one grid variant.
 * Used by {Component...} token placeholders in shared MDX templates.
 *
 * @param {{
 *   igMainTopic: string,
 *   igObjectRef: string,
 *   igDemoBasePath: string,
 *   igComponent: string,
 *   igxName: string,
 *   igTypeDoc: string,
 *   igSelector: string,
 * }} config
 */
export function createTemplateContext(config) {
    return {
        ComponentMainTopic: config.igMainTopic,
        ComponentObjectRef: config.igObjectRef,
        ComponentDemoBasePath: config.igDemoBasePath,
        ComponentTitle: config.igComponent,
        ComponentName: config.igxName,
        ComponentTypeDoc: config.igTypeDoc,
        ComponentSelector: config.igSelector,

        igMainTopic: config.igMainTopic,
        igObjectRef: config.igObjectRef,
        igDemoBasePath: config.igDemoBasePath,
        igComponent: config.igComponent,
        igxName: config.igxName,
        igTypeDoc: config.igTypeDoc,
        igSelector: config.igSelector,
    };
}
