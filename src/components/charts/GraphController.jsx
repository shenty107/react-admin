import React from 'react';
import Echarts from "./Echarts";
import {getBackendServerIp} from "../../utils/nameParse";
import axios from 'axios';
import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;

export class GraphController extends React.Component {
    constructor(props) {
        super(props);
        this.dataAvailable = [];
        this.state = {
            isLoaded: false,
            value:undefined
        };
        this.allEchart = [];
        this.allKey = [];
        this.generateAllEchart = this.generateAllEchart.bind(this);
    }


    componentWillMount() {
        let instance = this;
        axios.get('http://' + getBackendServerIp() + '/getmeterlist').then(function (response) {
            let res = JSON.parse(response.request.responseText);
            instance.dataAvailable = res;
            instance.setState({
                isLoaded: true
            });
        }).catch(function (error) {
            // throw error
        });
    }

    onChange = (value,title) => {
        this.allKey = [];
        for (let i = 0; i < value.length;i++){
            let key = value[i].split('=>')[4];
            this.allKey.push(key);
        }
        this.allKey.sort();
        this.generateAllEchart();
        this.setState({ value });
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
                                    childServiceName:childServiceName
                                };
                                this.allEchart.push(chart);
                            }
                        }
                    }
                }

            }
        }
    }

    render() {
        if (this.state.isLoaded) {
            this.generateAllEchart();
            this.setState({
                isLoaded: false
            });
        }
        return (

            <div >
                <view style={{flex: 1, backgroundColor: 'powderblue'}} >
                    <br /><br />
                    <TreeSelect
                        showSearch
                        style={{ width: '80%', alignItems: 'center'}}
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 960, overflow: 'auto' }}
                        placeholder="Please select"
                        allowClear
                        multiple
                        treeDefaultExpandAll
                        onChange={this.onChange}
                    >
                        {this.dataAvailable.map(a =>
                        <TreeNode value = {a.name} title={a.name} key={a.key} treeCheckable={'true'}>
                            {a.server.map(b =>
                            <TreeNode value = {b.ip} title={b.ip} key={b.key} treeCheckable={'true'}>
                                {b.childService.map(c=>
                                    <TreeNode value = {b.ip +"-"+ c.name} title={c.name} key={c.key} treeCheckable={'true'}>
                                        {c.func.map(d=>
                                            <TreeNode value = {b.ip +"-"+ c.name + "-"+d.name} title={d.name} key={d.key} treeCheckable={'true'}>
                                                {d.index.map(e=>
                                                    <TreeNode value = {b.ip +"=>"+ c.name + "=>"+d.name+"=>"+e.name + "=>" + e.key} title={e.name} key={e.key} treeCheckable={'true'} />
                                                )}
                                            </TreeNode>
                                        )}
                                    </TreeNode>
                                )}
                            </TreeNode>)}
                        </TreeNode>
                        )}
                    </TreeSelect>
                    <br /><br />
                </view>
                {this.allEchart.map(d =>
                    <Echarts
                    graphiteServerIP={d.graphiteServerIP}
                    askFormat={d.askFormat}
                    targetFuncName={d.targetFuncName}
                    detailName={d.detailName}
                    serviceName={d.serviceName}
                    fullName={d.fullName}
                    />)
                }
            </div>

        )
    }

}