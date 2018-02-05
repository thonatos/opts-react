import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Row, Col, Button } from 'antd'
import { Basic as Layout } from '~/layouts/'
import { DeployTable, DeployForm } from './components/'

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

  load = (current, pageSize) => {
    const { docker } = this.props
    docker.loadDeploys(current, pageSize)
  }

  update = values => {
    const { docker } = this.props
    return docker.createOrUpdateDeploy(values)
  }

  destory = id => {
    const { docker } = this.props
    return docker.deleteDeploy(id)
  }

  // event
  onChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    this.load(current, pageSize)
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
    this.destory(id)
      .then(res => {
        console.log('#res', res)
        this.load()
      })
      .catch(err => {
        console.log('#err', err)
      })
  }

  handleSearch = (type, value) => {
    if (!value) {
      return
    }

    const { docker } = this.props
    const { searchClusters, searchImages } = docker

    switch (type) {
      case 'images':
        searchImages(value)
        break

      case 'clusters':
        searchClusters(value)
        break

      default:
        break
    }
  }

  saveFormRef = form => {
    this.form = form
  }

  render() {
    const { app, docker } = this.props
    const { imagesSearch, clustersSearch } = docker
    const { langs } = app

    const {
      deploys,
      deploys_size,
      deploys_count,
      deploys_current,
      deploys_loading: loading,
    } = docker

    const pagination = {
      pageSize: deploys_size,
      total: deploys_count,
      current: deploys_current,
    }

    return (
      <Layout title="Deploys">
        <DeployTable
          {...{
            title: () => {
              return (
                <Row gutter={16}>
                  <Col span={12}>
                    <p>Docker Deploys</p>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <Button type="primary" onClick={this.showModal}>
                      Add Deploy
                    </Button>
                  </Col>
                </Row>
              )
            },
            data: deploys,
            loading,
            pagination,
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
          images={imagesSearch}
          clusters={clustersSearch}
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
