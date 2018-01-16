import axios from 'axios'
import { api_server } from '~/constants/'

axios.defaults.baseURL = api_server

export { axios }
