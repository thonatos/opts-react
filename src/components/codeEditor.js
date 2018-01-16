import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/mode/yaml/yaml'

class Editor extends Component {
  state = {
    value: '',
  }

  componentDidMount() {
    const { value } = this.props
    this.setState({
      value,
    })
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
