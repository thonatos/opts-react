import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { ImageTable } from './components/'

@inject('app', 'docker')
@observer
class Images extends Component {
  componentDidMount() {
    this.load()
  }

  load = (current, pageSize) => {
    const { docker } = this.props
    docker.loadImages(current, pageSize)
  }

  render() {
    const { app, docker } = this.props
    const {
      images,
      images_loading,
      images_count,
      images_current,
      images_size,
    } = docker
    const { langs } = app

    return (
      <Layout title="Images">
        <ImageTable
          {...{
            title: 'docker_image',
            data: images,
            loading: images_loading,
            pagination: {
              pageSize: images_size,
              total: images_count,
              current: images_current,
            },
            load: this.load,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Images
