#!/bin/bash

npm run build

gas deploy -s ./config/$CLIENT_SECRETS -c ./config/$OAUTH_CREDENTIALS -b ./dist -f $GAS_FILE_ID
