import React, { Component } from 'react'
import { Avatar } from 'antd'

const style = {
  wrap: {
    paddingRight: '16px',
  },
  avatar: {
    verticalAlign: 'middle',
  },
  name: {
    marginLeft: '8px',
  },
}

class UserInfo extends Component {
  render() {
    const { username, userrole } = this.props
    return (
      <div style={style.wrap}>
        <Avatar style={style.avatar}>{userrole}</Avatar>
        <span style={style.name}>{username}</span>
      </div>
    )
  }
}

export default UserInfo
