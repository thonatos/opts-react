import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Basic as Layout } from '~/layouts/'

import { DeployTable } from './components/'

@inject('docker', 'app')
@observer
class Deploys extends Component {
  componentDidMount() {
    const { docker } = this.props
    docker.loadDeploys()
  }

  load = (current, pageSize) => {
    const { docker } = this.props
    docker.loadDeploys(current, pageSize)
  }

  render() {
    const { app, docker } = this.props
    const {
      deploys,
      deploys_loading,
      deploys_count,
      deploys_current,
      deploys_size,
      images,
    } = docker
    const { langs } = app

    return (
      <Layout title="Deploys">
        <DeployTable
          {...{
            title: 'docker_deploys',
            deploys,
            images,
            loading: deploys_loading,
            pagination: {
              pageSize: deploys_size,
              total: deploys_count,
              current: deploys_current,
            },
            load: this.load,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Deploys
