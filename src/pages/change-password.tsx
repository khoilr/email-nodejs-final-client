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
import { error } from 'console'

const { Title, Text } = Typography

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

export default function ChangePassword({ account }: { account: account }) {
    const router = useRouter()

    const [avatar, setAvatar] = useState(account.avatar)
    const [error, setError] = useState('')

    const onFinish = (values: any) => {
        axios
            .patch('http://localhost:3300/change-password', values, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 202) {
                    router.push('/')
                }
            })
            .catch((err) => {
                setError(err.response.data.message)
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
                        Change password
                    </Title>
                    <Form layout="vertical" onFinish={onFinish}>
                        <Form.Item label="Old password" name="oldPassword">
                            <Input.Password type="password" size="large" />
                        </Form.Item>
                        <Form.Item label="New password" name="newPassword">
                            <Input.Password size="large" type="password" />
                        </Form.Item>
                        <Form.Item>
                            <Text type="danger">{error}</Text>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={true}
                                size="large"
                            >
                                Change password
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </CustomLayout>
    )
}
