#!/usr/bin/env bash
source ~/.evoenv

export VUE_APP_ENV_RUN="local"

# export VUE_APP_USERMNEMONIC='together tail kingdom daughter sight airport vivid uphold nothing ball lazy panther'
export VUE_APP_USERMNEMONIC='access glad stomach deal tray entire mean grunt boy shoot want shrimp'
# export VUE_APP_USERMNEMONIC='fence inside rabbit enroll fruit carbon angry spell knee toss suspect accident'

node ./scripts/registerContracts.js

source ./env/datacontracts_$VUE_APP_ENV_RUN.env

export VUE_APP_AUTOFAUCET="http://127.0.0.1:5050/drip/"
export VUE_APP_DASHPAY_CONTRACT_ID=$VUE_APP_DASHPAY_CONTRACT_ID_local

# export VUE_APP_DASHPAY_CONTRACT_ID=Epf5dSJ9UZHp2ZrVta9z1C4KDAjzg1r6P8eULgzgHEeH
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=2S6nPQer6uf7cnW1HL4RicCf8S7zu2mejumcb9vp31tt
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=AvZigDWQhmK3G1DG491aws2nKrFk6nMVGzTn6f4iGqn5

# export VUE_APP_DASHPAY_CONTRACT_ID=9dQz3maz41R8gW8VoDPAo1iUByoxCBUVbt6ntQjxdqyv
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=46SVfU8rAuQJ3t1yqb8BhzHjjbjJ3ofQzeSWCp8Xro94
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID=39oMvQnhKJdeKeBYBcGHEhcaGdc53fJGwjQJfn8E7cyi

# export VUE_APP_DASHPAY_CONTRACT_ID=C9vjcVuJPapLDSzjHq2gKgJi9dyCovuF9sY3s2xHbJtd
# export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=8sg5DHdh8P3UBHXuDrJ4eLyPBp3LSLTZ436f4VFQxUVS
# export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID_local=DeqjKu3W7uEgwsCDLcQuCDroEMPU2E3prgPH4ES4WUom

export VUE_APP_DASHPAY_CONTRACT_ID=tPYSusdGKMVvNrF2bL2HJnsybwVunZrsXMmjykgU3RS
export VUE_APP_DASHPAY_WALLET_CONTRACT_ID_local=66zwGrh1nmRUXS4WoDpGrfUTvqjQmLT5baHr5jdNNZWb
export VUE_APP_DASHPAY_WALLET_ENCRYPTED_CONTRACT_ID=CQfDn45TWmhE6qYGwR3kDAmi7omL3Ai9jr61cRMfgULN


echo
echo "ENV VARS"
echo
printenv | grep VUE_APP
echo

ionic serve