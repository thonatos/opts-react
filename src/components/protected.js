import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

@inject('app', 'auth')
@observer
class Protected extends Component {
  render() {
    const { component: Component, auth, app, path, ...rest } = this.props

    if (!auth.authed) {
      return <Redirect to="/" />
    }

    app.updateCurrentPath(path)

    return <Route {...rest} render={props => <Component {...props} />} />
  }
}

export default Protected
