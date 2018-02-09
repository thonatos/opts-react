import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { observer, inject } from 'mobx-react'

import { Full as Layout } from '~/layouts/'
import { LoginForm } from '~/components/'
import logo from '~/assets/logo.svg'
import styles from './index.module.css'

@inject('auth')
@observer
class Home extends Component {
  login = ({ username, password }) => {
    const { auth } = this.props
    auth.login(username, password)
  }

  render() {
    const { auth } = this.props

    if (auth.authed) {
      return <Redirect to="/images" />
    }

    return (
      <Layout title="Login" className={styles.home}>
        <div className={styles.login}>
          <div className={styles.brand}>
            <img src={logo} alt="logo" />
            <span>Maidops</span>
            <div className={styles.brand_desc}>
              <p>DevOps Middleware Based On Docker</p>
            </div>
          </div>
          <LoginForm login={this.login} />
        </div>
      </Layout>
    )
  }
}

export default Home
