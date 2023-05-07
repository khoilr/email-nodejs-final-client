import React, { useState } from 'react'
import { LockOutlined } from '@ant-design/icons'
import { Button, Typography, Checkbox, Form, Input, Col, Row } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'
import CustomLayout from '@/components/Layout'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getCookie } from 'cookies-next'
import { NextPageContext } from 'next'
import { auth } from '@/lib/auth'

const { Title, Text } = Typography

export async function getServerSideProps(ctx: NextPageContext) {
    const token = getCookie('token', ctx)
    if (token) {
        const res = await auth(token as string)

        if (res.status === 200) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        } else {
            return {
                props: {}
            }
        }
    } else {
        return {
            props: {}
        }
    }
}

export default () => {
    const router = useRouter()
    const [dangerText, setDangerText] = useState('')

    const onFinish = (values: any) => {
        axios
            .post('http://localhost:3300/signin', values, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) {
                    router.push('/')
                }
            })
            .catch((err) => {
                const response = err.response
                setDangerText(response.data.message)
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
                        Sign in
                    </Title>
                    <Form
                        name="login"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!'
                                }
                            ]}
                        >
                            <Input
                                type="tel"
                                size="large"
                                prefix={
                                    <PhoneOutlined className="site-form-item-icon" />
                                }
                                placeholder="Phone"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!'
                                }
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Text type="danger">{dangerText}</Text>
                        <Form.Item>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="float-right" href="/forgot-password">
                                Forgot password
                            </a>
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={true}
                                size="large"
                            >
                                Log in
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            Or <a href="/signup">register now!</a>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </CustomLayout>
    )
}
