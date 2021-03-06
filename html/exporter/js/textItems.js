/**
 * Generates item's type
 * e.g. `Switch` or `Group`
 * or `Group:Switch:OR(ON, OFF)`
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateType(item) {
    let type = item.type;

    if (item.groupType) {
        type += ':' + item.groupType;
        if (item.function) {
            type += item.function.name ? ':' + item.function.name : '';
            type += item.function.params ? '(' + item.function.params.join(', ') + ')' : '';
        }
    }

    return type;
}

/**
 * Generates a label for the Item
 * @param {Object} item 
 * @return {string}
 */
function generateLabel(item) {
    return '"' + (item.label || item.name) + '"';
}

/**
 * Generates an icon if there's any.
 * 
 * @param {Object} item 
 * @param {Object} model 
 * @return {string}
 */
function generateIcon(item, model) {
    return item.category && model.itemsIcons ? '<' + item.category + '>' : null;
}

/**
 * Generates a list of groups for the item.
 * e.g. (Home, GF_Bedroom, gTemperature)
 * @param {Object} item
 * @return {string}
 */
function generateGroups(item) {
    return item.groupNames.length ? '(' + item.groupNames.join(', ') + ')' : '';
}

/**
 * Generates a list of tags for the item.
 * e.g. ["Switchable"]
 * @param {Object} item
 * @return {string}
 */
function generateTags(item) {
    return item.tags.length ? '["' + item.tags.join('", "') + '"]' : '';
}


/**
 * Generates a "channel" string for the object item
 * e.g. `{channel=""}`
 * @param {Object} item
 * @param {Object} model
 * @return {string}
 */
function generateChannel(item, model) {
    return item.entryType === 'object' && model.itemsChannel ? '{channel=""}' : '';
}

/**
 * Generates an array or items
 * to be later processed by AsciiTable
 * 
 * @param {*} items 
 */
function generateTextualItems(items, model) {
    let result = items.map(item => {
        return [
            generateType(item),
            item.name,
            generateLabel(item),
            generateIcon(item, model),
            generateGroups(item),
            generateTags(item),
            generateChannel(item, model)
        ]
    });

    // Add some spacing between blocks
    if (result.length) {
        result.push(['']);
    }

    return result;
}

/**
 * Transforms array of lines
 * into column-aligned table
 * @param {Array} lines 
 */
function toTable(lines) {
    let table = new AsciiTable();

    // Create the ascii-table to auto-format file
    let result = table.addRowMatrix(lines)
        .removeBorder()
        .toString();

    // Cleanup the lines
    result = result.split('\n')
        .map((line) => line.slice(2).trimRight())
        .join('\n');

    return result
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/**
 * Generates a textual Items file based on user input
 * Needs several datapoints from the model such as
 * floorsCount, rooms collection, objects etc.
 * @param {*} items
 * @return {string}
 */
function generateItems(items) {
    let lines = [
        ...generateTextualItems(items, {
            itemsChannel: false,
            itemsIcons: true
        })
    ];

    return toTable(lines) + '\n';
}