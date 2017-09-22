/**
 * Created by SEELE on 2017/8/23.
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import {getMeterDataList, init, isUpdated, syncSummary} from "../../utils/index";
import {getBackendServerIp, getUserName} from "../../utils/constants";
import {getIcon} from "../../utils/svgIcon";
import {changeBrightness,mergeColor} from "../../utils/rgbHex";

class EchartsForce extends Component {

    constructor(props) {
        super(props);
        this.state = {
            freshTime: 30000,
            isDone: false,
            isLoaded: false,
            viewDetail:false,
            zoom:0,
        };
        this.Echarts = undefined;
        this.dataAvailable = [];
        this.drawOption = {
            title: {
                text: '当日监控拓扑图'
            },
            tooltip: {},
            label: {
                normal: {
                    position:'bottom',
                    show: false,
                    textStyle: {
                        fontSize: 12
                    },
                }
            },
            series: [

                {
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 45,
                    focusNodeAdjacency: true,
                    roam: true,
                    categories: [{
                        name: '1',
                    }, {
                        name: '2',
                    }, {
                        name: '0',
                    }],
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12
                            },
                        },

                    },
                    force:{
                        initLayout:'circular',
                        repulsion:2000,
                        gravity:0.01,
                        edgeLength:50,
                        layoutAnimation:true,
                    },
                    // edgeSymbolSize: [4, 50],
                    edgeLabel: {
                        normal: {
                            show: false,
                            textStyle: {
                                fontSize: 10
                            },
                            formatter: "{c}"
                        }
                    },
                    data: [],
                    links: [],
                    lineStyle: {
                        normal: {
                            opacity: 0.9,
                            width: 1,
                            curveness: 0
                        }
                    },
                    animationDuration:300,
                    animationDurationUpdate: 200,
                }
            ]
        };
        this.link = [];
        this.forceData = [];
        this.onChartReady = this.onChartReady.bind(this);
        this.update = this.update.bind(this);
        this.tick = this.tick.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onChartReady = this.onChartReady.bind(this);
    }

    componentDidMount() {
        let instance = this;
        this.update();
        if (!isUpdated()){
            init(getBackendServerIp(),function () {
                instance.dataAvailable = getMeterDataList();
                instance.setState({
                    isLoaded: true
                },instance.update);
            });
        } else {
            instance.dataAvailable = getMeterDataList();
            instance.setState({
                isLoaded: true
            },instance.update);
        }
        this.interval = setInterval(this.tick, this.state.freshTime);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.update();
    }

    update() {

        let instance = this;
        this.link = [];
        this.forceData = [];
        if (this.state.isLoaded){
            syncSummary(this.props.graphiteServerIP,function (summaryData) {
                instance.forceData.push(summaryData.forceGraphPointData[getUserName()]);
                for (let i = 0; i < instance.dataAvailable.length; i++) {
                    let service = instance.dataAvailable[i];
                    let serviceName = service.name + " " + service.key;
                    instance.link.push(summaryData.link[serviceName]);
                    instance.forceData.push(summaryData.forceGraphPointData[serviceName]);
                    for (let j = 0; j < service.server.length; j++) {
                        let server = service.server[j];
                        let ipAddress = server.ip + " " + server.key;
                        instance.link.push(summaryData.link[ipAddress]);
                        instance.forceData.push(summaryData.forceGraphPointData[ipAddress]);
                        for (let k = 0; k < server.childService.length; k++) {
                            let childService = server.childService[k];
                            let childServiceName = childService.name + " " + childService.key;
                            instance.link.push(summaryData.link[childServiceName]);
                            instance.forceData.push(summaryData.forceGraphPointData[childServiceName]);
                            for (let l = 0; l < childService.func.length; l++) {
                                let func = childService.func[l];
                                let funcName = func.name + " " + func.key;
                                instance.link.push(summaryData.link[funcName]);
                                instance.forceData.push(summaryData.forceGraphPointData[funcName]);
                            }
                        }
                    }
                }
                instance.setState({
                    isDone:true
                },function () {
                    instance.drawOption.series[0].data = [];
                    instance.drawOption.series[0].links = [];
                    for (let i=0;i<instance.forceData.length;i++){
                        instance.drawOption.series[0].data.push({
                            name:instance.forceData[i].name,
                            category:instance.forceData[i].category,
                            symbol:getIcon(instance.forceData[i].symbol),
                            draggable: false,
                            symbolSize: 60,
                            value:Math.round(instance.forceData[i].value),
                            label:{
                                normal:{
                                    formatter: [
                                        '{name|' + instance.forceData[i].name.split(' ')[0] +'}',
                                        '{count|当日请求数: '+ Math.round(instance.forceData[i].value) + '}'
                                    ].join('\n'),
                                    rich:{
                                        name: {
                                            backgroundColor: '#173ea0',
                                            color: '#fff',
                                            borderRadius: 15,
                                            padding: 5
                                        },
                                        count: {
                                            backgroundColor: '#701234',
                                            color: '#fff',
                                            borderRadius: 15,
                                            padding: 5
                                        }
                                    },
                                    align:'center',
                                }
                            },
                        //     tooltip:{
                        //         formatter:'通过' + instance.forceData[i].name.split(' ')[0] + '的当日请求数: '+ Math.round(instance.forceData[i].value),
                        // },
                            tooltip:{
                                formatter: function (params) {
                                    if (params.dataType === 'node'){
                                        return '当日通过' + params.data.name.split(' ')[0] + "的请求数:" + params.data.value
                                    }
                                    if (params.dataType === 'edge'){
                                        return '从' + params.data.source.split(' ')[0] + ' => ' + params.data.target.split(' ')[0] + '的请求\n'
                                               + '健康率:' + parseFloat(params.data.value.split('\n')[0]).toFixed(2) + '%\n' +
                                               '响应时间:'+ parseFloat(params.data.value.split('\n')[1]).toFixed(2) + ' ms\n';
                                    }
                                }
                            }
                        })
                    }
                    for (let j=0;j<instance.link.length;j++){
                        instance.drawOption.series[0].links.push({
                            value:instance.link[j].normalRate + '\n'+ instance.link[j].responseTime,
                            source:instance.link[j].source,
                            target:instance.link[j].target,
                            lineStyle:{
                              normal:{
                                  color: changeBrightness(mergeColor(instance.link[j].rgb[1],instance.link[j].rgb[0])),
                                  width: 2,
                              }
                            },
                            label:{
                                normal:{
                                    formatter: [
                                        '{rate|健康率: ' + instance.link[j].normalRate.toFixed(2) +'%}',
                                        '{time|响应时间: '+ instance.link[j].responseTime.toFixed(2) + ' ms}'
                                    ].join('\n'),
                                    rich:{
                                        rate: {
                                        backgroundColor: changeBrightness(instance.link[j].rgb[1]),
                                        color: '#fff',
                                        borderRadius: 15,
                                        padding: 5
                                    },
                                        time: {
                                            backgroundColor: changeBrightness(instance.link[j].rgb[0]),
                                            color: '#fff',
                                            borderRadius: 15,
                                            padding: 5
                                        }
                                    }
                                }
                            }
                        });
                    }
                    instance.Echarts.setOption(instance.drawOption);
                })
            });
        }


    }
    onClick(param){
        switch(param.dataType){
            case 'node':
                this.props.onClickCallback(param);
                break;
            default:
                break;
        }
    }
    onGraphRoam(param,echart){ //1.05
        let mZoom = echart._coordSysMgr._coordinateSystems[0]._zoom;
        let tempOption = echart.getOption();
        if (mZoom >= 1.05){
            if (tempOption.series[0].edgeLabel.normal.show === false){
                tempOption.series[0].edgeLabel.normal.show = true;
                echart.setOption(tempOption);
            } else {
                return 0;
            }
        } else {
            if (tempOption.series[0].edgeLabel.normal.show === true){
                tempOption.series[0].edgeLabel.normal.show = false;
                echart.setOption(tempOption);
            } else {
                return 0;
            }
        }
    }
    onChartReady(echart){
        this.Echarts = echart;
        this.Echarts.setOption(this.drawOption);
    }

    render() {
        let onEvents={
            'click':this.onClick,
            'graphRoam':this.onGraphRoam,
        };
        let height = window.innerHeight*0.88.toString()+'px';
        return (
            <ReactEcharts
                option={this.drawOption}
                style={{height: height, width: '100%'}}
                className={'react_for_echarts'}
                onEvents={onEvents}
                onChartReady={this.onChartReady}
            />
        )
    }

}
EchartsForce.propTypes = {
    graphiteServerIP: PropTypes.string,
    onClickCallback:PropTypes.func
};
EchartsForce.defaultProps = {
    graphiteServerIP: '127.0.0.1',
    onClickCallback: function () {}
};
export default EchartsForce;