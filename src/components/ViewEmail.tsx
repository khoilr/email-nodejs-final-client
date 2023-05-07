import { PaperClipOutlined } from '@ant-design/icons'
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
import { EditorState, convertFromRaw } from 'draft-js'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
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

    // RichText Editor
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )

    const [fileList, setFileList] = useState<UploadFile[]>([])
    useEffect(() => {
        if (props.open)
            axios
                .get(`http://localhost:3300/email/${props.emailId}`, {
                    withCredentials: true
                })
                .then((res) => {
                    const email = res.data
                    console.log('email', email)

                    const body = convertFromRaw(JSON.parse(email.body ?? ''))
                    setEditorState(EditorState.createWithContent(body))
                    const values = {
                        emailId: email.id,
                        sender: email.sender.name,
                        sendTo: email.SendTo.map((e: any) => e.name),
                        cc: email.CC.map((e: any) => e.name),
                        bcc: email.BCC.map((e: any) => e.name),
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
    }, [props])

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

    return (
        <Modal
            width={800}
            {...props}
            title={'Email detail'}
            footer={
                <div>
                    <Button key="back" onClick={props.onCancel}>
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
            }
        >
            {contextHolder}
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                style={{ width: '100%' }}
            >
                <Form.Item name="emailId" className="hidden">
                    <Input type="hidden" value={props.emailId} />
                </Form.Item>
                <Form.Item label="Sender" name="sender">
                    <Input type="text" readOnly={true} />
                </Form.Item>
                <Form.Item label={<Text>Send to</Text>} name="sendTo">
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item label={<Text>CC</Text>} name="cc">
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item label={<Text>BCC</Text>} name="bcc">
                    <Select
                        mode="tags"
                        tokenSeparators={[' ']}
                        dropdownStyle={{ display: 'none' }}
                        showArrow={false}
                        showSearch={false}
                        showAction={['focus', 'click']}
                        className="cursor-text"
                        disabled={true}
                    />
                </Form.Item>
                <Form.Item label="Subject" name="subject">
                    <Input type="text" readOnly={true} size="large" />
                </Form.Item>
                <Form.Item label="Body" name="body">
                    <Editor
                        readOnly={true}
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
                        toolbarHidden={true}
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
                        disabled={true}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
