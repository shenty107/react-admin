/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { Component } from 'react';
import { Layout, Menu, Icon,Switch,Card,Dropdown} from 'antd';
import { Link } from 'react-router';
import {init,getMeterDataList,isUpdated} from "../utils/index";
import {getBackendServerIp} from "../utils/constants";
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {

    constructor(props) {
        super(props);
        this.dataAvailable = {};
        this.state = {
            collapsed: false,
            mode: 'inline',
            openKey: '',
            selectedKey: '',
            isLoaded: false,
            isFusing: false,
        };

        this.createMenu = this.createMenu.bind(this);
        this.createSummaryMenu = this.createSummaryMenu.bind(this);
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

    componentDidMount() {
        this.setMenuOpen(this.props);
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }
    setMenuOpen = props => {
        const {path} = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        console.log(this.state);
        const { popoverHide } = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };

    openMenu = v => {
        console.log(v);
        this.setState({
            openKey: v[v.length - 1]
        })
    };

    createMenu() {
        if (this.state.isLoaded){
            return (
                this.dataAvailable.map(a =>
                    <SubMenu  title={a.name} key={a.key} >
                        {a.server.map(b =>
                            <SubMenu title={b.ip} key={b.key} >
                                {b.childService.map(c=>
                                    <SubMenu title={c.name} key={c.key} >
                                        {c.func.map(d=>
                                            <Menu.Item title={d.name} key={d.key}>

                                            </Menu.Item>
                                        )}
                                    </SubMenu>
                                )}
                            </SubMenu>)}
                    </SubMenu>
                )
            )
        }
        return (<text>loading..</text>)
    }

    createSummaryMenu() {
        if (this.state.isLoaded){
            return (
                this.dataAvailable.map(a =>
                    <Menu.Item key = {"/app/chart/echarts/" + a.key}>
                        <Link to={"/app/chart/echarts/" + a.key}><span className="nav-text">{a.name}</span></Link>
                    </Menu.Item>)
            );
        }
        return (null);
    }

    render() {
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto',
                    background: '#ffffff'}}
            >
                <br />

                <br />

                <Menu
                    onClick={this.menuClick}
                    theme="light"
                    mode={this.state.mode}
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={[this.state.openKey]}
                    onOpenChange={this.openMenu}
                    defaultOpenKeys={['/app/chart']}
                    className={'ant-layout-sider-collapsed'}
                >
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="appstore" /><span className="nav-text">Dashboard</span></Link>
                    </Menu.Item>
                    <SubMenu
                        key="/app/chart"
                        title={<span><Icon type="area-chart" /><span className="nav-text">服务列表</span></span>}
                    >
                        {this.createSummaryMenu()}
                    </SubMenu>
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;