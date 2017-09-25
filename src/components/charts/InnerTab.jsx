import React, { Component } from 'react';
import { Card,Tabs,Spin } from 'antd';
import {getMeterDataList, getSummary} from "../../utils/index";
import PropTypes from 'prop-types';
import {Histogram} from "./Histogram";
import { Radio } from 'antd';
import {GraphController} from "./GraphController";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
export class InnerTab extends Component {
    constructor(props) {
        super(props);
        this.newTabIndex = 0;
        const panes = [
        ];
        this.state = {
            activeKey: undefined,
            isLoaded:true,
            panes,
        };
        this.add = this.add.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
    }
    componentDidMount() {
        this.props.passAddFunc(this.add);
    }
    onChange = (activeKey) => {
        this.setState({ activeKey });
    };
    onEdit = (targetKey, action) => {
        this[action](targetKey);
    };
    onRadioChange = (radio) => {

        this.setState({isLoaded:false});
        let panes = this.state.panes;
        let name = radio.target.name;
        switch(radio.target.value){
            case 'a':
                for (let i =0 ;i<panes.length;i++) {
                    if (panes[i].key === name){
                        panes[i].content = (
                            <Card
                                bordered = {true}
                                style={{marginTop:-16}}
                                bodyStyle={{textAlign:'center'}}
                            >
                                <RadioGroup onChange={this.onRadioChange} defaultValue="a" name={panes[i].key}>
                                    <RadioButton value="a">统计直方图</RadioButton>
                                    <RadioButton value="b" disabled={panes[i].nameData.length!==4}>具体监控图</RadioButton>
                                </RadioGroup>
                                <Histogram data={getSummary().histogramData[panes[i].key].tiers} nav={panes[i].nameData.join(" > ")} />
                            </Card>
                        )
                    }
                }
                break;
            case 'b':
                for (let i =0 ;i<panes.length;i++) {
                    if (panes[i].key === name){
                        panes[i].content = (
                            <Card
                                bordered = {true}
                                style={{marginTop:-16}}
                                bodyStyle={{textAlign:'center'}}
                            >
                                <RadioGroup onChange={this.onRadioChange} defaultValue="b" name={panes[i].key}>
                                    <RadioButton value="a">统计直方图</RadioButton>
                                    <RadioButton value="b" disabled={panes[i].nameData.length!==4}>具体监控图</RadioButton>
                                </RadioGroup>
                                <div style={{minHeight:window.innerHeight*0.85.toString()+'px',maxHeight:window.innerHeight*0.85.toString()+'px',overflow: 'scroll'}}>
                                    <GraphController innerPage targetFunc={panes[i].key} nav={panes[i].nameData.join(" > ")} />
                                </div>
                            </Card>
                        )
                    }
                }
                break;
            default:
                break;
        }
        this.setState({
            panes:panes,
            isLoaded:true
        });
    };
    add = (param) => {
        const panes = this.state.panes;
        const activeKey = param;
        let isSelected = false;
        this.state.panes.map(p => {
            if (p.key===param){
                isSelected =true;
            }
            return isSelected;
        });
        if (!isSelected){
            let name = param.split(' ')[0];
            if (param.split(' ')[1] === undefined){
                panes.push({ title: name, content: (
                    <Card
                        bordered = {true}
                        style={{marginTop:-16}}
                        bodyStyle={{textAlign:'center'}}
                    >
                        <RadioGroup onChange={this.onRadioChange} defaultValue="a" name={param}>
                            <RadioButton value="a">统计直方图</RadioButton>
                            <RadioButton value="b" disabled={param.length!==4}>具体监控图</RadioButton>
                        </RadioGroup>
                        <Histogram data={getSummary().histogramData[param].tiers } nav={param} />
                    </Card>//TODO histogram
                ), key: activeKey ,isDetail:false});
            } else {
                let num = param.split(' ')[1].split('-');
                let nameData = [];
                let listData = getMeterDataList();
                for (let i=0;i<num.length;i++){
                    switch (i){
                        case 0:
                            nameData.push(listData[num[0]].name);
                            break;
                        case 1:
                            nameData.push(listData[num[0]].server[num[1]].ip);
                            break;
                        case 2:
                            nameData.push(listData[num[0]].server[num[1]].childService[num[2]].name);
                            break;
                        case 3:
                            nameData.push(listData[num[0]].server[num[1]].childService[num[2]].func[num[3]].name);
                            break;
                        default:
                            break;
                    }
                }
                    panes.push({ title: name, content: (
                        <Card
                            bordered = {true}
                            style={{marginTop:-16}}
                            bodyStyle={{textAlign:'center',minHeight:500}}
                        >
                            <RadioGroup onChange={this.onRadioChange} defaultValue="a" name={param}>
                                <RadioButton value="a">统计直方图</RadioButton>
                                <RadioButton value="b" disabled={nameData.length!==4}>具体监控图</RadioButton>
                            </RadioGroup>
                            <Histogram data={getSummary().histogramData[param].tiers} nav={nameData.join(" > ")} />
                        </Card>
                    ), key: activeKey, nameData:nameData});

            }
        }
        this.setState({ panes, activeKey });
    };
    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        if (panes.length === 0){
            this.props.parentObject.setState({rightSiderCollapsed:true});
        }
        this.setState({ panes, activeKey });
    };

    render(){
        if (this.props.show){
            return (
                <Spin spinning={!this.state.isLoaded} delay={200}>
                <Tabs
                    hideAdd
                    onChange={this.onChange}
                    activeKey={this.state.activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                >
                    {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
                </Tabs>
                </Spin>
            )
        } else {
            return (<div />)
        }

    }
}
InnerTab.propTypes = {
    passAddFunc:PropTypes.func,
    parentObject:PropTypes.object,
    show:PropTypes.bool,
};
InnerTab.defaultProps = {
    parentObject:undefined,
    show: false,
};
