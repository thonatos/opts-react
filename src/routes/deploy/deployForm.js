import React, { Component } from 'react'
import { Form, Icon, Input, Select, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

class CustomForm extends Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('app', {
            rules: [{ required: true, message: 'Please input your app name!' }],
          })(<Input placeholder="App Name" />)}
        </FormItem>

        <FormItem>
          {getFieldDecorator('cluster_id', {
            rules: [{ required: true, message: 'Please select your cluster!' }],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Docker Cluster"
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('image_id', {
            rules: [{ required: true, message: 'Please select your image!' }],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Docker Image"
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          )}
        </FormItem>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(CustomForm)

export default WrappedForm
