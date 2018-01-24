import { observable, action, autorun } from 'mobx'
import { persist } from 'mobx-persist'
import { axios } from '~/utils/'
import { Base64 } from 'js-base64'

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

  @observable authed = false

  constructor(root) {
    this.root = root
    autorun(() => {
      // detect auth status
      this.authed = this.isAuthed()
    })
  }

  isAuthed = () => {
    if (!this.token) return false
    const { exp } = JSON.parse(Base64.decode(this.token.split('.')[1] || '{}'))
    return exp - Date.now() / 1000 > 0
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
