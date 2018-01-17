import React, { Component } from 'react'
import { Table } from 'antd'
// import { Link } from 'react-router-dom'
import moment from 'moment'

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
        expandedRowRender={expandedRowRender}
        dataSource={data}
        columns={columns}
      />
    )
  }
}

export default ClusterTable
