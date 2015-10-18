# apps-script-magento
Use Magento REST API in your Google Sheet/Document via Google Apps Script


If you are getting the error "The state token is invalid or has expired. Please try again."

Increase size of the callback_url columns in magento

    ALTER TABLE oauth_consumer MODIFY callback_url VARCHAR(512);
    ALTER TABLE oauth_consumer MODIFY rejected_callback_url VARCHAR(512);
    ALTER TABLE oauth_token MODIFY callback_url VARCHAR(512);

http://blog.kupriyanov.com/2015/10/solved-state-token-is-invalid-or-has.html


* Add oAuth1 library Mb2Vpd5nfD3Pz-_a-39Q4VfxhMjh3Sh48