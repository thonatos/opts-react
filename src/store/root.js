import { create } from 'mobx-persist'
import * as stores from './'

class root {
  constructor() {
    // init
    const keys = Object.keys(stores)
    keys.forEach(key => {
      const _key = key.toLocaleLowerCase()
      const _fun = stores[key]
      this[_key] = new _fun(this)
    })

    // persist
    const { app, auth } = this
    console.log(app, auth)
    const hydrate = create({
      // storage: localforage,
      // debounce: 100,
    })
    hydrate('app', app).then(() => console.log('app hydrated'))
    hydrate('auth', auth).then(() => console.log('auth hydrated'))
  }
}

export default root
