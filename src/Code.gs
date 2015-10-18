/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
 */

var DIALOG_TITLE = 'Configuration Dialog';
var SIDEBAR_TITLE = 'Example Sidebar';

/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
    loadConfiguration();

    SpreadsheetApp.getUi()
        .createAddonMenu()
        .addItem('Edit Products', 'showSidebar')
        .addItem('Configuration', 'showConfigurationDialog')
        .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
    onOpen(e);
}

function onEdit(e) {
    onEditEventCheck(e);
}
/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
function showSidebar2() {
    var ui = HtmlService.createTemplateFromFile('Sidebar')
        .evaluate()
        .setTitle(SIDEBAR_TITLE)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showSidebar(ui);
}

/**
 * Opens a dialog. The dialog structure is described in the Dialog.html
 * project file.
 */
function showConfigurationDialog() {
    var ui = HtmlService.createTemplateFromFile('Dialog')
        .evaluate()
        .setWidth(600)
        .setHeight(500)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(ui, DIALOG_TITLE);
}

/**
 * Returns the value in the active cell.
 *
 * @return {String} The value of the active cell.
 */
function getProductsByShopId(value) {

    loadProducts(value);
}

/**
 * Replaces the active cell value with the given value.
 *
 * @param {Number} value A reference number to replace with.
 */
function pushProductChangesToServer(value) {
    // Use data collected from sidebar to manipulate the sheet.
    //var cell = SpreadsheetApp.getActiveSheet().getActiveCell();
    //cell.setValue(value);
    var shopId = 1;

    var count = updateProducts(shopId);

    return 'updated ' + count + ' products';

}

/**
 * Executes the specified action (create a new sheet, copy the active sheet, or
 * clear the current sheet).
 *
 * @param {String} data An identifier for the action to take.
 */
function updateConfiguration(data) {

    var properties = PropertiesService.getScriptProperties();
    properties.setProperty('OAUTH_CLIENT_ID', data.OAUTH_CLIENT_ID);
    properties.setProperty('OAUTH_CLIENT_SECRET', data.OAUTH_CLIENT_SECRET);
    properties.setProperty('MAGENTO_HOST', data.MAGENTO_HOST);
    properties.setProperty('MAGENTO_API_URL', data.MAGENTO_API_URL);

    return true;
}

function loadConfiguration() {
    var properties = PropertiesService.getScriptProperties();
    var OAUTH_CLIENT_ID = properties.getProperty('OAUTH_CLIENT_ID');
    var OAUTH_CLIENT_SECRET = properties.getProperty('OAUTH_CLIENT_SECRET');
    var MAGENTO_HOST = properties.getProperty('MAGENTO_HOST');
    var MAGENTO_API_URL = properties.getProperty('MAGENTO_API_URL');
    //TODO: add tests here
}
