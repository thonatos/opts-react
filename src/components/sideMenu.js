import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu

class SideMenu extends Component {
  onClick = ({ item, key, keyPath }) => {
    const { logout } = this.props
    switch (key) {
      case 'logout':
        logout()
        break

      default:
        break
    }
  }

  render() {
    const { menu, current_path } = this.props
    return (
      <Menu
        theme="dark"
        mode="inline"
        onClick={this.onClick}
        defaultSelectedKeys={[current_path]}
      >
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

        <SubMenu
          key="system"
          title={
            <span>
              <Icon type="setting" />
              <span>Setting</span>
            </span>
          }
        >
          <Menu.Item key="logout">
            <Icon type="logout" />
            <span>Logout</span>
          </Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
}

export default SideMenu
