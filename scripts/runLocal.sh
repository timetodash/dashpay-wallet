#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC='knock sustain rebuild hurt aunt hospital you dynamic iron mean dream sword'

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve