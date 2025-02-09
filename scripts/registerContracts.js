/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')
const Dash = require('dash')
const glob = require('glob')

const envRun = process.env.VUE_APP_ENV_RUN

// console.dir(process.env, {depth:100})

let clientOpts = {
  // network: 'testnet',
  // retries: 9999,
  // passFakeAssetLockProofForTests: process.env.NUXT_LOCALNODE,
  // unsafeOptions: {
  // skipSynchronizationBeforeHeight: 415000, // only sync from start of 2021
  // skipSynchronizationBeforeHeight: 510490,
  // },

  wallet: {
    // privateKey: 'currently throws a signing error'
    mnemonic: process.env.VUE_APP_MNEMONIC,
  },

  dapiAddresses: process.env.VUE_APP_DAPIADDRESSES
    ? JSON.parse(process.env.VUE_APP_DAPIADDRESSES)
    : undefined,
}

// Remove undefined keys from object
clientOpts = JSON.parse(JSON.stringify(clientOpts))

console.log('clientOpts :>> ', clientOpts)

let client, platform, identityId, identity

let registeredContracts = {}

try {
  registeredContracts = require(`../env/registeredContracts_${envRun}.json`)
} catch (e) {
  console.log(
    `\n./env/registeredContracts_${envRun}.json not found, will create file ..\n`
  )
}

const initWalletAndIdentity = async () => {
  if (!client) client = new Dash.Client(clientOpts)

  if (!platform) platform = client.platform

  if (!client.account) {
    const startWalletSync = Date.now()

    console.log('.. initializing wallet')

    client.account = await client.getWalletAccount()

    const walletTime = Math.floor((Date.now() - startWalletSync) / 1000)

    console.log(`.. finished wallet sync in ${walletTime}s`)

    console.log(
      '\nReceiving address for wallet:\n',
      client.account.getUnusedAddress().address,
      '\n'
    )
  }

  if (!identityId)
    identityId =
      client.account.identities.getIdentityIds()[0] ||
      (await platform.identities.register()).id.toString()

  if (!identity) identity = await platform.identities.get(identityId)
}

const registerContract = async (contractDocuments) => {
  const contract = await platform.contracts.create(contractDocuments, identity)

  return platform.contracts.broadcast(contract, identity)
}

;(async () => {
  try {
    const contractUrls = glob.sync('./schema/*CONTRACT.json')

    const contractUrlswithHash = contractUrls.map((x) => [
      x,
      crypto
        .createHash('sha256')
        .update(JSON.stringify(require(`../${x}`)))
        .digest('hex'),
    ])

    // Check if there is a new contract, otherwise skip slow wallet initialization
    for (let idx = 0; idx < contractUrlswithHash.length; idx++) {
      const hash = contractUrlswithHash[idx][1]

      if (!(hash in registeredContracts)) {
        console.log('Found new contracts to register ..')
        await initWalletAndIdentity()
        break
      }
    }

    // Register new contracts in parallel, if now new contracts exists returns old contracts
    const newRegisteredContractIdsPromises = contractUrlswithHash.map(
      ([url, hash]) => {
        if (hash in registeredContracts) {
          return registeredContracts[hash].id
        } else {
          return registerContract(require(`../${url}`))
        }
      }
    )

    const newRegisteredContractIdsResults = await Promise.all(
      newRegisteredContractIdsPromises
    )

    const newRegisteredContractIds = newRegisteredContractIdsResults.map(
      (id, idx) => {
        if (typeof id === 'string') {
          return id
        } else {
          const newId = id.dataContract.id.toString()

          const contractName = path.basename(
            contractUrlswithHash[idx][0],
            '.json'
          )

          console.log(
            'Registered new contract: ',
            `${contractName}_${envRun}`,
            newId
          )

          if (contractName === 'JEMBE_CONTRACT') {
            try {
              fs.appendFileSync(
                `/home/${process.env.USER}/.evoenv`,
                `\nexport VUE_APP_${contractName}_ID_${envRun}=${newId}\n`
              )

              console.log(
                '-> Appended',
                `${contractName}_${envRun}`,
                'to ~/.evoenv'
              )
            } catch (e) {
              console.log(e)
              console.log(
                `Add the ${contractName} to your environment variables manually to share it with other dApps..`
              )
            }
          }

          return newId
        }
      }
    )

    const newRegisteredContracts = {}
    newRegisteredContractIds.forEach((id, idx) => {
      const [url, hash] = contractUrlswithHash[idx]
      newRegisteredContracts[hash] = { url, id }
    })

    fs.writeFileSync(
      `./env/registeredContracts_${envRun}.json`,
      JSON.stringify(newRegisteredContracts)
    )

    console.log(`\nContractIds for '${envRun}':\n`)
    let envVarString = ''
    Object.keys(newRegisteredContracts).forEach((hash) => {
      const { url, id } = newRegisteredContracts[hash]
      envVarString += `export VUE_APP_${path.basename(
        url,
        '.json'
      )}_ID_${envRun}=${id}\n`
      console.log(
        `export VUE_APP_${path.basename(url, '.json')}_ID_${envRun}=${id}`
      )
    })

    fs.writeFileSync(`./env/datacontracts_${envRun}.env`, envVarString)
  } catch (e) {
    console.dir(e)
  } finally {
    if (client) client.disconnect()
  }
})()
