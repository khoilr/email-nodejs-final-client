import { Drawer, Row, Space, Table, Tag, Col, Divider, FloatButton } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { FormOutlined, DeleteOutlined, PlusOutlined, StarOutlined } from '@ant-design/icons'

interface DataType {
    key: string
    sender: string
    subject: string
    received: string
    labels: string[]
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Starred',
        dataIndex: 'starred',
        key: 'starred',
        render: (starred) => <a style={{color: "black"}}><StarOutlined/></a>
    },
    {
        title: 'Sender',
        dataIndex: 'sender',
        key: 'sender',
        render: (text) => <a>{text}</a>
    },
    {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject'
    },
    {
        title: 'Labels',
        key: 'labels',
        dataIndex: 'labels',
        render: (_, { labels }) => (
            <>
                {labels.map((labels) => {
                    let color = labels.length > 5 ? 'geekblue' : 'green'
                    if (labels === 'loser') {
                        color = 'volcano'
                    }
                    return (
                        <Tag color={color} key={labels}>
                            {labels.toUpperCase()}
                        </Tag>
                    )
                })}
            </>
        )
    },
    {
        title: 'Received time',
        dataIndex: 'received',
        key: 'received'
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a style={{color: "red"}}><DeleteOutlined/></a>
            </Space>
        )
    }
]

const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
        )
    },
    getCheckboxProps: (record: DataType) => ({
        disabled: record.sender === 'Disabled User', // Column configuration not to be checked
        sender: record.sender
    })
}

interface DescriptionItemProps {
    title: string
    content: React.ReactNode
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
)

export default () => {
    const [open, setOpen] = useState(false)

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const data: DataType[] = [
        {
            key: '1',
            sender: 'John Brown',
            subject: 'New message',
            received: '2021-01-01',
            labels: ['nice', 'developer']
        },
        {
            key: '2',
            sender: 'Jim Green',
            subject: 'New message',
            received: '2021-01-01',
            labels: ['loser']
        },
        {
            key: '3',
            sender: 'Joe Black',
            subject: 'New message',
            received: '2021-01-01',
            labels: ['cool', 'teacher']
        }
    ]

    return (
        <>
            <Table
                size="large"
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
                columns={columns}
                dataSource={data}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: (event) => {
                            console.log('row clicked', record, rowIndex)
                            showDrawer()
                        }
                    }
                }}
            />
            <Drawer
                width={640}
                placement="right"
                closable={false}
                onClose={onClose}
                open={open}
            >
                <p
                    className="site-description-item-profile-p"
                    style={{ marginBottom: 24 }}
                >
                    User Profile
                </p>
                <p className="site-description-item-profile-p">Personal</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Full Name" content="Lily" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem
                            title="Account"
                            content="AntDesign@example.com"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="City" content="HangZhou" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Country" content="China🇨🇳" />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem
                            title="Birthday"
                            content="February 2,1900"
                        />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Website" content="-" />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title="Message"
                            content="Make things as simple as possible but no simpler."
                        />
                    </Col>
                </Row>
                <Divider />
                <p className="site-description-item-profile-p">Company</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem
                            title="Position"
                            content="Programmer"
                        />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem
                            title="Responsibilities"
                            content="Coding"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Department" content="XTech" />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem
                            title="Supervisor"
                            content={<a>Lin</a>}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title="Skills"
                            content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
                        />
                    </Col>
                </Row>
                <Divider />
                <p className="site-description-item-profile-p">Contacts</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem
                            title="Email"
                            content="AntDesign@example.com"
                        />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem
                            title="Phone Number"
                            content="+86 181 0000 0000"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <DescriptionItem
                            title="Github"
                            content={
                                <a href="http://github.com/ant-design/ant-design/">
                                    github.com/ant-design/ant-design/
                                </a>
                            }
                        />
                    </Col>
                </Row>
            </Drawer>
        </>
    )
}
