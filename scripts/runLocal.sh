#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC="flavor alien feature laugh pen way six pitch nuclear eagle ticket art"

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve