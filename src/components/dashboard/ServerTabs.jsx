import React, { Component } from 'react';
import {Card,Icon} from 'antd';
import {getMeterDataList, init, isUpdated} from "../../utils/index";
import {SwitchController} from "../switch/SwitchController";
import {getBackendServerIp} from "../../utils/constants";

export class ServerTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded :false
        };
        this.dataAvailable = [];
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

    render(){
        console.log(this.state.isLoaded);
        if (this.state.isLoaded){
            return(
                <div style={{textAlign:'center'}}>
                    <Card style={{fontSize:24,fontWeight:'bold',textAlign:'center'}}>
                        <text >服务器列表</text>
                    </Card>
                    {this.dataAvailable.map(a => {
                            return (
                                <div>
                                    <text style={{fontSize:18,fontWeight:'bold'}}> {a.name}</text>
                                    {a.server.map(b =>
                                        <Card>
                                            <span className="nav-text"><Icon type="setting" /> <text style={{fontSize:14}}> {'Server ' + b.ip } </text> <SwitchController serviceName={a.name} remoteServerIP={b.ip} checkedChildren="开" unCheckedChildren="关" key = {'sw'+b.key} /> </span>
                                        </Card>
                                    )}
                                </div>
                            )
                        }

                    )}
                </div>);
        } else {
            return (<div />)
        }
    }
}