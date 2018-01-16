import { observable, action, computed } from 'mobx'
import { axios } from '~/utils/'

class State {
  @observable _clusters = []
  @observable clusters_loading = false
  @observable _apps = new Map()

  @observable _images = new Map()
  @observable images_loading = false

  constructor(root) {
    this.root = root
    setTimeout(() => {
      this.loadImages()
      this.loadClusters()
    }, 1000)
  }

  @action
  load = async (url, method, data = {}) => {
    const token = this.root.auth.token
    console.log('xxx', token)
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
  loadClusters = async () => {
    this.clusters_loading = true
    try {
      const { data } = await this.load('/api/docker/clusters', 'get')
      this._clusters = data
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
  loadApps = async name => {
    try {
      const { data } = await axios.get(`/api/docker/clusters/${name}`)
      this._apps.set(name, data)
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
  loadImages = async () => {
    this.images_loading = true
    try {
      const { data } = await this.load(
        '/api/docker/images?limit=100&offset=0',
        'get'
      )
      this._images = data
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
}

export default State
