import CustomLayout from '@/components/Layout'
import { Col, Row, Form, Input, Button, Typography } from 'antd'
import { PhoneOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { auth } from '@/lib/auth'
import { NextPageContext } from 'next'

const { Title } = Typography
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

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values)
        // axios
        //     .post('http://localhost:3300/auth', values)
        //     .then((res) => {
        //         if (res.status === 201) router.push('/')
        //     })
        //     .catch((err) => {
        //         console.log(err)
        //     })
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
                    <Title>Khoicute</Title>
                    <Title level={2}>Sign up</Title>
                    <Form
                        name="login"
                        method="POST"
                        action="/api/sign-in"
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
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your name!'
                                }
                            ]}
                        >
                            <Input
                                type="text"
                                size="large"
                                prefix={
                                    <IdcardOutlined className="site-form-item-icon" />
                                }
                                placeholder="Name"
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
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={true}
                                size="large"
                            >
                                Sign up
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            Already have an account?{' '}
                            <a href="/sign-in">Sign in here!</a>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>{' '}
        </CustomLayout>
    )
}
