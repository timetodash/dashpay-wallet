#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

export VUE_APP_USERMNEMONIC='now tourist leopard scorpion inside nation bitter click wide razor say drastic'
# export VUE_APP_USERMNEMONIC='vibrant couple breeze someone input march sample fix oblige enact humor main'
#export VUE_APP_USERMNEMONIC='space own kidney diary top vivid unable mango sun sweet flavor skull'
# export VUE_APP_USERMNEMONIC='power half now follow slot favorite give arm initial cruise hunt brave'



node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

export VUE_APP_AUTOFAUCET="http://127.0.0.1:5050/drip/"
export VUE_APP_DASHPAY_CONTRACT_ID=$VUE_APP_DASHPAY_CONTRACT_ID_local

# export VUE_APP_DASHPAY_CONTRACT_ID=5omTArf5o24uA6EaV1Zg9JmLcizpQcii2L7Yn1Nob2yf
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=4VvCmem5vGehCdt96A6A49bSoX1pDdmWPu7yopJc1NPd
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=ySrdhG8ks6kH9zdTwnWCoAUVWRoi5c3RZubP5agzRN8

# export VUE_APP_DASHPAY_CONTRACT_ID=Gx4YJdNaaZpngLN8DNmnMeUVnLXANc1EEQ2a57f5REVQ
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=6REyCVjzZ5DZmtebY79BcQfxtozJiisChRYfWckguqDi
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=3H6jN5WB1ARBNreu3j2gpNLZLQAfV8xa4CVJxobPAU9w

# export VUE_APP_DASHPAY_CONTRACT_ID=2xHACX3z5vgWruP54TDLxN9Y9zNiyz3DoqcfGsMeop95
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=GrLEthhVGZV3834pR6yASBi2oWxAmCfwZQp3eoPUwVDV
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=BsngBnUyNJXXFNJevcNh8zUrWVs6wtescqY4tmGmqTR6

echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve