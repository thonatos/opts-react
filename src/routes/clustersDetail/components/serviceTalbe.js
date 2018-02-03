import React from 'react'
import { Table, Tag } from 'antd'
import moment from 'moment'

const TAG_COLORS = ['', '#87d068', '#2db7f5', '#f50', '#108ee9', 'orange']

const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')

const expandedRowRender = ({ containers, definition }) => {
  const keys = Object.keys(containers)
  const { image } = definition
  return (
    <div>
      <Tag>{image}</Tag>
      <ul
        style={{
          listStyle: 'none',
          paddingLeft: '0',
        }}
      >
        {keys.map(k => {
          const { name, ip, health, status, vm_id, fail_count } = containers[k]
          const tags = {
            name,
            status,
            health,
            'Fail count': fail_count,
            ip,
            'VM id': vm_id,
          }
          return (
            <li key={k} style={{ marginTop: '0.8em' }}>
              <div>
                {Object.keys(tags).map((k, i) => {
                  const name = firstUpperCase(k)
                  const record = tags[k]
                  return (
                    <Tag color={TAG_COLORS[i]} key={i}>
                      {name}: {record}
                    </Tag>
                  )
                })}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const ServiceTable = ({ title, data, loading, langs }) => {
  const columns = [
    {
      title: langs['service_name'],
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: langs['service_project'],
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: langs['service_desired_state'],
      dataIndex: 'desired_state',
      key: 'desired_state',
    },
    {
      title: langs['service_current_state'],
      dataIndex: 'current_state',
      key: 'current_state',
    },
    {
      title: langs['service_updated'],
      dataIndex: 'updated',
      key: 'updated',
      render: text => {
        const date = moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
        return <p>{date}</p>
      },
    },
  ]

  return (
    <Table
      title={title ? () => <p>{langs[title]}</p> : null}
      style={{ marginBottom: '1em' }}
      pagination={false}
      loading={loading}
      rowKey="id"
      dataSource={data}
      columns={columns}
      expandedRowRender={expandedRowRender}
    />
  )
}

export default ServiceTable
