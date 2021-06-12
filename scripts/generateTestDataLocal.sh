#!/usr/bin/env bash
source ~/.evoenv
source ./env/datacontracts_local.env

unset VUE_APP_DASHPAY_WALLET_CONTRACT_ID_testnet
unset VUE_APP_DASHPAY_WALLET_CONTRACT_ID_build_testnet

node scripts/generateTestData.js