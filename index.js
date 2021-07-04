// import {serverStatus} from "wallet"

const wallet = require('./wallet')
const identity = require('./identity')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cron = require('node-cron');
const { VerifiableCredential, Document, checkCredential } = require('@iota/identity-wasm/node')

const { CLIENT_CONFIG } = require('./iota_config')

const port = 6000

const address = "19ew6Q7Bcb6VXJK2Bdi1iwa48Dn7jqDKW1oK5Pxiukoj3"


const main = async function () {

    const low = require('lowdb')
    const FileSync = require('lowdb/adapters/FileSync')

    const adapter = new FileSync('db.json')
    const db = low(adapter)
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ agent: {} })
        .write()

    agent = db.get('agent')
        .value()
    // check agent
    if (Object.keys(agent).length === 0 && agent.constructor === Object) {
        console.log("agent not found...")
        console.log("creating new agent")
        identity.createIdentity().then((id) => {
            agent = id
            db.set('agent', agent)
                .write()
            console.log("agent created!")
        });
    } else {
        console.log("agent found")
        // create agent
        console.log("agent: ", agent)
    }

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
        // Schedule tasks to be run on the server.

        cron.schedule('*/30 * * * * *', function () {

            console.log('running a task every 30 seconds');

            let color = "6ZJKqM49Wk2c77tjffdX1wBCNTkrRqdWaaDFGCLt2Acz"
            let address = "1GFWAZXSNCwxL8dqMAPrLLRmKCvbA24CwENMVNCYVWfJr"
            wallet.sendAsset(color, address).then(res => {
                console.log('sendAsset done', res);
            })
        });

    })

}

main()