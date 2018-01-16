import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { ImageTable } from './components/'

@inject('app', 'docker')
@observer
class Images extends Component {
  render() {
    const { images, images_loading } = this.props.docker
    const { langs } = this.props.app
    return (
      <Layout title="Images">
        <ImageTable
          {...{
            title: 'docker_image',
            data: images,
            loading: images_loading,
            langs,
          }}
        />
      </Layout>
    )
  }
}

export default Images
