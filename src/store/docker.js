import { observable, action, computed } from 'mobx'
import { axios } from '~/utils/'

class State {
  @observable _clusters = []
  @observable clusters_count = 0
  @observable clusters_current = 1
  @observable clusters_size = 5
  @observable clusters_loading = false

  @observable _images = new Map()
  @observable images_count = 0
  @observable images_current = 1
  @observable images_size = 5
  @observable images_loading = false

  @observable _deploys = new Map()
  @observable deploys_count = 0
  @observable deploys_current = 1
  @observable deploys_size = 5
  @observable deploys_loading = false

  @observable _apps = new Map()

  constructor(root) {
    this.root = root
  }

  load = async (url, method, data = {}) => {
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

  @action
  loadClusters = async (offset = 1, limit = 100) => {
    this.clusters_loading = true
    try {
      const { data } = await this.load(
        `/api/docker/clusters?limit=${limit}&offset=${offset - 1}`,
        'get'
      )
      const { count, rows } = data
      this._clusters = rows
      this.clusters_count = count
      this.clusters_current = offset
    } catch (error) {
    } finally {
      this.clusters_loading = false
    }
  }

  @computed
  get clusters() {
    const _clusters = this._clusters
    return _clusters.length > 0 ? _clusters.peek() : []
  }

  @action
  loadApps = async id => {
    try {
      const { data } = await this.load(`/api/docker/clusters/${id}`, 'get')
      this._apps.set(id, data)
    } catch (error) {
    } finally {
    }
  }

  @computed
  get apps() {
    const keys = this._apps.keys()
    const _apps = {}
    keys.forEach(k => {
      const apps = this._apps.get(k)
      _apps[k] = apps.length > 0 ? apps.peek() : []
    })
    return _apps
  }

  @action
  loadImages = async (offset = 1, limit = 100) => {
    this.images_loading = true
    try {
      const { data } = await this.load(
        `/api/docker/images?limit=${limit}&offset=${offset - 1}`,
        'get'
      )

      const { count, rows } = data
      this._images = rows
      this.images_count = count
      this.images_current = offset
    } catch (error) {
    } finally {
      this.images_loading = false
    }
  }

  @computed
  get images() {
    const _images = this._images
    return _images.length > 0 ? _images.peek() : []
  }

  @action
  loadDeploys = async (offset = 1, limit = 100) => {
    this.deploys_loading = true
    try {
      const { data } = await this.load(
        `/api/docker/deploys?limit=${limit}&offset=${offset - 1}`,
        'get'
      )

      const { count, rows } = data
      this._deploys = rows
      this.deploys_count = count
      this.deploys_current = offset
    } catch (error) {
    } finally {
      this.deploys_loading = false
    }
  }

  @computed
  get deploys() {
    const _deploys = this._deploys
    return _deploys.length > 0 ? _deploys.peek() : []
  }
}

export default State
