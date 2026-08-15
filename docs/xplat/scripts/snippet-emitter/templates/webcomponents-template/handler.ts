import { CodeGenHelper } from './libraryManager';
//insert handlersImports
//end handlersImports

export class PlaceholderHolder {

    constructor() {
        
    }

    //insert eventHandlers
    //end eventHandlers

// ifdef handlersStyles
    public requiredStyles: string = `
// insert handlersStyles

// end handlersStyles
    `;
// endifdef handlersStyles

}

// The types a handler needs beside it, at the scope the component is declared at: a supporting item
// is not nested, because not every platform has nested types.
//insert supportingTypes
//end supportingTypes
