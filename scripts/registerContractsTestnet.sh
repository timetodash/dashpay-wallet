#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="testnet"
# export VUE_APP_MNEMONIC="wish benefit love market wrap soldier weird super elephant settle main people"

pwd
rm env/registeredContracts_testnet.json


node ./scripts/registerContracts.js