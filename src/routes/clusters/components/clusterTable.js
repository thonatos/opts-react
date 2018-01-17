import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

class ClusterTable extends Component {
  onChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination
    const { load } = this.props
    load(current, pageSize)
  }

  render() {
    const { title, data, loading, langs, pagination } = this.props
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
        title: langs['cluster_created_at'],
        dataIndex: 'created_at',
        key: 'created_at',
        render: text => {
          const date = moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
          return <p>{date}</p>
        },
      },
      {
        title: langs['cluster_action'],
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          const { id } = record
          return (
            <div>
              <Button>
                <Link to={`/clusters/${id}`}>{langs['cluster_apps']}</Link>
              </Button>
            </div>
          )
        },
      },
    ]

    return (
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
        dataSource={data}
        columns={columns}
      />
    )
  }
}

export default ClusterTable
