import React, { useState } from 'react'
import { UserOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import {
    AutoComplete,
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Modal,
    Upload,
    Space,
    Form
} from 'antd'

type props = {
    open: boolean
    onClose: () => void
}
export default (props: props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList)

    return (
        <Drawer
            {...props}
            placement="right"
            width={512}
            extra={
                <Space>
                    <Button onClick={props.onClose}>Cancel</Button>
                    <Button type="primary" onClick={props.onClose}>
                        OK
                    </Button>
                </Space>
            }
        >
            <Descriptions
                title="User Info"
                extra={<Button type="primary">Edit</Button>}
            >
                <Space wrap size={16}>
                    <Avatar size={100} icon={<UserOutlined />} />
                </Space>
                <br />
                <br />
                <Descriptions.Item label="Name">Zhou Maomao</Descriptions.Item>
                <br />
                <br />
                <Descriptions.Item label="Phone">1810000000</Descriptions.Item>
                <br />
                <br />
                <Descriptions.Item label="Email">
                    hello@gmail.com
                </Descriptions.Item>
            </Descriptions>
            <Form layout="horizontal">
                <Form.Item label="Avatar">
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-circle"
                        fileList={fileList}
                        onChange={handleChange}
                    >
                        {fileList.length >= 1 ? null : (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item label="Name">
                    <Input name="name" type="text" placeholder={'Your name'} />
                </Form.Item>
                <Form.Item label="phone">
                    <Input
                        name="phone"
                        type="phone"
                        placeholder={'Your phone'}
                    />
                </Form.Item>
                <Form.Item label="email">
                    <Input
                        name="email"
                        type="email"
                        placeholder={'Your email'}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    )
}
