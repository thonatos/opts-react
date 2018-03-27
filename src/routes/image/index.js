import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { ImageTable } from './components/'

@inject('app', 'container')
@observer
class Image extends Component {
  componentDidMount() {
    this.load()
  }

  load = current => {
    this.props.container.index('images', {
      pageNext: current,
    })
  }

  render() {
    const { app, container } = this.props
    const {
      loading,
      images: data,
      images_total: total,
      images_page: current,
      images_limit: pageSize,
    } = container
    const { langs } = app

    return (
      <Layout title="Images">
        <ImageTable
          {...{
            title: 'container_image',
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

export default Image
