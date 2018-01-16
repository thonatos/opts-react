import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Basic as Layout } from '~/layouts/'

import { ClusterTable } from './components/'

@inject('docker', 'app')
@observer
class Clusters extends Component {
  render() {
    const { clusters, clusters_loading } = this.props.docker
    const { langs } = this.props.app

    return (
      <Layout title="Clusters">
        <ClusterTable
          {...{
            title: 'docker_cluster',
            data: clusters,
            loading: clusters_loading,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Clusters
