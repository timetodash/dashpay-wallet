#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC='together tail kingdom daughter sight airport vivid uphold nothing ball lazy panther'
# export VUE_APP_USERMNEMONIC='then creek just viable vivid alcohol bitter diet globe accuse term hard'
# export VUE_APP_USERMNEMONIC='present invite someone moon circle blossom wage awesome success suffer service fire'

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

export VUE_APP_DASHPAY_CONTRACT_ID=$VUE_APP_DASHPAY_CONTRACT_ID_local

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve