import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
const FormItem = Form.Item

@Form.create()
class LoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault()
    const { login } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        login(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ fontSize: 14 }} />}
              size="large"
              placeholder="User Name"
            />
          )}
        </FormItem>

        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 14 }} />}
              type="password"
              size="large"
              placeholder="Password"
            />
          )}
        </FormItem>

        <FormItem>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
          >
            Log in
          </Button>
        </FormItem>
      </Form>
    )
  }
}

export default LoginForm
