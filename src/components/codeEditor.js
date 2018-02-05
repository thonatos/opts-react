import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/mode/yaml/yaml'

class Editor extends Component {
  constructor(props) {
    super(props)
    const value = this.props.value || ''
    this.state = {
      value,
    }
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value
      this.setState({
        value,
      })
    }
  }

  handleChange = (editor, data, value) => {
    if (!('value' in this.props)) {
      this.setState({
        value,
      })
    }
    this.triggerChange(value)
  }

  triggerChange = changedValue => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  render() {
    const { options } = this.props

    return (
      <div style={{ lineHeight: '2' }}>
        <CodeMirror
          ref="editor"
          value={this.state.value}
          options={options}
          onBeforeChange={(editor, data, value) => {
            this.setState({
              value: value,
            })
          }}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}

export default Editor
