/**
 * Add library https://github.com/googlesamples/apps-script-oauth1
 */
function doGet() {

    var magentoService = getMagentoService();
    if (!magentoService.hasAccess()) {
        var authorizationUrl = magentoService.authorize();
        var template = HtmlService.createTemplate(
            '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
            'Reopen the sidebar when the authorization is complete.');
        template.authorizationUrl = authorizationUrl;
        var page = template.evaluate();

        return template.evaluate();
    }

    var data = Magento.api.getProducts();

    return HtmlService.createHtmlOutput(JSON.stringify(data));
}

function getMagentoService() {
    // Create a new service with the given name. The name will be used when
    // persisting the authorized token, so ensure it is unique within the
    // scope of the property store.
    var apiHost = getConfigValue('MAGENTO_HOST');

    return OAuth1.createService('magento')

        // Set the endpoint URLs.
        .setAccessTokenUrl(apiHost + '/oauth/token')
        .setRequestTokenUrl(apiHost + '/oauth/initiate')
        .setAuthorizationUrl(apiHost + '/admin/oauth_authorize')

        // Set the consumer key and secret.
        .setConsumerKey(getConfigValue('OAUTH_CLIENT_ID'))
        .setConsumerSecret(getConfigValue('OAUTH_CLIENT_SECRET'))

        // Set the name of the callback function in the script referenced
        // above that should be invoked to complete the OAuth flow.
        .setCallbackFunction('authCallback')

        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getUserProperties());
}




function showSidebar() {
    var magentoService = getMagentoService();

    if (!magentoService.hasAccess()) {
        var authorizationUrl = magentoService.authorize();
        var template = HtmlService.createTemplate(
            '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
            'Reopen the sidebar when the authorization is complete.');
        template.authorizationUrl = authorizationUrl;
        var page = template.evaluate();
        SpreadsheetApp.getUi().showSidebar(page);
    } else {
        var ui = HtmlService.createTemplateFromFile('Sidebar')
            .evaluate()
            .setTitle('Import Products')
            .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        SpreadsheetApp.getUi().showSidebar(ui);
    }
}

function authCallback(request) {
    var magentoService = getMagentoService();
    var isAuthorized = magentoService.handleCallback(request);
    if (isAuthorized) {
        return HtmlService.createHtmlOutput('Success! You can close this tab.');
    }

    return HtmlService.createHtmlOutput('Denied. You can close this tab');

}

function clearService(){
    OAuth1.createService('magento')
        .setPropertyStore(PropertiesService.getUserProperties())
        .reset();
}


function loadProducts(shopId) {
    //123
    var fields = {
        "entity_id": true,
        //"attribute_set_id": true,
        //"type_id": true,
        "sku": true,
        "status": true,
        "visibility": true,
        "tax_class_id": true,
        "weight": true,
        "price": true,
        "special_price": true,
        "name": true,
        "url_key": true,
        "country_of_manufacture": true,
        //"msrp": true,
        //"msrp_enabled": true,
        //"msrp_display_actual_price_type": true,
        "meta_title": true,
        "meta_description": true,
        "meta_keyword": true,
        //"custom_design": true,
        //"page_layout": true,
        //"options_container": true,
        "short_description": true,
        "description": true,
        //"gift_message_available": true,
        //"news_from_date": true,
        //"news_to_date": true,
        //"special_from_date": true,
        //"special_to_date": true,
        //"custom_design_from": true,
        //"custom_design_to": true,
        //"custom_layout_update": true
    };

    var keys = [];
    for(var k in fields) keys.push(k);

    var products = [];

    var shopId = 1;
    var page = 1;
    var limit = 100;

    var data = null;

    try {
        while (data = Magento.api.getProducts(shopId, page, limit, keys)) {
            products = merge_options(products, data);
            page++;

            Logger.log(Object.keys(data).length + '<' + limit);

            if (Object.keys(data).length < limit) {
                break;
            }
        }

        Logger.log(products);

        populateProductData(fields, products);
    } catch (e) {

        Logger.log(e);


        clearService();
        throw 'oauth_problem=token_rejected - reopen Sidebar';
    }
}

function updateProducts(shopId) {
    var changes = getChangedProducts();

    var updatesCount = 0;
    for (var i in changes) {
        var product = changes[i];
        var entity_id = product['entity_id'];
        delete product['entity_id'];
        var data  = Magento.api.updateProduct(shopId, entity_id, product);

        Logger.log(data);

        updatesCount++;
    }

    return updatesCount;
}