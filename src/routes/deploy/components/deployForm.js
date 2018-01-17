import React, { Component } from 'react'
import { Row, Col } from 'antd'
import { CodeEditor } from '~/components/'

const CodeEditorOptions = {
  mode: 'yaml',
  theme: 'mbo',
  tabSize: 2,
  lineNumbers: true,
}

class Deploy extends Component {
  state = {
    template: '',
  }

  onChange = (editor, data, value) => {
    console.log(value)
    this.setState({
      template: value,
    })
  }

  render() {
    const { data } = this.props
    const { template, env, image } = data
    console.log(env, image)
    return (
      <div>
        <Row>
          <Col>
            <CodeEditor
              ref="editor"
              value={template}
              options={CodeEditorOptions}
              onChange={this.onChange}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Deploy
