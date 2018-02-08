import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { AppTable } from './components/'

@inject('docker', 'app')
@observer
class Cluster extends Component {
  componentDidMount() {
    const { docker, match } = this.props
    const id = match.params.id
    docker.loadApps(id)
  }

  render() {
    const { docker, match, app } = this.props
    const { langs } = app
    const { id } = match.params
    const apps = docker.apps[id] || []

    return (
      <Layout title="Clusters">
        <AppTable
          {...{
            title: 'cluster_apps',
            data: apps,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Cluster
