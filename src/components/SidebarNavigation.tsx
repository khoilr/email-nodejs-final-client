import React, { useState } from 'react'
import {
    FileOutlined,
    StarOutlined,
    SendOutlined,
    MailOutlined,
    EditOutlined,
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    SettingOutlined
} from '@ant-design/icons'
import { Button, Menu } from 'antd'
import type { MenuProps } from 'antd/es/menu'
import { Layout } from 'antd'
const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label
    } as MenuItem
}

export default () => {
    const [collapse, setCollapse] = useState(false)

    const items: MenuItem[] = [
        getItem('Inbox', '1', <MailOutlined />),
        getItem('Starred', '2', <StarOutlined />),
        getItem('Sent', '3', <SendOutlined />),
        getItem('Drafts', '4', <FileOutlined />),
        getItem('Trash', '5', <DeleteOutlined />),
        { type: 'divider' },
        getItem('Manage labels', '6', <SettingOutlined />),
        getItem('Create new label', '7', <PlusOutlined />)
    ]

    const siderStyle: React.CSSProperties = {
        textAlign: 'center',
        lineHeight: '120px',
        color: '#fff',
        minHeight: '100vh',
        background: '#fff'
    }

    return (
        <Sider
            style={siderStyle}
            width={256}
            collapsed={collapse}
            breakpoint={'md'}
            onBreakpoint={(broken) => {
                setCollapse(broken)
            }}
            collapsible
            onCollapse={(value) => setCollapse(value)}
            trigger={
                <div className="h-full bg-white">
                    {collapse ? (
                        <RightOutlined style={{ color: 'black' }} />
                    ) : (
                        <LeftOutlined style={{ color: 'black' }} />
                    )}
                </div>
            }
        >
            <Menu
                style={{ width: '100%', height: '100%' }}
                defaultSelectedKeys={['1']}
                mode={'inline'}
                theme={'light'}
                items={items}
                onClick={(e) => {
                    switch (e.key) {
                    }
                    console.log(e.key)
                }}
            />
        </Sider>
    )
}
