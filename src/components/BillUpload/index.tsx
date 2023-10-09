import {useState} from "react";
import {Upload, Button} from "@douyinfe/semi-ui";
import {customRequestArgs} from "@douyinfe/semi-ui/lib/es/upload/interface";
import Papa from "papaparse";

// @ts-ignore
export default function BillUpload({data, setData, hasUploadFile, setHasUploadFile}) {
    let [fileName, setFileName] = useState("");
    // let [data, setData] = useState({});

    let [showData, setShowData] = useState({});

    function checkBill() {
    }

    function clearBillData() {
        setData([]);
        setHasUploadFile(false);
    }

    async function openFile(requestArgs: customRequestArgs) {
        requestArgs.onProgress({total: 10, loaded: 5});
        setFileName(requestArgs.fileName);

        // get csv data
        // TODO: handle parsing error
        Papa.parse(requestArgs.fileInstance, {
            header: false,
            skipEmptyLines: true,
            error: (error: Object) => {
                console.log(error)
            },
            complete: function (results: { data: any }) {
                console.log(results.data);
                setData(results.data)
                setHasUploadFile(true);
            },
        });

        requestArgs.onSuccess({});

        // setTimeout(() => requestArgs.onSuccess({}), 1000);
        // console.log(requestArgs);
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
                onClear={clearBillData}
                onRemove={clearBillData}
                onSuccess={(data) => setShowData(data)}
                customRequest={openFile}
                style={{marginTop: 10}}
            >
                {/* <Button icon={<IconUpload />} theme="light">
                点击上传
            </Button> */}
            </Upload>
            {/* <div>{JSON.stringify(data)}</div> */}
        </>
    );
}
