import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/mode/yaml/yaml'

const style = {
  lineHeight: '2',
}

class Editor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value || '',
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

  triggerChange = changedValue => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
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

  handleBeforeChange = (editor, data, value) => {
    this.setState({
      value: value,
    })
  }

  render() {
    const { options } = this.props

    return (
      <div style={style}>
        <CodeMirror
          ref="editor"
          value={this.state.value}
          options={options}
          onChange={this.handleChange}
          onBeforeChange={this.handleBeforeChange}
        />
      </div>
    )
  }
}

export default Editor
