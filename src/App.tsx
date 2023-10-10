import "./App.css";
// @ts-ignore
import {bitable, TableMeta, IFieldMeta} from "@lark-base-open/js-sdk";
import {Button, Col, Form, Row, Select, Table, Avatar, ButtonGroup} from "@douyinfe/semi-ui";
import {BaseFormApi} from "@douyinfe/semi-foundation/lib/es/form/interface";
import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import BillUpload from "./components/BillUpload";
import {OptionProps} from "@douyinfe/semi-ui/lib/es/select";

import {IconMore} from '@douyinfe/semi-icons';
import {ColumnProps} from "@douyinfe/semi-ui/lib/es/table/interface";

export default function App() {
    const [hasUploadFile, setHasUploadFile] = useState(false);

    const [tableMetaList, setTableMetaList] = useState<TableMeta[]>();
    const [fieldMetaList, setFieldMetaList] = useState<IFieldMeta[]>();

    const [billData, setBillData] = useState<string[][]>([[]]);
    const [headerSelectOption, setHeaderSelectOption] = useState<OptionProps[]>([]);
    const [tableData, setTableData] = useState<{
        key: string | number,
        name: string
    }[]>([]);


    const formApi = useRef<BaseFormApi>();
    const tableSelectComponent = useRef<Select[]>();

    // add record to table
    const addRecord = useCallback(
        async ({table: tableId}: {
            table: string
        }) => {
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
        ]).then(async ([metaList, selection]) => {
            setTableMetaList(metaList);
            formApi.current?.setValues({table: selection.tableId});

            await getFieldMetaList(selection.tableId);

            console.log(metaList)
            console.log(selection)
            console.log(fieldMetaList)
        });
    }, []);

    // get table field meta list in order when first open or change table
    async function getFieldMetaList(tableId: any) {
        //根据tableId获取数据表实例
        // @ts-ignore
        const table = await bitable.base.getTableById(tableId);

        // 获取一个视图实例
        // @ts-ignore
        // const view = await table.getViewById(selection.viewId);
        const viewMetaList = await table.getViewMetaList(); // 获取视图元信息列表
        const viewMeta = viewMetaList.filter((element) => element.type == 1)[0];
        const view = await table.getViewById(viewMeta.id);

        // 使用视图实例的API: getFieldMetaList ，获取数据表所有字段信息
        const fieldMeta = await view.getFieldMetaList();
        setFieldMetaList(fieldMeta);

        console.log(`get field data: tableId=${tableId}`);
        console.log(viewMeta);
        console.log(fieldMeta);
    }

    //TODO: remove table select content when change table or change csv header

    // set header select option list
    useEffect(() => {
        console.log("update header select list");
        setHeaderSelectOption(
            billData.slice(0, 20).map((element: string[], index) => {
                return {value: index, label: element.reduce((acc, curr) => acc + "-" + curr, "")};
            })
        );
    }, [billData]);

    // set table data
    function handleHeaderSelectChange(value: any) {
        console.log(`update table data to ${value}-${typeof value}-${billData[value]}`);
        if (billData[value] == undefined) {
            return;
        }
        setTableData(billData[value].map(
            (element: string, index) => {
                return {key: index, name: element, name2: element + "-2", name3: element + "-3"};
            }));
    }

    // clear data when user remove bill file
    useEffect(() => {
        if (!hasUploadFile) {
            formApi.current?.setValue("header", "");
            setTableData([]);
        }
    }, [hasUploadFile]);

    const tableColumns: ColumnProps[] = [
        {
            title: "CSV字段",
            dataIndex: "name"
        },
        {
            title: "多维表格字段",
            dataIndex: "name2",
            render: (text: string, record: { key: string; }, index: number) => {
                const id = "tableContent" + record.key;
                const tempData = ["a", "b", "c", "d", "无"]
                return (
                    <Form.Select
                        field={id}
                        // label="工作表"
                        placeholder="选择字段"
                        noLabel={true}
                        // style={{width: "100%"}}
                    >
                        <Form.Select.Option key="wuwu" value="wuwu">
                            无
                        </Form.Select.Option>
                        {Array.isArray(fieldMetaList) &&
                            fieldMetaList.map(({name, id}) => {
                                return (
                                    <Form.Select.Option key={id} value={id}>
                                        {name}
                                    </Form.Select.Option>
                                );
                            })
                        }
                    </Form.Select>
                )
            }
        }
    ]

    const handleRow = (record: any, index: any) => {
        // 给偶数行设置斑马纹
        if (index % 2 === 0) {
            return {
                style: {
                    background: 'var(--semi-color-fill-0)',
                },
            };
        } else {
            return {};
        }
    };

    const scroll = useMemo(() => ({y: 300}), []);

    return (
        <main className="main">
            <h4>
                Edit <code>src/App.tsx</code> and save to reload
            </h4>

            <BillUpload
                data={billData}
                setData={setBillData}
                hasUploadFile={hasUploadFile}
                setHasUploadFile={setHasUploadFile}
            />

            <Form
                labelPosition="top"
                onSubmit={addRecord}
                getFormApi={(baseFormApi: BaseFormApi) =>
                    (formApi.current = baseFormApi)
                }
            >
                {
                    ({formState, values, formApi}) => (
                        <>
                            <Row>
                                <Col span={24}>
                                    {/* 微信默认16 */}
                                    <Form.Select
                                        field="header"
                                        label="csv导入字段"
                                        // placeholder="请选择业务线"
                                        disabled={!hasUploadFile}
                                        onChange={handleHeaderSelectChange}
                                        style={{width: "100%"}}
                                        optionList={headerSelectOption}
                                    ></Form.Select>
                                </Col>
                                <Col span={24}>
                                    <Form.Select
                                        field="table"
                                        label="工作表"
                                        placeholder="Please select a Table"
                                        onChange={getFieldMetaList}
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
                                </Col>
                                <Col span={24}>
                                    <ButtonGroup>
                                        <Button>自动匹配</Button>
                                        <Button>清空</Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>

                            <Table
                                columns={tableColumns}
                                dataSource={tableData}
                                onRow={handleRow}
                                // sticky={{top: 60}}
                                // scroll={scroll}
                                pagination={false}
                            />

                            <Row>
                                <Col>
                                    <Form.Select field='business2' label="索引字段" style={{width: "100%"}}>
                                        {Array.isArray(tableData) &&
                                            tableData.map(({key, name}, index) => {
                                                return (
                                                    <Form.Select.Option key={key} value={key}>
                                                        {name}
                                                    </Form.Select.Option>
                                                );
                                            })
                                        }
                                    </Form.Select>
                                </Col>
                                {/*<Col span={12}>*/}
                                {/*    <Form.Select field="role" label='角色' style={{width: "100%"}}>*/}
                                {/*        <Form.Select.Option value="operate">运营</Form.Select.Option>*/}
                                {/*        <Form.Select.Option value="rd">开发</Form.Select.Option>*/}
                                {/*        <Form.Select.Option value="pm">产品</Form.Select.Option>*/}
                                {/*        <Form.Select.Option value="ued">设计</Form.Select.Option>*/}
                                {/*    </Form.Select>*/}
                                {/*</Col>*/}
                            </Row>


                            <br/>

                            <Button theme="solid" htmlType="submit">
                                Add Record
                            </Button>

                            <br/>

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
