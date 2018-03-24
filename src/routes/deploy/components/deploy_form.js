import React, { Component } from 'react'
import {
  Row,
  Col,
  Tag,
  Icon,
  Form,
  Modal,
  Input,
  Button,
  Select,
  Switch,
} from 'antd'
import * as mobx from 'mobx'
import debounce from 'lodash.debounce'
import { CodeEditor } from '~/components/'
import styles from './index.module.css'
import uniqby from 'lodash.uniqby'

const FormItem = Form.Item
const Option = Select.Option
const CodeEditorOptions = {
  mode: 'yaml',
  theme: 'mbo',
  tabSize: 2,
  lineNumbers: true,
}

@Form.create()
class Deploy extends Component {
  constructor(props) {
    super(props)
    this.onSearch = debounce(this.onSearch, 800)
  }

  state = {
    uuids: {
      env: 0,
      image: 0,
    },
    platform: 'docker_swarm',
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
    if (keys.length === 0) {
      return
    }
    form.setFieldsValue({
      [type]: keys.filter(key => key !== k),
    })
  }

  add = type => {
    const { form } = this.props
    const uuids = this.state.uuids
    const keys = form.getFieldValue(type)
    const uuid = uuids[type] || keys.length
    const nextKeys = keys.concat(uuid)
    this.setState({
      uuids: Object.assign(uuids, {
        [type]: uuid + 1,
      }),
    })
    form.setFieldsValue({
      [type]: nextKeys,
    })
  }

  onPlatformChange = platform => {
    const { form } = this.props
    this.setState(
      {
        platform,
      },
      () => {
        form.resetFields(['cluster'])
      }
    )
  }

  onSearch = (...args) => {
    const { onSearch: handleSearch } = this.props
    handleSearch(...args)
  }

  getFormItems = (type, initialValues = []) => {
    const { images: imageArray, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const initialArray = initialValues.map(v => {
      const { image_id } = v
      image_id && (v._id = v.image_id)
      return v
    })
    let images = []
    if (type === 'image') {
      images = uniqby([...imageArray, ...initialArray], '_id')
    }

    getFieldDecorator(type, {
      initialValue: [...Array(initialArray.length).keys()],
    })

    const keys = getFieldValue(type)

    const formItem = keys.map((k, index) => {
      const { key, value, _id, repo_full_name } = initialArray[index] || {}
      const selected = (_id && `${_id}#${repo_full_name}`) || ''

      return (
        <Col span={24} key={index}>
          <Row gutter={8}>
            <Col span={6}>
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
            <Col span={14}>
              {type === 'image' ? (
                <FormItem>
                  {getFieldDecorator(`${type}_array[${k}].image`, {
                    initialValue: selected,
                    rules: [
                      {
                        required: true,
                        message: 'Please select your image!',
                      },
                    ],
                  })(
                    <Select
                      placeholder="Please select a image"
                      showSearch={true}
                      filterOption={false}
                      onSearch={this.onSearch.bind(this, 'images')}
                    >
                      {images.map((v, i) => {
                        const { repo_full_name, _id, region } = v
                        const value = `${_id}#${repo_full_name}`
                        return (
                          <Option value={value} key={i}>
                            {region ? <Tag>{region}</Tag> : null}
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

  getClusterItem = (cluster = {}) => {
    const { clusters_swarm, clusters_kubernetes, form } = this.props
    const { getFieldDecorator } = form
    const clusters =
      this.state.platform === 'docker_swarm'
        ? clusters_swarm
        : clusters_kubernetes
    const { cluster_id: _id, name } = cluster
    _id && clusters.push({ _id, name })
    const selects = uniqby(clusters, '_id')
    const selected = (_id && `${_id}#${name}`) || ''
    const storage =
      this.state.platform === 'docker_swarm'
        ? 'clusters'
        : 'clusters_kubernetes'
    return (
      <FormItem label="Cluster">
        {getFieldDecorator('cluster', {
          initialValue: selected,
          rules: [{ required: false }],
        })(
          <Select
            placeholder="Please select a cluster"
            showSearch={true}
            filterOption={false}
            onSearch={this.onSearch.bind(this, storage)}
          >
            {selects.map((v, i) => {
              const { name, _id } = v
              return (
                <Option value={`${_id}#${name}`} key={i}>
                  {name}
                </Option>
              )
            })}
          </Select>
        )}
      </FormItem>
    )
  }

  getTriggerItem = (trigger = {}) => {
    const { images, form } = this.props
    const { getFieldDecorator } = form
    const { image_id: _id, repo_full_name } = trigger
    _id && images.push({ _id, repo_full_name })
    const selects = uniqby(images, '_id')
    const selected = (_id && `${_id}#${repo_full_name}`) || ''
    return (
      <FormItem label="Trigger">
        {getFieldDecorator('trigger', {
          initialValue: selected,
          rules: [{ required: true }],
        })(
          <Select
            placeholder="Please select a trigger"
            showSearch={true}
            filterOption={false}
            onSearch={this.onSearch.bind(this, 'images')}
          >
            {selects.map((v, i) => {
              const { repo_full_name, _id, region } = v
              return (
                <Option value={`${_id}#${repo_full_name}`} key={i}>
                  {region ? <Tag>{region}</Tag> : null}
                  {repo_full_name}
                </Option>
              )
            })}
          </Select>
        )}
      </FormItem>
    )
  }

  render() {
    const { form, data, title, visible, onCancel, onCreate } = this.props

    const { getFieldDecorator } = form
    const {
      _id: id,
      app,
      cluster,
      enabled,
      trigger,
      platform,
      template,
      envs: envArray,
      images: imageArray,
    } =
      data || {}

    const images = mobx.toJS(imageArray) || []
    const envs = mobx.toJS(envArray) || []
    const formItemsEnv = this.getFormItems('env', envs)
    const formItemsImage = this.getFormItems('image', images)
    const formItemTrigger = this.getTriggerItem(trigger)
    const formItemCluster = this.getClusterItem(cluster)

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
                <Col span={4}>
                  <FormItem label="Platform">
                    {getFieldDecorator('platform', {
                      initialValue: platform || this.state.platform,
                      rules: [{ required: true }],
                    })(
                      <Select onChange={this.onPlatformChange}>
                        <Option value="docker_swarm">Docker Swarm</Option>
                        <Option value="kubernetes">Kubernetes</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>

                <Col span={8}>
                  <FormItem label="App Name">
                    {getFieldDecorator('app', {
                      initialValue: app,
                      rules: [{ required: false }],
                    })(<Input />)}
                  </FormItem>
                </Col>

                <Col span={8}>{formItemCluster}</Col>

                <Col span={4}>
                  <FormItem label="Enabled">
                    {getFieldDecorator('enabled', {
                      valuePropName: 'checked',
                      initialValue: enabled || false,
                      rules: [{ required: true }],
                    })(<Switch />)}
                  </FormItem>
                </Col>

                <Col span={24}>{formItemTrigger}</Col>
              </Row>
            </Col>

            <Col span={24}>
              <FormItem>
                {getFieldDecorator('template', {
                  initialValue: template,
                  rules: [{ required: true, message: 'yaml can not be null' }],
                })(<CodeEditor options={CodeEditorOptions} />)}
              </FormItem>
            </Col>

            <Col span={24}>
              <Row style={{ padding: '0 1em' }}>
                <Col span={8}>
                  {formItemsEnv}
                  <Col span={24}>
                    <Button type="dashed" onClick={this.add.bind(this, 'env')}>
                      <Icon type="plus" /> Add env field
                    </Button>
                  </Col>
                </Col>
                <Col span={16}>
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
