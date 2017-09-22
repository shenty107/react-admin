/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import {Card, Col, Layout, Row} from 'antd';
import { Menu, Icon, Button } from 'antd';
import EchartsForce from "../charts/EchartsForce";
import {getBackendServerIp} from "../../utils/constants";
import {InnerTab} from "../charts/InnerTab";
import {ServerTabs} from "./ServerTabs";
const SubMenu = Menu.SubMenu;
const { Header, Content, Sider } = Layout;
const CustomizedSider = (props) => <Sider {...props} />
CustomizedSider.__ANT_LAYOUT_SIDER = true;
class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: true,
            isDetailView: false,
            rightSiderCollapsed:true,
        };
        this.onClick = this.onClick.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getTabAddFunc = this.getTabAddFunc.bind(this);
        this.onCollapse = this.onCollapse.bind(this);
        this.add = undefined;
        this.key = ''
    }


    onClick(param) {
        let instance = this;
        this.setState({
            rightSiderCollapsed: false
        }, function () {
            instance.add(param.name);
        });
    }

    handleClick(param) {
        this.setState({
            rightSiderCollapsed: false
        });
    }

    getTabAddFunc(func) {
        this.add = func;
    }

    onCollapse(rightSiderCollapsed){
        this.setState({rightSiderCollapsed});
    }

    render() {
        let width = window.innerWidth*0.48;
        if (this.state.rightSiderCollapsed) {
            return (
                <Layout>
                    <Header className="header" style={{height:16 ,backgroundColor:'#ECECEC'}}>
                        <div />
                    </Header>
                    <Layout style={{ padding: '0 0px 0px' }}>
                        <Content style={{ padding: 0, margin: 0, minHeight: 280 }}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Card>
                                        <EchartsForce
                                            graphiteServerIP={getBackendServerIp()}
                                            onClickCallback={this.onClick}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Content>
                        <CustomizedSider
                            collapsed={this.state.rightSiderCollapsed}
                            onCollapse={this.onCollapse}
                            collapsible
                            reverseArrow
                            width={20}
                            style={{backgroundColor:'#ECECEC', marginTop: -16}}
                        >
                            <InnerTab visible={false} passAddFunc={this.getTabAddFunc} parentObject={this} />
                        </CustomizedSider>
                    </Layout>
                </Layout>
            )
        } else {
            return (
                <Layout>
                    <Header className="header" style={{height:16 ,backgroundColor:'#ECECEC'}}>
                        <div />
                    </Header>
                    <Layout style={{ padding: '0 0px 0px' }}>
                        <Content style={{ padding: 0, margin: 0, minHeight: 280}}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Card>
                                        <EchartsForce
                                            graphiteServerIP={getBackendServerIp()}
                                            onClickCallback={this.onClick}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Content>
                        <CustomizedSider
                            style={{backgroundColor:'#ECECEC',marginLeft:16}}
                            collapsed={this.state.rightSiderCollapsed}
                            onCollapse={this.onCollapse}
                            collapsible
                            reverseArrow
                            width={width}
                        >
                            <InnerTab
                                passAddFunc={this.getTabAddFunc}
                                parentObject={this}
                                show
                                style={{backgroundColor:'#ECECEC'}}
                            />
                        </CustomizedSider>
                    </Layout>
                </Layout>)
        }

    }
}

export default Dashboard;