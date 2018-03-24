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
    })
  }

  @action
  update(data = {}) {
    const { token = '', username = '', userrole = '' } = data
    this.token = token
    this.username = username
    this.userrole = userrole
  }

  @action
  login = async (username, password) => {
    try {
      const { data } = await axios.post('/auth/jwt/sign', {
        username,
        password,
      })
      const { token, info } = data
      this.update({
        token,
        ...info,
      })
    } catch (error) {
      console.log(error)
    }
  }

  @action
  logout = () => {
    this.update()
  }
}

export default State
