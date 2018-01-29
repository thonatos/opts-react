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

  // clusters

  @computed
  get clusters() {
    return toJS(this._clusters)
  }

  @action
  loadClusters = async (offset = 1, limit = 100) => {
    this.clusters_loading = true
    try {
      const { data: res } = await this.request(
        `/api/docker/clusters?limit=${limit}&offset=${offset - 1}`,
        'get'
      )
      const { data, meta } = res
      this._clusters = data
      this.clusters_count = meta.total
      this.clusters_current = meta.offset
    } catch (error) {
    } finally {
      this.clusters_loading = false
    }
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

  @action
  loadImages = async (offset = 1, limit = 100) => {
    this.images_loading = true
    try {
      const { data: res } = await this.request(
        `/api/docker/images?limit=${limit}&offset=${offset - 1}`,
        'get'
      )

      const { data, meta } = res
      this._images = data
      this.images_count = meta.total
      this.images_current = meta.offset
    } catch (error) {
    } finally {
      this.images_loading = false
    }
  }

  // deploys
  @computed
  get deploys() {
    return toJS(this._deploys)
  }

  @action
  loadDeploys = async (offset = 1, limit = 100) => {
    this.deploys_loading = true
    try {
      const { data: res } = await this.request(
        `/api/docker/deploys?limit=${limit}&offset=${offset - 1}`,
        'get'
      )

      const { data, meta } = res
      this._deploys = data
      this.deploys_count = meta.total
      this.deploys_current = meta.offset
    } catch (error) {
    } finally {
      this.deploys_loading = false
    }
  }

  @action
  createOrUpdateDeploy = async ({
    id,
    app,
    cluster,
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
