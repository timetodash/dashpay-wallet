#!/usr/bin/env bash
source ~/.evoenv
source ./env/datacontracts_local.env

unset VUE_APP_DASHPAY_WALLET_CONTRACT_ID_testnet
unset VUE_APP_DASHPAY_WALLET_CONTRACT_ID_build_testnet

export VUE_APP_DASHPAY_CONTRACT_ID=$VUE_APP_DASHPAY_CONTRACT_ID_local

node scripts/generateTestData.js