import React, { Component } from 'react'
import { Table, Button, Switch } from 'antd'
import moment from 'moment'

const expandedRowRender = ({ template }) => {
  return (
    <div style={{ maxWidth: '1200px' }}>
      <pre style={{ width: '100%', overflow: 'auto' }}>
        <code>{template}</code>
      </pre>
    </div>
  )
}

class DeployTable extends Component {
  onChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { load } = this.props
    load(current, pageSize)
  }

  render() {
    const {
      title,
      pagination,
      data,
      loading,
      langs,
      edit,
      destroy,
    } = this.props

    const columns = [
      {
        title: langs['deploy_app'],
        dataIndex: 'app',
        key: 'app',
      },
      {
        title: langs['deploy_cluster'],
        dataIndex: 'cluster',
        key: 'region',
        render: text => {
          return text.name || ''
        },
      },
      {
        title: langs['deploy_enabled'],
        dataIndex: 'enabled',
        key: 'enabled',
        render: (text, record) => {
          return <Switch checked={text} />
        },
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
          const { _id: id } = record
          return (
            <div>
              <Button onClick={edit.bind(null, record)}>Edit</Button>
              <Button
                type="danger"
                style={{
                  marginLeft: '1em',
                }}
                onClick={() => {
                  destroy(id)
                }}
              >
                Delete
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <Table
        title={title}
        rowKey="_id"
        style={{ marginBottom: '1em' }}
        scroll={{ x: 1200 }}
        pagination={pagination}
        onChange={this.onChange}
        loading={loading}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        columns={columns}
      />
    )
  }
}

export default DeployTable
