import CustomLayout from '@/components/Layout'
import { Row, Col, Typography, Form, Input, Button } from 'antd'
import { MailOutlined } from '@ant-design/icons'

const { Title } = Typography

export default () => {
    const onFinish = (values: any) => {
        console.log(values)
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
                        Restore password
                    </Title>
                    <Form
                        name="forgot-password"
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
                                type="text"
                                size="large"
                                prefix={
                                    <MailOutlined className="site-form-item-icon" />
                                }
                                placeholder="Email"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block={true}
                                size="large"
                            >
                                Restore password
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </CustomLayout>
    )
}
