import { observable, action, computed, toJS } from 'mobx'
import { axios } from '~/utils/'

class State {
  @observable _clusters = []
  @observable clusters_total = 0
  @observable clusters_page = 1
  @observable clusters_limit = 5
  @observable clusters_loading = false

  @observable _images = []
  @observable images_total = 0
  @observable images_page = 1
  @observable images_limit = 10
  @observable images_loading = false

  @observable _deploys = []
  @observable deploys_total = 0
  @observable deploys_page = 1
  @observable deploys_limit = 10
  @observable deploys_loading = false

  @observable _image_tags = []
  @observable image_tags_total = 0
  @observable image_tags_page = 1
  @observable image_tags_limit = 10
  @observable image_tags_loading = false

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

  requestWithPagination = async (pageNext = 1, options = {}) => {
    const { store, url } = options
    if (!store) {
      return
    }

    // props
    const storage = `_${store}`
    const loading = `${store}_loading`
    const page = `${store}_page`
    const total = `${store}_total`
    const limit = `${store}_limit`

    // values
    const _limit = this[limit]

    if (this[loading]) {
      return
    }

    this[loading] = true
    try {
      const { data: res } = await this.request(
        `${url}?limit=${_limit}&page=${pageNext}`,
        'get'
      )
      const { data, meta } = res
      this[storage] = data
      this[page] = meta.page
      this[total] = meta.total
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
  createOrUpdateDeploy = async dep => {
    try {
      let url = '/api/docker/deploys'
      let method = 'post'
      if (dep.id) {
        url = url + `/${dep.id}`
        method = 'put'
      }
      const { data } = await this.request(url, method, dep)
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

  @computed
  get image_tags() {
    return toJS(this._image_tags)
  }

  @action
  loadImageTags = async (id, ...args) => {
    const opt = {
      store: 'image_tags',
      url: `/api/docker/images/${id}`,
    }
    return this.requestWithPagination(...args, opt)
  }
}

export default State
