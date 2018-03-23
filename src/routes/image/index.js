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

  load = current => {
    const { docker } = this.props
    docker.index('images', {
      pageNext: current,
    })
  }

  render() {
    const { app, docker } = this.props
    const {
      loading,
      images: data,
      images_total: total,
      images_page: current,
      images_limit: pageSize,
    } = docker
    const { langs } = app

    return (
      <Layout title="Images">
        <ImageTable
          {...{
            title: 'docker_image',
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

export default Images
