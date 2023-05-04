import ComposeEmail from '@/components/ComposeEmail'
import EmailTable from '@/components/EmailTable'
import CustomLayout from '@/components/Layout'
import SearchBar from '@/components/SearchBar'
import SidebarNavigation from '@/components/SidebarNavigation'
import { auth } from '@/lib/auth'
import { FormOutlined } from '@ant-design/icons'
import { FloatButton, Input, Layout } from 'antd'
import { getCookie } from 'cookies-next'
import { NextPageContext } from 'next'
import { useState } from 'react'
const { TextArea } = Input
const { Header, Content } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 32,
    background: '#fff'
}

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff'
}

export async function getServerSideProps(ctx: NextPageContext) {
    const token = getCookie('token', ctx)
    const account = await auth(token as string)

    if (account.status !== 200) {
        return {
            redirect: {
                destination: '/sign-in',
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

export default function Home({ account }: { account: object }) {
    console.log(account)

    

    return (
        <CustomLayout>
            <Layout>
                <SidebarNavigation />
                <Layout>
                    <Header style={headerStyle}>
                        <SearchBar />
                    </Header>
                    <Content style={contentStyle}>
                        <EmailTable />
                    </Content>
                </Layout>
                {/* <Drawer
                    // responsive width
                    width={640}
                    placement="right"
                    onClose={onClose}
                    open={open}
                >
                    <Form layout="vertical" style={{ width: '100%' }}>
                        <Form.Item label="Send to">
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                        <Form.Item label="CC">
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                        <Form.Item label="BCC">
                            <Input placeholder="input placeholder" />
                        </Form.Item>
                        <Form.Item label="Content">
                            {/* <ReactQuill /> */}
                {/* <TextArea rows={4} showCount />
                        </Form.Item>
                    </Form>
                </Drawer>  */}
            </Layout>
        </CustomLayout>
    )
}

// Home.getInitialProps = async ({ req }: NextPageContext) => {
//     const headers = req ? req.headers : {}
//     const account = JSON.parse((headers.account as string) || '{}')
//     return { account }
// }
