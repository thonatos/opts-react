import { observable, action, computed, toJS } from 'mobx'
import { axios } from '~/utils/'

const getStorageProps = store => {
  return ['', 'page', 'total', 'limit'].map(
    key => (key ? `${store}_${key}` : `_${store}`)
  )
}

class State {
  @observable loading = false

  @observable _docker = []
  @observable docker_total = 0
  @observable docker_page = 1
  @observable docker_limit = 2

  @observable _kubernetes = []
  @observable kubernetes_total = 0
  @observable kubernetes_page = 1
  @observable kubernetes_limit = 5

  @observable _images = []
  @observable images_total = 0
  @observable images_page = 1
  @observable images_limit = 10

  @observable _deploys = []
  @observable deploys_total = 0
  @observable deploys_page = 1
  @observable deploys_limit = 10

  @observable _image_tags = []
  @observable image_tags_total = 0
  @observable image_tags_page = 1
  @observable image_tags_limit = 10

  @observable _images_search = []
  @observable _docker_search = []
  @observable _kubernetes_search = []

  @observable _apps = new Map()

  constructor(root) {
    this.root = root
  }

  // method

  request = async (url, method, data = {}) => {
    const token = this.root.auth.token
    return axios({
      method,
      url,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
  }

  load = async (url, { id, store }) => {
    try {
      const { data } = await this.request(url, 'get')
      this[`_${store}`].set(id, data)
    } catch (error) {}
  }

  paginate = async (url, { store, pageNext = 1 }) => {
    if (!url || !store || this.loading) return

    // props
    const [
      storage,
      storage_page,
      storage_total,
      storage_limit,
    ] = getStorageProps(store)

    // values
    const limit = this[storage_limit]

    this.loading = true
    try {
      const response = await this.request(
        `${url}?limit=${limit}&page=${pageNext}`,
        'get'
      )
      const { data, meta } = response.data
      this[storage] = data
      this[storage_page] = meta.page
      this[storage_total] = meta.total
    } catch (error) {
    } finally {
      this.loading = false
    }
  }

  // action

  @action
  index = async (store, options) => {
    let url = `/api/container/${store}`
    const { id, storage, pagination = true } = options

    if (id) {
      url += `/${id}`
    }

    if (!pagination) {
      return this.load(url, {
        store: storage || store,
        ...options,
      })
    }

    return this.paginate(url, {
      store: storage || store,
      ...options,
    })
  }

  @action
  create = async (store, options) => {
    try {
      const { data } = await this.request(
        `/api/container/${store}`,
        'post',
        options
      )
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  @action
  update = async (store, { id, ...rest }) => {
    let url = `/api/container/${store}`
    let method = 'post'

    if (id) {
      url += `/${id}`
      method = 'put'
    }

    try {
      const { data } = await this.request(url, method, rest)
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  @action
  destroy = async (store, id) => {
    try {
      const { data } = await this.request(
        `/api/container/${store}/${id}`,
        'delete'
      )
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  @action
  search = async (store, name) => {
    const { data } = await this.request(
      `/api/container/${store}?s=${name}`,
      'get'
    )
    this[`_${store}_search`] = data.data || []
  }

  // Computed

  @computed
  get docker() {
    return toJS(this._docker)
  }

  @computed
  get kubernetes() {
    return toJS(this._kubernetes)
  }

  @computed
  get apps() {
    const keys = this._apps.keys()
    const _apps = {}
    keys.forEach(k => {
      const apps = this._apps.get(k)
      _apps[k] = toJS(apps)
    })
    return _apps
  }

  @computed
  get images() {
    return toJS(this._images)
  }

  @computed
  get image_tags() {
    return toJS(this._image_tags)
  }

  @computed
  get deploys() {
    return toJS(this._deploys)
  }

  @computed
  get docker_search() {
    return toJS(this._docker_search)
  }

  @computed
  get kubernetes_search() {
    return toJS(this._kubernetes_search)
  }

  @computed
  get images_search() {
    return toJS(this._images_search)
  }
}

export default State
