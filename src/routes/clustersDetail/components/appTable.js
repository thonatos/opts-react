import React, { Component } from 'react'
import { Table, Button, Modal } from 'antd'
import moment from 'moment'

import { ServiceTalbe } from './'

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

class AppTable extends Component {
  state = {
    visible: false,
    services: [],
  }

  showServices = ({ services }) => {
    this.setState({
      visible: true,
      services: services || [],
    })
  }

  hideServices = () => {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { title, data, loading, langs } = this.props

    const columns = [
      {
        title: langs['app_name'],
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: langs['app_description'],
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: langs['app_desired_state'],
        dataIndex: 'desired_state',
        key: 'desired_state',
      },
      {
        title: langs['app_current_state'],
        dataIndex: 'current_state',
        key: 'current_state',
      },
      {
        title: langs['app_updated'],
        dataIndex: 'updated',
        key: 'updated',
        render: text => {
          const date = moment(text).format('MM/DD/YYYY HH:mm:ss ZZ')
          return <p>{date}</p>
        },
      },
      {
        title: langs['app_services'],
        dataIndex: 'service',
        key: 'service',
        render: (text, record) => {
          console.log(record)
          return (
            <Button onClick={this.showServices.bind(null, record)}>
              Service
            </Button>
          )
        },
      },
    ]

    return (
      <div>
        <Modal
          title={langs['app_service']}
          width={960}
          visible={this.state.visible}
          onCancel={this.hideServices}
          footer={null}
        >
          <ServiceTalbe
            {...{
              title: null,
              data: this.state.services,
              langs,
            }}
          />
        </Modal>
        <Table
          title={title ? () => <p>{langs[title]}</p> : null}
          style={{ marginBottom: '1em' }}
          scroll={{ x: 1200 }}
          pagination={false}
          loading={loading}
          rowKey="name"
          expandedRowRender={expandedRowRender}
          dataSource={data}
          columns={columns}
        />
      </div>
    )
  }
}

export default AppTable
