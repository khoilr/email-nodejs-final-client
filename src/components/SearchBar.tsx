import React, { useState } from 'react'
import { UserOutlined, PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import {
    AutoComplete,
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Input,
    Modal,
    Upload,
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

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

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

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([
    
    ]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

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
                <Descriptions 
                title="User Info"
                extra={<Button type="primary">Edit</Button>}
                > 
                    <Space wrap size={16}>
                        <Avatar size={100} icon={<UserOutlined />}/>
                    </Space>
                    <br/><br/>
                    <Descriptions.Item label="Name" >
                        Zhou Maomao 
                    </Descriptions.Item>
                    <br/><br/>
                    <Descriptions.Item label="Phone">
                        1810000000 
                    </Descriptions.Item>
                    <br/><br/>
                    <Descriptions.Item label="Email">
                        hello@gmail.com
                    </Descriptions.Item>
                </Descriptions>
                <form>
                    <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-circle"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                    
                    <label style={{color : "#9c9c9c"}}>
                        Name:
                        <Input
                            name="name"
                            type="text"
                            placeholder={"Your name"}
                        />
                    </label>
                    
                    <label style={{color : "#9c9c9c"}}>
                        Phone:
                        <Input
                            name="phone"
                            type="phone"
                            placeholder={"Your phone"}
                        />
                    </label>
                    
                    <label style={{color : "#9c9c9c"}}>
                        Email:
                        <Input
                            name="email"
                            type="email"
                            placeholder={"Your email"}
                        />
                    </label>
                </form>   
            </Drawer>
        </div>
    )
}
