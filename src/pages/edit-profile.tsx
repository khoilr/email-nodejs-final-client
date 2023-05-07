import React, { useState } from 'react'
import { UserOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import {
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Typography,
    Row,
    Col,
    Modal,
    Upload,
    Space,
    Form
} from 'antd'
import { auth } from '@/lib/auth'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import CustomLayout from '@/components/Layout'
import { account } from '@/types/account'
import { NextPageContext } from 'next'

const { Title } = Typography

export async function getServerSideProps(ctx: NextPageContext) {
    const token = getCookie('token', ctx)
    const account = await auth(token as string)

    if (account.status !== 200) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
            account: account.data
        }
    }
}

export default function EditProfile({ account }: { account: account }) {
    const router = useRouter()

    const [avatar, setAvatar] = useState(account.avatar)

    const onFinish = (values: any) => {
        console.log('khoicute')

        axios
            .patch('http://localhost:3300/account', values, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 202) {
                    router.push('/')
                }
            })
    }

    return (
        <CustomLayout>
            <Row
                className="flex h-full w-full flex-row items-center justify-center bg-white"
                style={{
                    width: '100wh',
                    height: '100vh'
                }}
            >
                {' '}
                <Col lg={6} md={10} sm={16} xs={24}>
                    <Title className="text-center">Email app</Title>
                    <Title className="text-center" level={2}>
                        Edit profile
                    </Title>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            name: account.name,
                            phone: account.phone,
                            avatar: account.avatar
                        }}
                    >
                        <Form.Item label="Avatar" name="avatar">
                            <Upload
                                action="http://localhost:3300/upload"
                                listType="picture-circle"
                                maxCount={1}
                                onChange={async (info) => {
                                    if (info.file.status === 'done') {
                                        info.file.url = info.file.response.url
                                        setAvatar(info.file.response.url)
                                    }
                                }}
                                accept="image/*"
                                showUploadList={false}
                            >
                                <Avatar
                                    style={{
                                        width: '100%',
                                        height: '100%'
                                    }}
                                    className="flex items-center justify-center"
                                    src={avatar}
                                    icon={<UserOutlined />}
                                />
                                {/* <div>
                                    <PlusOutlined />
                                    <div className="mt-2">Upload</div>
                                </div> */}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Name" name="name">
                            <Input
                                name="name"
                                type="text"
                                size="large"
                                placeholder={'Your name'}
                            />
                        </Form.Item>
                        <Form.Item label="phone" name="phone">
                            <Input
                                name="phone"
                                size="large"
                                type="phone"
                                placeholder={'Your phone'}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={true}
                                size="large"
                            >
                                Save profile
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </CustomLayout>
    )
}
