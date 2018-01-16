import React, { Component } from 'react'
import { Layout } from 'antd'
import { Helmet } from 'react-helmet'

import styles from './index.module.css'

class Full extends Component {
  render() {
    const { children, title, className } = this.props
    return (
      <Layout className={`${styles.layout} ${className || ''}`}>
        {/* helmet */}
        <Helmet>
          <title>{title}</title>
        </Helmet>

        {/* content */}
        {children}
      </Layout>
    )
  }
}

export default Full
