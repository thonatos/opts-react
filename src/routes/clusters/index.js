import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Basic as Layout } from '~/layouts/'

import { ClusterTable } from './components/'

@inject('docker', 'app')
@observer
class Clusters extends Component {
  componentDidMount() {
    const { docker } = this.props
    docker.loadClusters()
  }

  load = (current, pageSize) => {
    const { docker } = this.props
    docker.loadClusters(current, pageSize)
  }

  render() {
    const { app, docker } = this.props
    const {
      clusters,
      clusters_loading,
      clusters_count,
      clusters_current,
      clusters_size,
    } = docker
    const { langs } = app

    return (
      <Layout title="Clusters">
        <ClusterTable
          {...{
            title: 'docker_cluster',
            data: clusters,
            loading: clusters_loading,
            pagination: {
              pageSize: clusters_size,
              total: clusters_count,
              current: clusters_current,
            },
            load: this.load,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Clusters
