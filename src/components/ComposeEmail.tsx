import React, { useRef, useState } from 'react'
import { Button, Form, Input, Modal, Progress, Typography } from 'antd'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
const { TextArea } = Input
const { Text } = Typography
import { LoadingOutlined, CheckOutlined } from '@ant-design/icons'

type props = {
    open: boolean
    onOk: (e: React.MouseEvent<HTMLElement>) => void
    onCancel: (e: React.MouseEvent<HTMLElement>) => void
}

export default (props: props) => {
    const [disabled, setDisabled] = useState(true)
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0
    })
    const draggleRef = useRef<HTMLDivElement>(null)
    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
        const { clientWidth, clientHeight } = window.document.documentElement
        const targetRect = draggleRef.current?.getBoundingClientRect()
        if (!targetRect) {
            return
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y)
        })
    }

    const [showLoading, setShowLoading] = useState(false)

    return (
        <Modal
            {...props}
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move'
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false)
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true)
                    }}
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                >
                    Compose email
                </div>
            }
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            footer={[
                <div className="flex justify-between">
                    <div>
                        {/* if showLoading is true show LoadingOutlined, else show CheckOutlined  */}
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
                        <Button key="back" onClick={props.onCancel}>
                            Close
                        </Button>
                        ,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={props.onOk}
                        >
                            Send
                        </Button>
                    </div>
                </div>
            ]}
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
                    <TextArea rows={4} showCount />
                </Form.Item>
            </Form>
        </Modal>
    )
}
