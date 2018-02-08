import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { TagTable } from './components/'

@inject('docker', 'app')
@observer
class Cluster extends Component {
  componentDidMount() {
    this.load()
  }

  load = current => {
    const { docker, match } = this.props
    const id = match.params.id
    docker.loadImageTags(id, current)
  }

  render() {
    const { docker, app } = this.props
    const { langs } = app
    const {
      image_tags: data,
      image_tags_loading: loading,
      image_tags_total: total,
      image_tags_page: current,
      image_tags_limit: pageSize,
    } = docker

    return (
      <Layout title="Image Tags">
        <TagTable
          {...{
            title: 'docker_image_tag',
            load: this.load,
            langs,
            data,
            loading,
            pagination: {
              total,
              current,
              pageSize,
            },
          }}
        />
      </Layout>
    )
  }
}

export default Cluster
