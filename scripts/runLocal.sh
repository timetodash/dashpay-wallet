#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC='access glad stomach deal tray entire mean grunt boy shoot want shrimp'

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

export VUE_APP_AUTOFAUCET="http://127.0.0.1:5050/drip/"
export VUE_APP_DASHPAY_CONTRACT_ID=$VUE_APP_DASHPAY_CONTRACT_ID_local

# export VUE_APP_DASHPAY_CONTRACT_ID=7P4yfdKrUGMAi57qKJY1u73S46smJmpkEE4NYB4NPn1T
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=7i1oV36vFcgc69gUhKzozY7onayxYBMWR48k2RHmmGyx
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=GiWebDkkUTHp4ShRYTqE87EEi8Z9XYp5uhntXdCHTcC5

# export VUE_APP_DASHPAY_CONTRACT_ID=68vZr6rYvbuo6ZaDRRDZgbKxErNkq7nPnCnRnv5uFqxq
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=EtJETkMTHctvcdHedMxLpWnM6QFLHpY4EjmQZsnRYQDE
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=G452CaHVfx4D2dwgXik1PsFNkD2Weqvy15SGgzva1D9a

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve