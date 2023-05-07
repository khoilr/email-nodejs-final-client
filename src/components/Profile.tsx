import React, { useState } from 'react'
import { UserOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import {
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Modal,
    Upload,
    Space,
    Form,
    Image
} from 'antd'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { account } from '@/types/account'

type props = {
    open: boolean
    onClose: () => void
    account: account
}

export default (props: props) => {
    const router = useRouter()
    const signOut = () => {
        axios
            .post(
                'http://localhost:3300/signout',
                {},
                {
                    withCredentials: true
                }
            )
            .then((res) => {
                if (res.status === 204) router.push('/signin')
            })
            .catch((err) => {
                console.log(err.response)
            })
    }

    const [fileList, setFileList] = useState<UploadFile[]>([])

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList)

    const [openModal, setOpenModal] = useState(false)

    return (
        <Drawer
            {...props}
            placement="right"
            width={512}
            extra={
                <Space>
                    <Button
                        onClick={() =>
                            Modal.confirm({
                                title: 'Are you sure to sign out?',
                                onOk: signOut,
                                okText: 'Sign out',
                                okType: 'danger',
                                okButtonProps: {
                                    danger: true
                                },
                                cancelText: 'Stay in',
                                maskClosable: true
                            })
                        }
                    >
                        Sign out
                    </Button>
                </Space>
            }
        >
            <Descriptions
                title="User Info"
                column={1}
                extra={
                    <>
                        <Button
                            href="/edit-profile"
                            type="primary"
                            icon={<EditOutlined />}
                            className="mr-2"
                        >
                            Edit
                        </Button>
                        <Button href="/change-password" icon={<EditOutlined />}>
                            Change password
                        </Button>
                    </>
                }
            >
                <Space wrap size={16}>
                    {/* <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        // src={props.account.avatar}
                        // onClick={() => setOpenModal(true)}
                    > */}
                    <Image
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%'
                        }}
                        src={props.account.avatar}
                    />{' '}
                    {/* </Avatar> */}
                </Space>
                <Descriptions.Item label="Name">
                    {props.account.name}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                    {props.account.phone}
                </Descriptions.Item>
            </Descriptions>
        </Drawer>
    )
}
