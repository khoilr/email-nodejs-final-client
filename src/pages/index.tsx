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
import { account } from '../types/account'
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
    const account = await auth(token as String)

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

export default function Home({ account }: { account: account }) {
    const [inbox, setInbox] = useState<String>('inbox')

    return (
        <CustomLayout>
            <Layout>
                <SidebarNavigation inbox={inbox} setInbox={setInbox} />
                <Layout>
                    <Header style={headerStyle}>
                        <SearchBar account={account} />
                    </Header>
                    <Content style={contentStyle}>
                        <EmailTable inbox={inbox} />
                    </Content>
                </Layout>
            </Layout>
        </CustomLayout>
    )
}
