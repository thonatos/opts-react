import React, { Component } from 'react'
import { Row, Col, Button, Select, Input } from 'antd'

import { Basic as Layout } from '~/layouts/'
import styles from './index.module.css'
import { CodeEditor } from '~/components/'

const options = {
  mode: 'yaml',
  theme: 'mbo',
  tabSize: 2,
  lineNumbers: true,
}

const composer = `
version: '2'
services: 
  app:
    image: nginx:stable
`

const Option = Select.Option

class Home extends Component {
  state = {
    composer: '',
  }

  onSubmit = () => {
    console.log('xxx')
  }

  onChange = (editor, data, value) => {
    console.log(value)
    this.setState({
      composer: value,
    })
  }

  render() {
    return (
      <Layout title="deploy">
        <Row gutter={12}>
          <Col span={12}>
            <CodeEditor
              ref="editor"
              value={composer}
              options={options}
              onChange={this.onChange}
            />
          </Col>
          <Col span={12}>
            <div>
              <h2>app</h2>
              <Input placeholder="Basic usage" />
            </div>

            <div>
              <h2>cluster</h2>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a person"
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>

            <div>
              <h2>image</h2>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Select a image"
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>

            <div>
              <h2>env</h2>
            </div>
          </Col>
          <Col span={24} style={{ marginTop: '1em' }}>
            <Button type="primary" onClick={this.onSubmit}>
              Submit
            </Button>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default Home
