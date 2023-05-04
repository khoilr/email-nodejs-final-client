import { ReactNode } from 'react'
import { ConfigProvider } from 'antd'

type Props = {
    children: ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#f27fac',
                    colorInfo: '#13C2C2',
                    borderRadius: 16,
                    wireframe: false
                }
            }}
        >
            {children}
        </ConfigProvider>
    )
}

export default Layout
