import "./App.css";
// @ts-ignore
import {bitable, TableMeta} from "@lark-base-open/js-sdk";
import {Button, Col, Form, Row, Select} from "@douyinfe/semi-ui";
import {BaseFormApi} from "@douyinfe/semi-foundation/lib/es/form/interface";
import {useState, useEffect, useRef, useCallback} from "react";
import FileUpload from "./components/FileUpload";
import {OptionProps} from "@douyinfe/semi-ui/lib/es/select";

export default function App() {
    const [tableMetaList, setTableMetaList] = useState<TableMeta[]>();
    const [billData, setBillData] = useState<string[][]>([[]]);
    const [headerSelectOption, setHeaderSelectOption] = useState<OptionProps[]>([]);

    const formApi = useRef<BaseFormApi>();

    // add record to table
    const addRecord = useCallback(
        async ({table: tableId}: { table: string }) => {
            if (tableId) {
                const table = await bitable.base.getTableById(tableId);
                await table.addRecord({
                    fields: {},
                });
            }
        },
        []
    );

    useEffect(() => {
        Promise.all([
            bitable.base.getTableMetaList(),
            bitable.base.getSelection(),
        ]).then(([metaList, selection]) => {
            setTableMetaList(metaList);
            formApi.current?.setValues({table: selection.tableId});
        });
    }, []);

    // set header select option list
    useEffect(() => {
        console.log("update header select list");
        setHeaderSelectOption(
            billData.slice(0, 20).map((element: string[], index) => {
                return {value: index, label: element.reduce((acc, curr) => acc + "-" + curr, "")};
            })
        );
    }, [billData]);

    return (
        <main className="main">
            <h4>
                Edit <code>src/App.tsx</code> and save to reload
            </h4>
            <Form
                labelPosition="top"
                onSubmit={addRecord}
                getFormApi={(baseFormApi: BaseFormApi) =>
                    (formApi.current = baseFormApi)
                }
            >
                <Form.Select
                    field="table"
                    label="Select Table"
                    placeholder="Please select a Table"
                    style={{width: "100%"}}
                >
                    {Array.isArray(tableMetaList) &&
                        tableMetaList.map(({name, id}) => {
                            return (
                                <Form.Select.Option key={id} value={id}>
                                    {name}
                                </Form.Select.Option>
                            );
                        })}
                </Form.Select>
                <Button theme="solid" htmlType="submit">
                    Add Record
                </Button>
            </Form>

            <FileUpload data={billData} setData={setBillData}/>

            <Form onValueChange={values => {
            }}>
                {
                    ({formState, values, formApi}) => (
                        <>
                            <Row>
                                <Col span={24}>
                                    <Form.Select
                                        field="header"
                                        label="header"
                                        placeholder="请选择业务线"
                                        style={{width: "100%"}}
                                        optionList={headerSelectOption}
                                    ></Form.Select>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Select field='business2' label="原字段" style={{width: '200px'}}>
                                        <Form.Select.Option value="abc">Semi</Form.Select.Option>
                                        <Form.Select.Option value="ulikeCam">轻颜相机</Form.Select.Option>
                                        <Form.Select.Option value="toutiao">今日头条</Form.Select.Option>
                                    </Form.Select>
                                </Col>
                                <Col span={12}>
                                    <Form.Select field="role" label='角色' style={{width: '200px'}}>
                                        <Form.Select.Option value="operate">运营</Form.Select.Option>
                                        <Form.Select.Option value="rd">开发</Form.Select.Option>
                                        <Form.Select.Option value="pm">产品</Form.Select.Option>
                                        <Form.Select.Option value="ued">设计</Form.Select.Option>
                                    </Form.Select>
                                </Col>
                                {Array.isArray(billData[formState.values.header]) &&
                                    billData[formState.values.header].map((element: string, index) => {
                                        const id = "aa" + index;
                                        return (
                                            <Col span={12}>
                                                <Form.Select key={id} field={id} label={element} style={{width: "90%"}}>
                                                    <Form.Select.Option value="operate">运营</Form.Select.Option>
                                                    <Form.Select.Option value="rd">开发</Form.Select.Option>
                                                    <Form.Select.Option value="pm">产品</Form.Select.Option>
                                                    <Form.Select.Option value="ued">设计</Form.Select.Option>
                                                </Form.Select>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                            <code style={{marginTop: 24}}>{JSON.stringify(formState)}</code>
                            {/*{console.log(billData[formState.values.header])}*/}
                        </>
                    )
                }
            </Form>
            {/*<div>{JSON.stringify(billData)}</div>*/}
        </main>
    );
}
