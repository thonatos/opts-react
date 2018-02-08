import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import { Provider } from 'mobx-react'
import { observer, inject } from 'mobx-react'

// 统一引入样式
import './App.css'
import RootStore from '~/store/root'
import {
  Home,
  Deploy,
  Image,
  ImageTag,
  Cluster,
  ClusterDetail,
} from '~/routes/'
import { Protected } from '~/components/'

const rootStore = new RootStore()

@inject('app')
@observer
class Wrap extends Component {
  render() {
    const { langsAntd } = this.props.app
    return (
      <Router>
        <LocaleProvider locale={langsAntd}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Protected path="/deploy" component={Deploy} />
            <Protected path="/images/:id" component={ImageTag} exactly={true} />
            <Protected path="/images" component={Image} />
            <Protected
              path="/clusters/:id"
              component={ClusterDetail}
              exactly={true}
            />
            <Protected path="/clusters" component={Cluster} exactly={true} />
          </Switch>
        </LocaleProvider>
      </Router>
    )
  }
}

const App = () => {
  return (
    <Provider {...rootStore}>
      <Wrap />
    </Provider>
  )
}

export default App
