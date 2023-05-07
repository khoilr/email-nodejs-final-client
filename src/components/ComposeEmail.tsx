import {
    CheckOutlined,
    LoadingOutlined,
    PaperClipOutlined
} from '@ant-design/icons'
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Typography,
    Upload,
    UploadFile,
    message
} from 'antd'
import axios from 'axios'
import {
    EditorState,
    convertFromRaw,
    RawDraftContentState,
    convertToRaw,
    ContentState
} from 'draft-js'
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
const { Text } = Typography

const Editor = dynamic<EditorProps>(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    { ssr: false }
)

type props = {
    emailId?: string
    open: boolean
    onOk: () => void
    onCancel: () => void
    sender?: string
}

interface Email {
    sender?: string
    sendTo?: string[]
    cc?: string[]
    bcc?: string[]
    subject?: string
    body?: string
    attachments?: any[]
    emailId?: string
}

export default (props: props) => {
    const [messageApi, contextHolder] = message.useMessage()

    // Loading
    const [showLoading, setShowLoading] = useState(false)

    // RichText Editor
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )

    const [sendTo, setSendTo] = useState<String>()
    const [cc, setCc] = useState<String>()
    const [bcc, setBcc] = useState<String>()
    const [nameState, setNameState] = useState(props)

    const [initialValues, setInitialValues] = useState<Email>({
        sender: props.sender
    })

    const [fileList, setFileList] = useState<UploadFile[]>([])
    useEffect(() => {
        if (props.emailId) {
            console.log(props.emailId)

            axios
                .get(`http://localhost:3300/email/${props.emailId}`, {
                    withCredentials: true
                })
                .then((res) => {
                    const email = res.data

                    let body: ContentState
                    if (email.body === null) {
                        body = ContentState.createFromText('')
                    } else {
                        try {
                            body = convertFromRaw(
                                JSON.parse(JSON.parse(email.body))
                            )
                        } catch {
                            body = convertFromRaw(JSON.parse(email.body))
                        }
                    }

                    // try {
                    //     body = convertFromRaw(JSON.parse(email.body))
                    // } catch (error) {
                    //     body = ContentState.createFromText(email.body)
                    // }

                    setEditorState(EditorState.createWithContent(body))
                    const values = {
                        emailId: email.id,
                        sender: email.sender.phone,
                        sendTo: email.SendTo.map((e: any) => e.phone),
                        cc: email.CC.map((e: any) => e.phone),
                        bcc: email.BCC.map((e: any) => e.phone),
                        subject: email.subject,
                        body: email.body
                    }
                    setFileList(
                        email.Attachment.map((e: any) => ({
                            uid: e.id,
                            name: e.name,
                            status: 'done',
                            url: e.url
                        }))
                    )
                    form.setFieldsValue(values)
                })
        }
    }, [props])

    const onFieldsChange = (changedFields: any, allFields: any) => {
        debounceSaveDraft(allFields)
    }

    const debounceSaveDraft = useCallback(
        debounce((allFields) => saveDraft(allFields), 1000),
        []
    )

    const [form] = Form.useForm()

    // submit form
    const onFinish = (values: any) => {
        values.body = JSON.stringify(values.body)

        axios
            .post('http://localhost:3300/email', values, {
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) {
                    messageApi.success('Message sent successfully')
                    props.onOk()
                    form.resetFields()
                }
            })
    }

    const saveDraft = (allFields: any) => {
        const fields: Email = {}

        setShowLoading(true)
        allFields.map((e: any) => {
            switch (e.name[0]) {
                case 'emailId':
                    fields.emailId = e.value
                    break
                case 'sender':
                    fields.sender = e.value
                    break
                case 'sendTo':
                    fields.sendTo = e.value
                    break
                case 'cc':
                    fields.cc = e.value
                    break
                case 'bcc':
                    fields.bcc = e.value
                    break
                case 'subject':
                    fields.subject = e.value
                    break
                case 'body':
                    fields.body = JSON.stringify(e.value)
                    break
            }
        })

        axios
            .post('http://localhost:3300/draft', fields, {
                withCredentials: true
            })
            .then((res) => {
                form.setFieldsValue({
                    emailId: res.data.id
                })
                setShowLoading(false)
                setSendTo('')
                setCc('')
                setBcc('')
            })
            .catch((err) => {
                const response = err.response
                // if (response.status === 404) {
                //     console.log(response.data.notFound)

                //     switch (response.data.notFound) {
                //         case 'sendTo':
                //             setSendTo(response.data.message)
                //             setCc('')
                //             setBcc('')
                //             break
                //         case 'cc':
                //             setCc(response.data.message)
                //             setSendTo('')
                //             setBcc('')
                //             break
                //         case 'bcc':
                //             setBcc(response.data.message)
                //             setSendTo('')
                //             setCc('')
                //             break
                //     }
                // }
                setShowLoading(false)
            })
    }

    return (
        <Modal width={800} {...props} title={'Compose an email'} footer={null}>
            {contextHolder}
            <Form
                form={form}
                onFieldsChange={onFieldsChange}
                onFinish={onFinish}
                layout="vertical"
                style={{ width: '100%' }}
                initialValues={initialValues}
            >
                <Form.Item name="emailId" className="hidden">
                    <Input type="hidden" value={props.emailId} />
                </Form.Item>
                <Form.Item label="Sender" name="sender">
                    <Input type="text" readOnly={true} />
                </Form.Item>
                <Form.Item
                    label={
                        <Text>
                            Send to <Text type="danger">{sendTo}</Text>
                        </Text>
                    }
                    name="sendTo"
                >
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <Text>
                            CC <Text type="danger">{cc}</Text>
                        </Text>
                    }
                    name="cc"
                >
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <Text>
                            BCC <Text type="danger">{bcc}</Text>
                        </Text>
                    }
                    name="bcc"
                >
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                    />
                </Form.Item>
                <Form.Item label="Subject" name="subject">
                    <Input type="text" size="large" />
                </Form.Item>
                <Form.Item label="Body" name="body">
                    <Editor
                        wrapperStyle={{
                            border: '1px solid #d9d9d9',
                            borderRadius: 16
                        }}
                        toolbarStyle={{
                            borderRadius: 16
                        }}
                        editorStyle={{
                            padding: 8
                        }}
                        toolbar={{
                            options: [
                                'inline',
                                'blockType',
                                'fontSize',
                                'fontFamily',
                                'list',
                                'textAlign'
                            ]
                        }}
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                    />
                </Form.Item>
                <Form.Item label="Attachments" name="attachments">
                    <Upload
                        action="http://localhost:3300/upload"
                        multiple
                        onChange={async (info) => {
                            setFileList(info.fileList)
                            if (info.file.status === 'done')
                                info.file.url = info.file.response.url
                        }}
                        fileList={fileList}
                    >
                        <Button icon={<PaperClipOutlined />}>
                            Attachments
                        </Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <div className="flex justify-between">
                        <div>
                            {showLoading ? (
                                <div>
                                    <LoadingOutlined className="mr-1" />
                                    <Text type="secondary">Saving</Text>
                                </div>
                            ) : (
                                <div>
                                    <CheckOutlined className="mr-1" />
                                    <Text type="secondary">Saved to draft</Text>
                                </div>
                            )}
                        </div>
                        <div>
                            <Button
                                key="back"
                                onClick={props.onCancel}
                                className="mr-2"
                            >
                                Close
                            </Button>
                            <Button
                                key="submit"
                                type="primary"
                                htmlType="submit"
                                onClick={props.onOk}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    )
}
