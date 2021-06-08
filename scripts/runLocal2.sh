#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC="proud group frequent erase retire approve produce race wealth picnic alert pear"

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve