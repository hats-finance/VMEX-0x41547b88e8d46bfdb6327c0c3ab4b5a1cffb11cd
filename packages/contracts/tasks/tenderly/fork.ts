import * as dotenv from "dotenv"
import axios from 'axios';

dotenv.config(); // load environment variables using dotenv
const { TENDERLY_USERNAME, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env;

const TENDERLY_FORK_API = `https://api.tenderly.co/api/v1/account/${TENDERLY_USERNAME}/project/${TENDERLY_PROJECT}/fork`

// set up your access-key, if you don't have one or you want to generate new one follow next link
// https://dashboard.tenderly.co/account/authorization
const opts = {
      headers: {
          'X-Access-Key': TENDERLY_ACCESS_KEY as string,
    }
  }

const body = {
  "network_id": "1",
  "block_number": 16172821,
}

axios.post(TENDERLY_FORK_API, body, opts)
    .then(res => {
        console.log(`Forked with fork ID ${res.data.simulation_fork.id}. Check the Dashboard!`);
    }).catch(err => console.error(err))