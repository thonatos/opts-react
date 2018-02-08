import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Row, Col, Button } from 'antd'
import { Basic as Layout } from '~/layouts/'

import { ClusterTable, ClusterForm } from './components/'

@inject('docker', 'app')
@observer
class Clusters extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    this.load()
  }

  load = current => {
    const { docker } = this.props
    docker.loadClusters(current)
  }

  create = values => {
    const { docker } = this.props
    return docker.createCluster(values)
  }

  destory = id => {
    const { docker } = this.props
    return docker.deleteCluster(id)
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleCreate = () => {
    const form = this.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }
      this.create(values)
        .then(res => {
          console.log('#res', res)
          form.resetFields()
          this.setState({ visible: false })
          this.load()
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

  saveFormRef = form => {
    this.form = form
  }

  render() {
    const { app, docker } = this.props
    const {
      clusters: data,
      clusters_loading: loading,
      clusters_total: total,
      clusters_page: current,
      clusters_limit: pageSize,
    } = docker
    const { langs } = app

    return (
      <Layout title="Clusters">
        <ClusterTable
          {...{
            title: () => {
              return (
                <Row gutter={16}>
                  <Col span={12}>
                    <p>Docker Cluster</p>
                  </Col>
                  <Col
                    span={12}
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <Button type="primary" onClick={this.showModal}>
                      Add Cluster
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
            destroy: this.handleDelete,
            langs,
          }}
        />

        <ClusterForm
          title="Add Docker Cluster"
          langs={langs}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          ref={this.saveFormRef}
        />
      </Layout>
    )
  }
}

export default Clusters