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
                  rules: [{ required: true, message: 'key can not be null' }],
                })(<TextArea />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem label="cert">
                {getFieldDecorator('cert', {
                  initialValue: '',
                  rules: [{ required: true, message: 'cert can not be null' }],
                })(<TextArea />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Deploy
