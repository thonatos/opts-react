import React from 'react'
import { Table, Button } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

const ClusterTable = ({ title, data, loading, langs }) => {
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
        const { name } = record
        return (
          <div>
            <Button>
              <Link to={`/clusters/${name}`}>{langs['cluster_apps']}</Link>
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
      pagination={false}
      loading={loading}
      rowKey="id"
      dataSource={data}
      columns={columns}
    />
  )
}

export default ClusterTable
