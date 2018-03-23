import React, { Component } from 'react'
import { Table } from 'antd'
import moment from 'moment'

class TagTable extends Component {
  onChange = (pagination, filters, sorter) => {
    const { current } = pagination
    const { load } = this.props
    load(current)
  }

  render() {
    const { title, data, loading, pagination, langs } = this.props
    const columns = [
      {
        title: langs['image_tag_name'],
        dataIndex: 'tag',
        key: 'tag',
      },
      {
        title: langs['image_tag_pushed_at'],
        dataIndex: 'pushed_at',
        key: 'pushed_at',
        render: text => {
          return moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
        },
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
        title: langs['updated_at'],
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: text => {
          return moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
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

export default TagTable
