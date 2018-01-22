import React, { Component } from 'react'
import { Modal, Form, Icon, Input, Button, Row, Col } from 'antd'
import mobx from 'mobx'
import { CodeEditor } from '~/components/'
import styles from './index.module.css'

const FormItem = Form.Item
const CodeEditorOptions = {
  mode: 'yaml',
  theme: 'mbo',
  tabSize: 2,
  lineNumbers: true,
}

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

  handleEditorChange = (editor, data, value) => {
    console.log(value)
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
    const { value } = this.props
    return (
      <CodeEditor
        ref="editor"
        value={value}
        options={CodeEditorOptions}
        onChange={this.handleEditorChange}
      />
    )
  }
}

let uuid = 0

@Form.create()
class Deploy extends Component {
  remove = (k, type) => {
    const { form } = this.props
    const keys = form.getFieldValue(type)
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }

    // can use data-binding to set
    const value = {}
    value[type] = keys.filter(key => key !== k)
    form.setFieldsValue(value)
  }

  add = type => {
    const { form } = this.props
    // can use data-binding to get
    const keys = form.getFieldValue(type)
    const nextKeys = keys.concat(uuid)
    uuid++
    // can use data-binding to set
    // important! notify form to detect changes
    const value = {}
    value[type] = nextKeys
    form.setFieldsValue(value)
  }

  getFormItem = type => {
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator(type, { initialValue: [] })
    const keys = getFieldValue(type)
    console.log('xxx', keys, type)
    const formItem = keys.map((k, index) => {
      return (
        <Col span={24}>
          <Row gutter={8}>
            <Col span={10}>
              <FormItem key={k}>
                {getFieldDecorator(`key[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: 'Please input key name.',
                    },
                  ],
                })(<Input placeholder="key" />)}
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem key={k}>
                {getFieldDecorator(`value[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [
                    {
                      required: true,
                      whitespace: false,
                      message: 'Please value key name.',
                    },
                  ],
                })(<Input placeholder="value" />)}
              </FormItem>
            </Col>
            <Col span={4}>
              {keys.length > 0 ? (
                <Icon
                  className={styles.dynamic_delete_button}
                  type="minus-circle-o"
                  onClick={() => this.remove(k, type)}
                />
              ) : null}
            </Col>
          </Row>
        </Col>
      )
    })
    return formItem
  }

  render() {
    const { form, data, title, langs, visible, onCancel, onCreate } = this.props
    const { getFieldDecorator } = form
    const { template, env, image } = data || {}
    console.log(template, env, image)
    console.log(mobx.toJS(env))

    const formItemsEnv = this.getFormItem('env')
    const formItemsImage = this.getFormItem('image')

    return (
      <Modal
        title={title}
        width={960}
        visible={visible}
        onCancel={onCancel}
        onOk={onCreate}
        bodyStyle={{
          padding: '0 0 1em 0',
        }}
      >
        <Form layout="vertical">
          <Row>
            <Col span={24}>
              <FormItem>
                {getFieldDecorator('template', {
                  initialValue: template,
                  rules: [{ required: true, message: 'yaml can not be null' }],
                })(<Editor />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <Row
                style={{
                  padding: '0 1em',
                }}
              >
                <Col span={12}>
                  {formItemsEnv}
                  <Col span={24}>
                    <Button type="dashed" onClick={this.add.bind(this, 'env')}>
                      <Icon type="plus" /> Add env field
                    </Button>
                  </Col>
                </Col>
                <Col span={12}>
                  {formItemsImage}
                  <Col span={24}>
                    <Button
                      type="dashed"
                      onClick={this.add.bind(this, 'image')}
                    >
                      <Icon type="plus" /> Add image field
                    </Button>
                  </Col>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default Deploy
