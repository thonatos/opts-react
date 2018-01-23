import React, { Component } from 'react'
import { Table, Button, Modal } from 'antd'
import moment from 'moment'

import { DeployForm } from './'

const expandedRowRender = ({ template }) => {
  return (
    <div
      style={{
        maxWidth: '1200px',
      }}
    >
      <pre
        style={{
          width: '100%',
          overflow: 'auto',
        }}
      >
        <code>{template}</code>
      </pre>
    </div>
  )
}

class DeployTable extends Component {
  state = {
    visible: false,
    deploy: null,
  }

  onChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { load } = this.props
    load(current, pageSize)
  }

  showModal = deploy => {
    this.setState({
      visible: true,
      deploy: deploy,
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

      console.log('Received values of form: ', values)
      form.resetFields()
      this.setState({ visible: false })
    })
  }

  saveFormRef = form => {
    this.form = form
  }

  render() {
    const { title, deploys, images, loading, langs, pagination } = this.props
    const columns = [
      {
        title: langs['deploy_app'],
        dataIndex: 'app',
        key: 'app',
      },
      {
        title: langs['deploy_cluster'],
        dataIndex: 'cluster_id',
        key: 'region',
      },
      {
        title: langs['deploy_created_at'],
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => {
          const date = moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
          return <p>{date}</p>
        },
      },
      {
        title: langs['deploy_actions'],
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          return (
            <Button onClick={this.showModal.bind(null, record)}>Edit</Button>
          )
        },
      },
    ]

    return (
      <div>
        <DeployForm
          title={langs['deploy']}
          langs={langs}
          deploy={this.state.deploy}
          images={images}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          ref={this.saveFormRef}
        />
        <Table
          title={() => {
            return <p>{langs[title]}</p>
          }}
          style={{ marginBottom: '1em' }}
          scroll={{ x: 1200 }}
          pagination={pagination}
          onChange={this.onChange}
          loading={loading}
          rowKey="id"
          expandedRowRender={expandedRowRender}
          dataSource={deploys}
          columns={columns}
        />
      </div>
    )
  }
}

export default DeployTable
