require('dotenv').config();

import axios from 'axios';

const client = axios.create({
  baseURL: process.env.FMP_API_URL,
  headers: {
    'content-type': 'application/json',
  },
  params: {
    apikey: process.env.FMP_API_TOKEN
  }
});

export default client;