import React, { useState } from 'react'
import { UserOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload'
import type { UploadFile } from 'antd/es/upload/interface'
import {
    AutoComplete,
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Modal,
    Upload,
    Space,
    Form
} from 'antd'
import ComposeEmail from './ComposeEmail'
import Profile from './Profile'
import { account } from '@/types/account'

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

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
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

type props = {
    account: account
}

export default (props: props) => {
    // Profile drawer
    const [openProfile, setOpenProfile] = useState(false)
    const showProfileDrawer = () => {
        setOpenProfile(true)
    }
    const onProfileClose = () => {
        setOpenProfile(false)
    }

    // Compose email modal
    const [openCompose, setOpenCompose] = useState(false)
    const handleOk = () => {
        setOpenCompose(false)
    }
    const handleCancel = () => {
        setOpenCompose(false)
    }
    const showCompose = () => {
        setOpenCompose(true)
    }

    return (
        <div className="flex h-full w-full flex-row items-center justify-between">
            <Button
                type="primary"
                size="large"
                onClick={showCompose}
                className="mx-2"
                icon={<EditOutlined />}
            >
                Compose
            </Button>
            <ComposeEmail
                sender={props.account.phone}
                readOnly={false}
                open={openCompose}
                onOk={handleOk}
                onCancel={handleCancel}
            />
            <AutoComplete
                popupClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={500}
                className="mx-2 flex-grow"
                // style={{ width: '60%' }}
                options={options}
            >
                <Input.Search size="large" placeholder="Find email" />
            </AutoComplete>
            <Button
                className="mx-2"
                icon={<UserOutlined />}
                size="large"
                onClick={showProfileDrawer}
            >
                Profile
            </Button>
            <Profile
                open={openProfile}
                onClose={onProfileClose}
                account={props.account}
            />
        </div>
    )
}
