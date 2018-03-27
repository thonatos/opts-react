import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'

import { Basic as Layout } from '~/layouts/'
import { TagTable } from './components/'

@inject('container', 'app')
@observer
class ImageTag extends Component {
  componentDidMount() {
    this.load()
  }

  load = current => {
    const { container, match } = this.props
    const id = match.params.id
    container.index('images', {
      id,
      storage: 'image_tags',
      pageNext: current,
    })
  }

  render() {
    const { container, app } = this.props
    const { langs } = app
    const {
      loading,
      image_tags: data,
      image_tags_total: total,
      image_tags_page: current,
      image_tags_limit: pageSize,
    } = container

    return (
      <Layout title="Image Tags">
        <TagTable
          {...{
            title: 'container_image_tag',
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

export default ImageTag
