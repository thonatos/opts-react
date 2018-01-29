import React, { Component } from 'react'
import { Modal, Form, Icon, Input, Button, Select, Row, Col } from 'antd'
import * as mobx from 'mobx'
import { CodeEditor } from '~/components/'
import styles from './index.module.css'

const FormItem = Form.Item
const Option = Select.Option
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
      <div style={{ lineHeight: '2' }}>
        <CodeEditor
          ref="editor"
          value={value}
          options={CodeEditorOptions}
          onChange={this.handleEditorChange}
        />
      </div>
    )
  }
}

@Form.create()
class Deploy extends Component {
  state = {
    uuids: {
      env: 0,
      image: 0,
    },
  }

  reset = () => {
    const { form } = this.props
    form.resetFields()
    this.setState({
      uuids: {
        env: 0,
        image: 0,
      },
    })
  }

  remove = (k, type) => {
    const { form } = this.props
    const keys = form.getFieldValue(type)
    // We need at least one passenger
    if (keys.length === 0) {
      return
    }

    // can use data-binding to set
    form.setFieldsValue({
      [type]: keys.filter(key => key !== k),
    })
  }

  add = type => {
    const { form } = this.props
    const uuids = this.state.uuids
    // can use data-binding to get
    const keys = form.getFieldValue(type)

    const uuid = uuids[type] || keys.length
    const nextKeys = keys.concat(uuid)
    this.setState({
      uuids: Object.assign(uuids, {
        [type]: uuid + 1,
      }),
    })
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      [type]: nextKeys,
    })
  }

  getFormItem = (type, initialValue = []) => {
    const { images, form } = this.props
    const { getFieldDecorator, getFieldValue } = form

    getFieldDecorator(type, {
      initialValue: [...Array(initialValue.length).keys()],
    })

    const keys = getFieldValue(type)

    const formItem = keys.map((k, index) => {
      const { key, value, image_id } = initialValue[index] || {}

      return (
        <Col span={24} key={index}>
          <Row gutter={8}>
            <Col span={10}>
              <FormItem>
                {getFieldDecorator(`${type}_array[${k}].key`, {
                  initialValue: key,
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
              {type === 'image' ? (
                <FormItem>
                  {getFieldDecorator(`${type}_array[${k}].image_id`, {
                    initialValue: image_id,
                    rules: [
                      {
                        required: true,
                        message: 'Please select your image!',
                      },
                    ],
                  })(
                    <Select placeholder="Please select a image">
                      {images.map((v, i) => {
                        const { repo_full_name, id } = v
                        return (
                          <Option value={id} key={i}>
                            {repo_full_name}
                          </Option>
                        )
                      })}
                    </Select>
                  )}
                </FormItem>
              ) : (
                <FormItem>
                  {getFieldDecorator(`${type}_array[${k}].value`, {
                    initialValue: value,
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [
                      {
                        required: true,
                        whitespace: false,
                        message: 'Please input value.',
                      },
                    ],
                  })(<Input placeholder="value" />)}
                </FormItem>
              )}
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
    const {
      form,
      data,
      title,
      visible,
      onCancel,
      onCreate,
      clusters,
    } = this.props

    const { getFieldDecorator } = form
    const { _id: id, template, env, image, cluster, app } = data || {}

    const formItemsEnv = this.getFormItem('env', mobx.toJS(env))
    const formItemsImage = this.getFormItem('image', mobx.toJS(image))

    return (
      <Modal
        title={title}
        width={960}
        visible={visible}
        onCancel={() => {
          this.reset()
          onCancel()
        }}
        onOk={onCreate}
        bodyStyle={{ padding: '0 0 1em 0' }}
      >
        <Form layout="vertical">
          <Row>
            <Col span={24} style={{ display: 'none' }}>
              <FormItem>
                {getFieldDecorator('id', {
                  initialValue: id,
                  rules: [{ required: false }],
                })(<Input />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <Row style={{ padding: '1em' }} gutter={16}>
                <Col span={12}>
                  <FormItem label="App Name">
                    {getFieldDecorator('app', {
                      initialValue: app,
                      rules: [{ required: false }],
                    })(<Input />)}
                  </FormItem>
                </Col>

                <Col span={12}>
                  <FormItem label="Cluster">
                    {getFieldDecorator('cluster', {
                      initialValue: cluster,
                      rules: [{ required: false }],
                    })(
                      <Select placeholder="Please select a cluster">
                        {clusters.map((v, i) => {
                          const { name, _id: id } = v
                          return (
                            <Option value={id} key={i}>
                              {name}
                            </Option>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <FormItem>
                {getFieldDecorator('template', {
                  initialValue: template,
                  rules: [{ required: true, message: 'yaml can not be null' }],
                })(<Editor />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <Row style={{ padding: '0 1em' }}>
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
