import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { AppTable } from './components/'

@inject('container', 'app')
@observer
class ClusterDetail extends Component {
  componentDidMount() {
    const { container, match } = this.props
    const id = match.params.id
    container.index('docker', {
      id,
      storage: 'apps',
      pagination: false,
    })
  }

  render() {
    const { container, match, app } = this.props
    const { langs } = app
    const { id } = match.params
    console.log(container.apps)
    const apps = container.apps[id] || []

    return (
      <Layout title="Docker Apps">
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

export default ClusterDetail
