import { observable, action, computed, toJS } from 'mobx'
import { axios } from '~/utils/'

class State {
  @observable _clusters = []
  @observable clusters_count = 0
  @observable clusters_current = 1
  @observable clusters_size = 5
  @observable clusters_loading = false

  @observable _images = []
  @observable images_count = 0
  @observable images_current = 1
  @observable images_size = 5
  @observable images_loading = false

  @observable _deploys = []
  @observable deploys_count = 0
  @observable deploys_current = 1
  @observable deploys_size = 5
  @observable deploys_loading = false

  @observable _images_search = []
  @observable _clusters_search = []

  @observable _apps = new Map()

  constructor(root) {
    this.root = root
  }

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

  requestWithPagination = async (offset = 1, limit = 100, options = {}) => {
    const { store, url } = options
    if (!store) {
      return
    }
    const storage = `_${store}`
    const loading = `${store}_loading`
    const current = `${store}_current`
    const count = `${store}_count`

    if (this[loading]) {
      return
    }

    this[loading] = true
    try {
      const { data: res } = await this.request(
        `${url}?limit=${limit}&offset=${offset - 1}`,
        'get'
      )
      const { data, meta } = res
      this[storage] = data
      this[count] = meta.total
      this[current] = meta.offset
    } catch (error) {
    } finally {
      this[loading] = false
    }
  }

  // clusters

  @computed
  get clusters() {
    return toJS(this._clusters)
  }

  @computed
  get clustersSearch() {
    return toJS(this._clusters_search)
  }

  @action
  loadClusters = async (...args) => {
    const opt = {
      store: 'clusters',
      url: '/api/docker/clusters',
    }
    return this.requestWithPagination(...args, opt)
  }

  @action
  searchClusters = async (name = '') => {
    const { data } = await this.request(`/api/docker/clusters?s=${name}`, 'get')
    this._clusters_search = data.data || []
  }

  @action
  createCluster = async values => {
    try {
      const { data } = await this.request(
        '/api/docker/clusters',
        'post',
        values
      )

      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  @action
  deleteCluster = async (id = '') => {
    try {
      const { data } = await this.request(
        `/api/docker/clusters/${id}`,
        'delete'
      )
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  // apps

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

  @action
  loadApps = async id => {
    try {
      const { data } = await this.request(`/api/docker/clusters/${id}`, 'get')
      this._apps.set(id, data)
    } catch (error) {
    } finally {
    }
  }

  // images

  @computed
  get images() {
    return toJS(this._images)
  }

  @computed
  get imagesSearch() {
    return toJS(this._images_search)
  }

  @action
  loadImages = async (...args) => {
    const opt = {
      store: 'images',
      url: '/api/docker/images',
    }
    return this.requestWithPagination(...args, opt)
  }

  @action
  searchImages = async (name = '') => {
    const { data } = await this.request(`/api/docker/images?s=${name}`, 'get')
    this._images_search = data.data || []
  }

  // deploys
  @computed
  get deploys() {
    return toJS(this._deploys)
  }

  @action
  loadDeploys = async (...args) => {
    const opt = {
      store: 'deploys',
      url: '/api/docker/deploys',
    }
    return this.requestWithPagination(...args, opt)
  }

  @action
  createOrUpdateDeploy = async ({
    id,
    app,
    cluster,
    trigger,
    enabled,
    template,
    env_array: envs,
    image_array: images,
  }) => {
    try {
      let url = '/api/docker/deploys'
      let method = 'post'
      let postData = {
        app,
        cluster,
        trigger,
        enabled,
        template,
        envs,
        images,
      }

      if (id) {
        url = url + `/${id}`
        method = 'put'
        postData = {
          ...postData,
          id,
        }
      }
      const { data } = await this.request(url, method, postData)
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }

  @action
  deleteDeploy = async (id = '') => {
    try {
      const { data } = await this.request(`/api/docker/deploys/${id}`, 'delete')
      return data
    } catch (error) {
      console.log(error)
      throw new Error('create failed.')
    }
  }
}

export default State
