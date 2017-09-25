import React, { Component } from 'react';
import {Card,Icon,Row} from 'antd';
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
        if (this.state.isLoaded){
            return(
                <div style={{textAlign:'center'}}>
                    <div style={{fontSize:24,fontWeight:'bold',textAlign:'center',height: 48,color:'#fff'}}>
                        <text style={{fontSize:24,fontWeight:'bold',textAlign:'center',height: 48,color:'#fff'}}>服务器列表</text>
                    </div>
                    {this.dataAvailable.map(a => {
                            return (
                                <div>
                                    <Card style={{backgroundColor:'#525252'}} bordered={false}>
                                        <Row gutter={24} style={{height:48,color:'#fff'}}>
                                        <text style={{fontSize:18,fontWeight:'bold',color:'#fff'}}> {a.name}</text>
                                        </Row>
                                        {a.server.map(b =>
                                            <Row gutter={24} style={{height:48,color:'#fff'}}>
                                                <span className="nav-text"><Icon type="setting" style={{fontSize:18,color:'#fff'}} /> <text style={{fontSize:18,color:'#fff'}}> {b.ip } </text> <SwitchController serviceName={a.name} remoteServerIP={b.ip} checkedChildren="开" unCheckedChildren="关" key = {'sw'+b.key} /> </span>
                                            </Row>
                                        )}

                                    </Card>
                                    <div style={{height: 16}}>
                                    </div>
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