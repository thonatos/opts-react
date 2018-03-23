import React, { Component } from 'react'
import { Table, Button } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

class ImageTable extends Component {
  onChange = (pagination, filters, sorter) => {
    const { current } = pagination
    const { load } = this.props
    load(current)
  }

  render() {
    const { title, data, loading, pagination, langs } = this.props

    const columns = [
      {
        title: langs['image_name'],
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: langs['image_namespace'],
        dataIndex: 'namespace',
        key: 'namespace',
      },
      {
        title: langs['image_region'],
        dataIndex: 'region',
        key: 'region',
      },
      {
        title: langs['image_repo_full_name'],
        dataIndex: 'repo_full_name',
        key: 'repo_full_name',
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
        title: langs['cluster_action'],
        dataIndex: 'actions',
        key: 'actions',
        render: (text, record) => {
          const { _id: id } = record
          return (
            <div>
              <Button>
                <Link to={`/images/${id}`}>Tags</Link>
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <div>
        <Table
          title={title ? () => <p>{langs[title]}</p> : null}
          style={{ marginBottom: '1em' }}
          scroll={{ x: 1200 }}
          pagination={pagination}
          onChange={this.onChange}
          loading={loading}
          rowKey="_id"
          dataSource={data}
          columns={columns}
        />
      </div>
    )
  }
}

export default ImageTable
