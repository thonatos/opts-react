import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

class SideMenu extends Component {
  render() {
    const { menu, current_path } = this.props
    return (
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[current_path]}>
        {menu.map(v => {
          const { name, href, icon } = v
          return (
            <Menu.Item key={href}>
              <Link to={href}>
                <Icon type={icon} />
                <span>{name}</span>
              </Link>
            </Menu.Item>
          )
        })}
      </Menu>
    )
  }
}

export default SideMenu
