import React from 'react';
import Echarts from "./Echarts";
import {getBackendServerIp, getDefaultMeterValue} from "../../utils/constants";
import { TreeSelect,Row } from 'antd';
import {init,getMeterDataList,isUpdated} from "../../utils/index";
import { Menu, Icon,Switch } from 'antd';
import {SwitchController} from "../switch/SwitchController";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const TreeNode = TreeSelect.TreeNode;

export class GraphController extends React.Component {
    constructor(props) {
        super(props);
        this.dataAvailable = [];
        this.state = {
            isLoaded: false,
            value:undefined,
            current:undefined,
            isFusing:true,
            isSwitchLoaded:false
        };
        this.allEchart = [];
        this.allKey = [];
        this.generateAllEchart = this.generateAllEchart.bind(this);
        this.changeFusing = this.changeFusing.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.id !== this.props.params.id){
            this.setState({
                value:[]
            },this.onChange([]));
            this.setState({
                current:undefined
            })
        }
    }
    componentWillMount() {
        let instance = this;
        if (!isUpdated()){
            init(getBackendServerIp(),function () {
                instance.dataAvailable = getMeterDataList();
                instance.setState({
                    isLoaded: true
                });
            });
        } else {
            instance.dataAvailable = getMeterDataList();
            instance.setState({
                isLoaded: true
            });
        }
    }

    onChange = (value,title) => {
        this.allKey = [];
        for (let i = 0; i < value.length;i++){
            let key = value[i].split('=>')[1];
            this.allKey.push(key);
        }
        this.allKey.sort();
        this.generateAllEchart();
        this.setState({ value });
    };

    handleClick = (e) => {
        let defaultValue=[];
        this.setState({
            current: e.key,
        });
        let selectKeys = e.key.split('-');
        this.dataAvailable[selectKeys[0]].server[selectKeys[1]].childService[selectKeys[2]].func[selectKeys[3]].index.map(a =>
        defaultValue.push(a.name + "=>" + a.key));
        let finalValue = [];
        let defaultMeterValue=getDefaultMeterValue();
        for (let i =0;i < defaultMeterValue.length;i ++){
            finalValue.push(defaultValue[defaultMeterValue[i]]);
        }
        this.setState({
            value:finalValue
        },this.onChange(finalValue))
    };

    generateAllEchart() {
        this.allEchart = [];
        for (let i = 0; i < this.dataAvailable.length; i++) {
            let service = this.dataAvailable[i];
            let serviceName = service.name;
            for (let j = 0; j < service.server.length; j++) {
                let server = service.server[j];
                let ipAddress = server.ip;
                for (let k = 0; k < server.childService.length; k++) {
                    let childService = server.childService[k];
                    let childServiceName = childService.name;
                    for (let l = 0; l < childService.func.length; l++) {
                        let func = childService.func[l];
                        let funcName = func.name;
                        for (let m = 0; m < func.index.length; m++) {
                            let detailName = func.index[m].name;
                            let fullName = func.index[m].fullName;
                            func.index[m].active = false;
                            for (let n=0;n<this.allKey.length;n++){
                                if (func.index[m].key === this.allKey[n])
                                {
                                    func.index[m].active = true;
                                    break;
                                }
                            }
                            if (func.index[m].active) {
                                let chart = {
                                    graphiteServerIP: getBackendServerIp(),
                                    askFormat: 'json',
                                    targetFuncName: funcName,
                                    detailName: detailName,
                                    serviceName: serviceName,
                                    fullName: fullName,
                                    ipAddress:ipAddress,
                                    childServiceName:childServiceName,
                                    key:func.index[m].key
                                };
                                this.allEchart.push(chart);
                            }
                        }
                    }
                }

            }
        }
    }

    getFusingStatus(){

    }

    changeFusing(value){
        console.log(value);
        console.log(this.antSwitch);
    }

    createMenu(){
        if (this.state.isLoaded){
            // this.setState({
            //     isLoaded: false
            // });
            return (this.dataAvailable[this.props.params.id].server.map(b =>
                            <SubMenu title={<span className="nav-text"><Icon type="setting" />{'Server ' + b.ip + '      ┃     '} <SwitchController serviceName={this.dataAvailable[this.props.params.id].name} remoteServerIP={b.ip} checkedChildren="开" unCheckedChildren="关" key = {'sw'+b.key} /> </span>} key={b.key} >
                                {b.childService.map(c=>
                                    <MenuItemGroup title={<span className="nav-text">{c.name}</span>} key={c.key} >
                                        {c.func.map(d=>
                                            <Menu.Item  key={d.key}>
                                                <span className="nav-text">{d.name}</span>
                                            </Menu.Item>
                                        )}
                                    </MenuItemGroup>
                                )}
                            </SubMenu>)
                )

        }
        return (null)
    }
    renderTreeSelect(){
        if (this.state.current === undefined){
            return ( <br />);
        } else {
            let selectKeys = this.state.current.split('-');
            return (
                <view>
                    <br /><br />
                    <TreeSelect
                        showSearch
                        style={{ width: '60%', alignItems: 'center'}}
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 480, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        onChange={this.onChange}
                    >
                        {this.dataAvailable[selectKeys[0]].server[selectKeys[1]].childService[selectKeys[2]].func[selectKeys[3]].index.map(a =>
                            <TreeNode value = {a.name + "=>" + a.key} title={a.name} key={a.key} treeCheckable={'true'}>
                                {/*{a.index.map(b =>*/}
                                    {/*<TreeNode value = {b.ip} title={b.ip} key={b.key} treeCheckable={'true'}>*/}
                                        {/*{b.childService.map(c=>*/}
                                            {/*<TreeNode value = {b.ip +"-"+ c.name} title={c.name} key={c.key} treeCheckable={'true'}>*/}
                                                {/*{c.func.map(d=>*/}
                                                    {/*<TreeNode value = {b.ip +"-"+ c.name + "-"+d.name} title={d.name} key={d.key} treeCheckable={'true'}>*/}
                                                        {/*{d.index.map(e=>*/}
                                                            {/*<TreeNode value = {b.ip +"=>"+ c.name + "=>"+d.name+"=>"+e.name + "=>" + e.key} title={e.name} key={e.key} treeCheckable={'true'} />*/}
                                                        {/*)}*/}
                                                    {/*</TreeNode>*/}
                                                {/*)}*/}
                                            {/*</TreeNode>*/}
                                        {/*)}*/}
                                    {/*</TreeNode>)}*/}
                            </TreeNode>
                        )}
                    </TreeSelect>
                    <br /><br />
                </view>
            )
        }
    }
    render() {
        if (this.state.isLoaded) {
            this.generateAllEchart();
        }
        console.log(this.state.isFusing);
        return (
            <div >
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    className={'ant-layout-sider-collapsed'}
                >
                    {this.createMenu()}
                </Menu>
                {this.renderTreeSelect()}
                <Row gutter={24}>
                {this.allEchart.map(d =>
                    <Echarts key={d.key}
                    graphiteServerIP={d.graphiteServerIP}
                    askFormat={d.askFormat}
                    targetFuncName={d.targetFuncName}
                    detailName={d.detailName}
                    serviceName={d.serviceName}
                    fullName={d.fullName}
                    />)
                }
                </Row>
            </div>

        )
    }

}