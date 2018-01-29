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

  render() {
    const { options, onChange } = this.props
    return (
      <CodeMirror
        value={this.state.value}
        options={options}
        onBeforeChange={(editor, data, value) => {
          this.setState({
            value: value,
          })
        }}
        onChange={onChange}
      />
    )
  }
}

export default Editor
