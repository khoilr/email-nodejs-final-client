import React from 'react'
import { LockOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Col, Row } from 'antd'
import { PhoneOutlined } from '@ant-design/icons'
import CustomLayout from '@/components/Layout'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'
import { NextPageContext } from 'next'
import { auth } from '@/lib/auth'

export async function getServerSideProps(ctx: NextPageContext) {
    const token = getCookie('token', ctx)
    const res = await auth(token as string)

    if (res.status === 200) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default () => {
    const router = useRouter()

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values)
        axios
            .post('http://localhost:3300/auth/sign-in', values, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) router.push('/')
            })
            .catch((err) => {
                console.log(err.response)
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
                            <Input
                                size="large"
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item
                                name="remember"
                                valuePropName="checked"
                                noStyle
                            >
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <a className="float-right" href="">
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
                            Or <a href="/sign-up">register now!</a>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </CustomLayout>
    )
}
