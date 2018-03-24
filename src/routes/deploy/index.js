import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Row, Col, Button } from 'antd'
import { Basic as Layout } from '~/layouts/'
import { DeployTable, DeployForm } from './components/'

const serialize = data => {
  // rename & remove keys
  data['images'] = data['image_array'] || []
  data['envs'] = data['env_array'] || []
  for (const name of ['env', 'image', 'env_array', 'image_array']) {
    data[name] && delete data[name]
  }

  // format
  const formatImageArray = data => {
    const prefix = 'images'
    const arr = data[prefix] || []
    const newArray = arr.map(v => {
      const [image_id, repo_full_name] = v.image.split('#')
      delete v['image']
      return {
        ...v,
        image_id,
        repo_full_name,
      }
    })
    data[prefix] = newArray
  }

  const formatTrigger = data => {
    const prefix = 'trigger'
    const [image_id, repo_full_name] = data[prefix].split('#')
    data[prefix] = {
      image_id,
      repo_full_name,
    }
  }

  const formatCluster = data => {
    const prefix = 'cluster'
    const [cluster_id, name] = data[prefix].split('#')
    data[prefix] = {
      name,
      cluster_id,
    }
  }

  formatTrigger(data)
  formatCluster(data)
  formatImageArray(data)
}

@inject('docker', 'app')
@observer
class Deploys extends Component {
  state = {
    visible: false,
    data: null,
  }

  componentDidMount() {
    this.load()
  }

  load = current => {
    const { docker } = this.props
    docker.index('deploys', {
      pageNext: current,
    })
  }

  update = values => {
    const { docker } = this.props
    return docker.update('deploys', values)
  }

  destroy = id => {
    const { docker } = this.props
    return docker.destroy('deploys', id)
  }

  // event
  onChange = (pagination, filters, sorter) => {
    const { current } = pagination
    this.load(current)
  }

  showModal = data => {
    const state = {
      visible: true,
    }
    if (data) {
      state.data = data
    }
    this.setState(state)
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCreate = async () => {
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      serialize(values)
      console.log(values)

      this.update(values)
        .then(res => {
          console.log('#res', res)
          this.setState({ visible: false, data: null }, () => {
            form.resetFields()
            this.load()
          })
        })
        .catch(err => {
          console.log('#err', err)
        })
    })
  }

  handleDelete = id => {
    this.destroy(id)
      .then(res => {
        console.log('#res', res)
        this.load()
      })
      .catch(err => {
        console.log('#err', err)
      })
  }

  handleSearch = (store, name) => {
    if (!name) {
      return
    }
    const { docker } = this.props
    const { search } = docker
    search(store, name)
  }

  saveFormRef = form => {
    this.form = form
  }

  render() {
    const { app, docker } = this.props
    const {
      images_search,
      clusters_search,
      clusters_kubernetes_search,
    } = docker
    const { langs } = app

    const {
      loading,
      deploys: data,
      deploys_limit: pageSize,
      deploys_total: total,
      deploys_page: current,
    } = docker

    return (
      <Layout title="Deploys">
        <DeployTable
          {...{
            title: () => {
              return (
                <Row gutter={16}>
                  <Col span={12}>
                    <p>{langs['docker_deploy']}</p>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <Button type="primary" onClick={this.showModal}>
                      {langs['action_create']}
                    </Button>
                  </Col>
                </Row>
              )
            },
            data,
            loading,
            pagination: {
              pageSize,
              total,
              current,
            },
            load: this.load,
            edit: this.showModal,
            destroy: this.handleDelete,
            langs,
          }}
        />

        <DeployForm
          title={langs['deploy']}
          langs={langs}
          data={this.state.data}
          images={images_search}
          clusters_swarm={clusters_search}
          clusters_kubernetes={clusters_kubernetes_search}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onSearch={this.handleSearch}
          ref={this.saveFormRef}
        />
      </Layout>
    )
  }
}

export default Deploys
