import React, { Component } from 'react'
import { Avatar } from 'antd'

class UserInfo extends Component {
  render() {
    const { username, userrole } = this.props
    return (
      <div style={{ paddingRight: '16px' }}>
        <Avatar style={{ verticalAlign: 'middle' }}>{userrole}</Avatar>
        <span style={{ marginLeft: '8px' }}>{username}</span>
      </div>
    )
  }
}

export default UserInfo
