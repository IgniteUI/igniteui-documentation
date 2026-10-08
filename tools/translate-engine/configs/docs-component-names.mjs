// Ignite UI component / feature names that must stay in English (exact
// capitalization) across the Angular + xplat docs. Single source of truth
// imported as `preserveNames` by both docs configs, so the two never drift.
//
// Derived from the component folders under docs/.../components/. The loader
// (config.ts) sorts these longest-first and masks them byte-for-byte
// (case-sensitive, whole-word), so "Tree Grid" masks before a bare "Grid", and
// capitalized "Grid" is preserved while common-noun "grid" still translates.
//
// AMBIGUOUS ENTRIES: names that are also ordinary English words (marked
// below) can be over-preserved when they appear capitalized at a sentence start
// used generically (e.g. the verb "Select the option"). Case-sensitivity avoids
// the lowercase cases; if you ever see a generic word wrongly kept in English,
// remove it from the ambiguous group.

export default [
  // grids
  'Tree Grid',
  'Data Grid',
  'Pivot Grid',
  'Hierarchical Grid',
  'Row Island',
  'Grid Lite',
  'Grid',
  // data visualization
  'Category Chart',
  'Financial Chart',
  'Data Chart',
  'Doughnut Chart',
  'Pie Chart',
  'Bullet Graph',
  'Chart',
  'Linear Gauge',
  'Radial Gauge',
  'Geo Map',
  'Zoom Slider',
  'Spreadsheet',
  'Excel Library',
  'Dashboard Tile',
  // inputs (multi-word are unambiguous)
  'Button Group',
  'Icon Button',
  'Circular Progress',
  'Linear Progress',
  'Date Time Input',
  'File Input',
  'Mask Input',
  'Query Builder',
  'Text Area',
  'Color Editor',
  'Combo',
  'Dropdown',
  'Checkbox',
  'Radio',
  'Rating',
  'Ripple',
  'Slider',
  'Tooltip',
  'Chip',
  'Badge',
  // layouts
  'Expansion Panel',
  'Dock Manager',
  'Tile Manager',
  'Accordion',
  'Avatar',
  'Carousel',
  'Divider',
  'Splitter',
  'Stepper',
  'Tabs',
  // menus
  'Navigation Drawer',
  'Navbar',
  'Toolbar',
  // notifications
  'Snackbar',
  'Banner',
  'Dialog',
  'Toast',
  // scheduling
  'Date Range Picker',
  'Date Picker',
  'Calendar',
  'Button',
  'Card',
  'Icon',
  'Tree',
];

// DELIBERATELY EXCLUDED from hard masking, these component names are also
// common capitalized IMPERATIVES/verbs in docs prose ("Select the row", "Input
// your name", "Switch to the tab", "Highlight the text", "List the items"), and
// a byte-for-byte mask can't tell the verb from the component. Masking them
// would wrongly keep the verb in English (e.g. "Select la fila"), which is worse
// than translating it. They stay covered by the softer styleGuide, where the
// model still sees the surrounding context and can distinguish the two:
//   'Select', 'Input', 'Switch', 'Highlight', 'List'
