import { useState } from "react";
import { Upload, Button } from "@douyinfe/semi-ui";
import { customRequestArgs } from "@douyinfe/semi-ui/lib/es/upload/interface";

export default function FileUpload() {
    let [fileName, setFileName] = useState("");
    let [file, setFile] = useState<File>();

    let [showData, setShowData] = useState({});

    function checkBill() {}

    function openFile(requestArgs: customRequestArgs) {
        requestArgs.onProgress({ total: 10, loaded: 5 });
        setFileName(requestArgs.fileName);
        setFile(requestArgs.fileInstance);

        setTimeout(() => requestArgs.onSuccess({}), 1000);
        console.log(requestArgs);
    }

    return (
        <>
            <Upload
                action="localhost"
                // prompt="请上传账单文件"
                // accept=".csv,.xls,.xlsx"
                limit={1}
                maxSize={1024}
                draggable={true}
                // dragMainText={'点击上传文件或拖拽文件到这里'}
                dragSubText="仅支持csv、xls、xlsx类型文件"
                onSuccess={(data) => setShowData(data)}
                customRequest={openFile}
                style={{ marginTop: 10 }}
            >
                {/* <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button> */}
            </Upload>
            <div>{JSON.stringify(showData)}</div>
        </>
    );
}
