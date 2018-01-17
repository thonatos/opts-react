import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Layout, Icon, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'
import { withRouter } from 'react-router'

import { SideMenu, UserInfo } from '~/components/'
import styles from './index.module.css'
import logo from '~/assets/logo.svg'

const { Header, Sider, Content } = Layout

@inject('app', 'auth')
@observer
@withRouter
class Basic extends Component {
  state = {
    collapsed: false,
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }

  logout = () => {
    const { auth } = this.props
    auth.logout()
  }

  render() {
    const { children, title, app, match, auth } = this.props
    const { menu } = app
    const { username, userrole } = auth
    const { path: current_path } = match
    const logout = this.logout

    return (
      <Layout className={styles.layout}>
        {/* helmet */}
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {/* sider */}
        <Sider
          className={styles.side}
          width={266}
          collapsible
          trigger={null}
          collapsed={this.state.collapsed}
          collapsedWidth={0}
        >
          <div className={styles.logo}>
            <img src={logo} alt="" />
            <span>(Dev)Opts</span>
          </div>
          <SideMenu {...{ current_path, menu, logout }} />
        </Sider>

        {/* layout */}
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row type="flex" justify="space-between" align="middle">
              <Col>
                <Icon
                  className={styles.trigger}
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Col>
              <Col>
                <UserInfo {...{ username, userrole }} />
              </Col>
            </Row>
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Basic
