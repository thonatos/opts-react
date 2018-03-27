import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Row, Col, Button } from 'antd'
import { Basic as Layout } from '~/layouts/'

import { ClusterTable, ClusterForm } from './components/'

@inject('container', 'app')
@observer
class Clusters extends Component {
  state = {
    visible: false,
  }

  componentDidMount() {
    this.load()
  }

  load = current => {
    const { container } = this.props
    container.index('docker', {
      pageNext: current,
    })
  }

  create = values => {
    return this.props.container.update('docker', values)
  }

  destroy = id => {
    return this.props.container.destroy('docker', id)
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
    this.destroy(id)
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
    const { app, container } = this.props
    const {
      loading,
      docker: data,
      docker_total: total,
      docker_page: current,
      docker_limit: pageSize,
    } = container
    const { langs } = app

    return (
      <Layout title="Docker">
        <ClusterTable
          {...{
            title: () => {
              return (
                <Row gutter={16}>
                  <Col span={12}>
                    <p>{langs['container_docker']}</p>
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
            destroy: this.handleDelete,
            langs,
          }}
        />

        <ClusterForm
          title={langs['action_create']}
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
