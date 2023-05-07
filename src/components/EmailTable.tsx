import { Button, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import ComposeEmail from './ComposeEmail'
import { instance } from '@/lib/axios'
import moment, { Moment } from 'moment'
import ViewEmail from './ViewEmail'
import axios from 'axios'

interface message {
    key?: string
    emailId?: string
    sender?: string
    subject?: string
    received?: string
    labels?: string[]
    starred?: boolean
}

interface messages {
    messages?: message[]
}

const columns: ColumnsType<message> = [
    {
        title: 'Starred',
        dataIndex: 'starred',
        key: 'starred',
        render: (value: any, record: message, index: number) => {
            return (
                <Button
                    type="ghost"
                    onClick={() => {
                        axios
                            .patch(
                                `http://localhost:3300/recipient/`,
                                {
                                    starred: !value,
                                    emailId: record.emailId
                                },
                                {
                                    withCredentials: true
                                }
                            )
                            .then(() => {
                                record.starred = !value
                            })
                    }}
                >
                    {value ? (
                        <StarFilled style={{ color: '#f27fac' }} />
                    ) : (
                        <StarOutlined />
                    )}
                    {/* <StarOutlined
                        onClick={() => {
                            console.log(value)
                            // axios.patch('http://localhost:3300/email/', {
                            //     starred: !value
                            // })
                        }}
                    /> */}
                </Button>
            )
        }
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
                {labels?.map((labels) => {
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
        title: 'Time',
        dataIndex: 'received',
        key: 'received'
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a style={{ color: 'red' }}>
                    <DeleteOutlined />
                </a>
            </Space>
        )
    }
]

const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: message[]) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows
        )
    },
    getCheckboxProps: (record: message) => ({
        disabled: record.sender === 'Disabled User',
        sender: record.sender
    })
}

type props = {
    inbox: String
}

export default (props: props) => {
    const [data, setData] = useState<message[]>([])

    useEffect(() => {
        let inbox: string
        switch (props.inbox) {
            case 'inbox':
                instance.get('/email').then((res) => {
                    data.splice(0, data.length)

                    res.data.map((message: any) => {
                        console.log(message.star)

                        data.push({
                            key: message.id,
                            emailId: message.email.id,
                            sender: message.email.sender.name,
                            subject: message.email.subject,
                            received: moment(message.receivedAt).fromNow(),
                            labels: [],
                            starred: message.star
                        })
                    })

                    setData([...data])
                })
                break
            case 'starred':
                instance.get('/email/starred').then((res) => {
                    console.log('khoicute', res)

                    data.splice(0, data.length)

                    res.data.map((message: any) => {
                        data.push({
                            key: message.id,
                            emailId: message.email.id,
                            sender: message.email.sender.name,
                            subject: message.email.subject,
                            received: moment(message.receivedAt).fromNow(),
                            labels: [],
                            starred: message.star
                        })
                    })

                    setData([...data])
                })
                break
            case 'sent':
                instance.get('/email/sent').then((res) => {
                    console.log(res)

                    data.splice(0, data.length)

                    res.data.map((message: any) => {
                        data.push({
                            key: message.id,
                            emailId: message.id,
                            sender: message.sender.phone,
                            subject: message.subject,
                            received: moment(message.updateAt).fromNow()
                        })
                    })

                    setData([...data])
                })
                break
            case 'drafts':
                instance.get('/draft').then((res) => {
                    console.log(res)

                    data.splice(0, data.length)

                    res.data.map((message: any) => {
                        data.push({
                            key: message.id,
                            emailId: message.id,
                            sender: message.sender.phone,
                            subject: message.subject,
                            received: moment(message.updateAt).fromNow()
                        })
                    })

                    setData([...data])
                })
                break
            default:
                inbox = '/email'
        }
    }, [props])

    // Detail email modal
    const [viewDetail, setViewDetail] = useState(false)
    const [emailDetailID, setEmailDetailId] = useState<string>('')
    const handleDetailOk = () => {
        setViewDetail(false)
    }
    const handleDetailCancel = () => {
        setViewDetail(false)
    }
    const showDetail = () => {
        setViewDetail(true)
    }

    // Compose email modal
    const [viewCompose, setViewCompose] = useState(false)
    const [emailId, setEmailId] = useState<string>('')
    const handleOk = () => {
        setViewCompose(false)
    }
    const handleCancel = () => {
        setViewCompose(false)
    }
    const showCompose = () => {
        setViewCompose(true)
    }

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
                            console.log(event)

                            switch (props.inbox) {
                                case 'inbox':
                                case 'starred':
                                    setEmailDetailId(record.emailId as string)
                                    showDetail()
                                    break
                                case 'sent':
                                case 'drafts':
                                    setEmailId(record.emailId as string)
                                    showCompose()
                                    break
                            }
                        }
                    }
                }}
            />
            <ViewEmail
                emailId={emailDetailID}
                open={viewDetail}
                onOk={handleDetailOk}
                onCancel={handleDetailCancel}
            />

            <ComposeEmail
                emailId={emailId}
                open={viewCompose}
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </>
    )
}
