import React, { Component } from 'react'
import { Modal, Form, Input, Row, Col } from 'antd'

const { TextArea } = Input
const FormItem = Form.Item

@Form.create()
class Deploy extends Component {
  render() {
    const { form, title, visible, onCancel, onCreate } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal
        title={title}
        width={960}
        visible={visible}
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  initialValue: '',
                  rules: [{ required: true, message: 'name can not be null' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Region">
                {getFieldDecorator('region', {
                  initialValue: '',
                  rules: [
                    { required: true, message: 'region can not be null' },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Namespace">
                {getFieldDecorator('mamespace', {
                  initialValue: 'default',
                  rules: [
                    { required: true, message: 'namespace can not be null' },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Version">
                {getFieldDecorator('version', {
                  initialValue: '1.7',
                  rules: [
                    { required: true, message: 'version can not be null' },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="Host">
                {getFieldDecorator('host', {
                  initialValue: '',
                  rules: [
                    {
                      required: true,
                      type: 'url',
                      message: 'must be url',
                    },
                  ],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="ca">
                {getFieldDecorator('ca', {
                  initialValue: '',
                  rules: [{ required: true, message: 'ca can not be null' }],
                })(<TextArea />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="key">
                {getFieldDecorator('key', {
                  initialValue: '',
                  rules: [{ required: false, message: 'key is optional' }],
                })(<TextArea />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="cert">
                {getFieldDecorator('cert', {
                  initialValue: '',
                  rules: [{ required: false, message: 'cert is optional' }],
                })(<TextArea />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="User">
                {getFieldDecorator('user', {
                  initialValue: '',
                  rules: [{ required: false, message: 'user is optional' }],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={12}>
              <FormItem label="Password">
                {getFieldDecorator('pass', {
                  initialValue: '',
                  rules: [{ required: false, message: 'password is optional' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Deploy
