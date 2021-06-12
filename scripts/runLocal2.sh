#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC='now tourist leopard scorpion inside nation bitter click wide razor say drastic'

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve