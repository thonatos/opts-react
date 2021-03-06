import React, { Component } from 'react'
import { Table, Button } from 'antd'
import moment from 'moment'

class ClusterTable extends Component {
  onChange = (pagination, filters, sorter) => {
    const { current } = pagination
    const { load } = this.props
    load(current)
  }

  render() {
    const { title, data, loading, langs, pagination, destroy } = this.props
    const columns = [
      {
        title: langs['cluster_name'],
        dataIndex: 'name',
        key: 'name',
        width: 160,
        fixed: 'left',
      },
      {
        title: langs['cluster_region'],
        dataIndex: 'region',
        key: 'region',
      },
      {
        title: langs['cluster_namespace'],
        dataIndex: 'namespace',
        key: 'namespace',
      },
      {
        title: langs['created_at'],
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => {
          return moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
        },
      },
      {
        title: langs['actions'],
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          const { _id: id } = record
          return (
            <div>
              <Button
                type="danger"
                style={{
                  marginLeft: '1em',
                }}
                onClick={() => {
                  destroy(id)
                }}
              >
                {langs['action_delete']}
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <Table
        title={title}
        style={{ marginBottom: '1em' }}
        scroll={{ x: 1200 }}
        pagination={pagination}
        onChange={this.onChange}
        loading={loading}
        rowKey="_id"
        dataSource={data}
        columns={columns}
      />
    )
  }
}

export default ClusterTable
