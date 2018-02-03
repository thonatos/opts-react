import { observable, action, autorun } from 'mobx'
import { persist } from 'mobx-persist'
import { axios } from '~/utils/'
import { Base64 } from 'js-base64'

const isAuthed = token => {
  if (!token) return false
  const { exp } = JSON.parse(Base64.decode(token.split('.')[1] || '{}'))
  return exp - Date.now() / 1000 > 0
}
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
    autorun(async () => {
      this.authed = isAuthed(this.token)
      if (this.authed) {
        await this.root.docker.preload()
      }
    })
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
