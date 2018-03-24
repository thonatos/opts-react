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
  ClusterSwarm,
  ClusterSwarmDetail,
  ClusterKubernetes,
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
              path="/clusters-swarm/:id"
              component={ClusterSwarmDetail}
              exactly={true}
            />
            <Protected
              path="/clusters-swarm"
              component={ClusterSwarm}
              exactly={true}
            />
            <Protected
              path="/clusters-kubernetes"
              component={ClusterKubernetes}
              exactly={true}
            />
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
