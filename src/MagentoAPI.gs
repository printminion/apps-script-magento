var Magento = Magento || {};
Magento.api = {};

Magento.api = {

    MAGENTO_API_URL: undefined,

    setApiUrl: function(url) {
        this.MAGENTO_API_URL = url;
    },

    getProducts: function(shopId, page, limit, fields) {
        var magentoService = getMagentoService();

        shopId = shopId || 1;
        page = page || 1;
        limit = limit || 10;
        fields = fields || [];

        var options =
        {
            "method" : "get",
            //     "muteHttpExceptions" : true,
            "headers" : {
                'Content-Type' : 'application/json',
                'Accept' : '*/*'
            }
        };

        var query = [];

        if (page) {
            query.push('page=' + page);
        }

        if (limit) {
            query.push('limit=' + limit);
        }

        if (fields.length) {
            //@XXX: It works not like I thought
            //query.push('fields=' + fields.join(','));
        }

        query = (query.length) ? '?' + query.join('&') : '';

        var response = magentoService.fetch(this.MAGENTO_API_URL + '/products' + query, options);

        var content = response.getContentText();

        Logger.log(content);

        return JSON.parse(content);
    },

    updateProduct: function(shopId, productId, data) {
        var magentoService = getMagentoService();

        if (!shopId) {
            throw 'required parameter shopId is not set';
        }

        if (!productId) {
            throw 'required parameter productId is not set';
        }

        if (!data) {
            throw 'required parameter shopId is not set';
        }

        //    productId = 1;
        //    data = {
        //      'name' : 'Tst'
        //    };

        var options =
        {
            "method" : "put",
            "muteHttpExceptions" : true,
            "contentType" : "application/json",
            "headers" : {
                'Content-Type' : 'application/json',
                'Accept' : '*/*'
            },
            'payload' : JSON.stringify(data)
        };


        var response = magentoService.fetch(this.MAGENTO_API_URL + '/products/' + productId, options);

        var content = response.getContentText();

        Logger.log(content);

        return true;
    },

    createProduct: function(shopId, data) {
        var magentoService = getMagentoService();

        shopId = 1;


        var options =
        {
            "method" : "post",
            "muteHttpExceptions" : true,
            "contentType" : "application/json",
            "headers" : {
                'Content-Type' : 'application/json',
                'Accept' : '*/*'
            },
            'payload' : JSON.stringify(data)
        };


        var response = magentoService.fetch(this.MAGENTO_API_URL + '/products', options);

        var content = response.getContentText();

        Logger.log(content);

        return true;
    }

};


Magento.api.setApiUrl(getConfigValue('MAGENTO_API_URL'));

function test_getProducts() {

    var data  = Magento.api.getProducts();

    Logger.log(data)

}

function test_updateProduct() {

    var data  = Magento.api.updateProduct();

    Logger.log(data)

}

function test_createProduct() {
    var product = {
        'type_id': 'simple',
        'attribute_set_id': 4,
        'sku': 'simple' + getGUID(),
        'weight': 1,
        'status': 1,
        'visibility': 4,
        'name': 'Simple Product',
        'description': 'Simple Description',
        'short_description': 'Simple Short Description',
        'price': 99.95,
        'tax_class_id': 0,
    };

    var data  = Magento.api.createProduct(1, product);

    Logger.log(data)

}

