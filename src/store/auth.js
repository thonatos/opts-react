import { observable, computed, action, autorun } from 'mobx'
import { persist } from 'mobx-persist'
import { axios } from '~/utils/'

class State {
  @persist
  @observable
  token = ''

  @persist
  @observable
  username = ''

  @persist
  @observable
  userrole = ''

  constructor(root) {
    this.root = root
    autorun(() => {})
  }

  @computed
  get authed() {
    return this.token ? true : false
  }

  @action
  login = async (username, password) => {
    try {
      const { data } = await axios.post('/auth/jwt/sign', {
        username,
        password,
      })
      const { token, info } = data
      this.token = token
      this.userrole = info.userrole
      this.username = info.username
    } catch (error) {
      console.log(error)
    }
  }

  @action
  logout = () => {
    this.token = ''
    this.username = ''
    this.userrole = ''
  }
}

export default State
