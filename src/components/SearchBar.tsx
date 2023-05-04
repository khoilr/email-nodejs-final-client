import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import {
    AutoComplete,
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Space
} from 'antd'

const renderTitle = (title: string) => (
    <span>
        {title}
        <a
            style={{ float: 'right' }}
            href="https://www.google.com/search?q=antd"
            target="_blank"
            rel="noopener noreferrer"
        >
            more
        </a>
    </span>
)

const renderItem = (title: string, count: number) => ({
    value: title,
    label: (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            {title}
            <span>
                <UserOutlined /> {count}
            </span>
        </div>
    )
})

const options = [
    {
        label: renderTitle('Libraries'),
        options: [
            renderItem('AntDesign', 10000),
            renderItem('AntDesign UI', 10600)
        ]
    },
    {
        label: renderTitle('Solutions'),
        options: [
            renderItem('AntDesign UI FAQ', 60100),
            renderItem('AntDesign FAQ', 30010)
        ]
    },
    {
        label: renderTitle('Articles'),
        options: [renderItem('AntDesign design language', 100000)]
    }
]

export default () => {
    const [open, setOpen] = useState(false)
    const showDrawer = () => {
        setOpen(true)
    }
    const onClose = () => {
        setOpen(false)
    }

    return (
        <div className="flex h-full w-full flex-row items-center justify-around">
            <AutoComplete
                popupClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={500}
                style={{ width: '60%' }}
                options={options}
            >
                <Input.Search size="large" placeholder="Find email" />
            </AutoComplete>
            <Button type="dashed" size="large" onClick={showDrawer}>
                Profile
            </Button>
            <Drawer
                placement="right"
                width={512}
                onClose={onClose}
                open={open}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>
                            OK
                        </Button>
                    </Space>
                }
            >
                <Descriptions title="User Info">
                    <Descriptions.Item label="UserName">
                        Zhou Maomao
                    </Descriptions.Item>
                    <Descriptions.Item label="Telephone">
                        1810000000
                    </Descriptions.Item>
                    <Descriptions.Item label="Live">
                        Hangzhou, Zhejiang
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark">empty</Descriptions.Item>
                    <Descriptions.Item label="Address">
                        No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang,
                        China
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </div>
    )
}
