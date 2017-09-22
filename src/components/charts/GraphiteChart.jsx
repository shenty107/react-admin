import React from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import PropTypes from 'prop-types';
import {Spin} from 'antd';
import {getValueFormat} from "../../utils/constants";

class GraphiteChart extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            timeFrom: '-15min',
            timeUntil: '',
            freshTime: 30000,
            loading: true,
        };
        this.data = [];
        this.date = [];
        this.drawOption = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                },
                formatter:'null',
            },
            title: {
                left: 'center',
                text: [this.props.targetFuncName, this.props.detailName].join(' - '),
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    restore: {
                        title: '刷新'
                    },

                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: [1]
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 0,
                end: 100
            }, {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }],
            series: [
                {
                    name: this.props.detailName,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgb(255, 158, 68)'
                            }, {
                                offset: 1,
                                color: 'rgb(255, 70, 131)'
                            }])
                        }
                    },
                    data: [1]
                }
            ]

        };
        // ES6 类中函数必须手动绑定
        this.onRestore = this.onRestore.bind(this);
        this.update = this.update.bind(this);
        this.tick = this.tick.bind(this);
        this.setTimeFrom = this.setTimeFrom.bind(this);
        this.setTimeUntil = this.setTimeUntil.bind(this);
        this.getMeterData = this.getMeterData.bind(this);
        this.onChartReady = this.onChartReady.bind(this);
        this.renderController = this.renderController.bind(this);
    }

    componentDidMount() {
        this.update();
        this.interval = setInterval(this.tick, this.state.freshTime);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick() {
        this.update();
    }


    onRestore(parma, eChart) {
        this.update();
    }

    setTimeFrom(mTimeFrom) {
        this.setState({
            timeFrom: mTimeFrom
        }, this.update);
    }

    setTimeUntil(mTimeUntil) {
        this.setState({
            timeUntil: mTimeUntil
        }, this.update);

    }

    getMeterData(callback) {
        if (this.Echarts !== undefined){
            // console.log(this.Echarts.getEchartsInstance().getOption());
        }
        this.data = [];
        this.date = [];
        let instance = this;
        axios.get('http://' + this.props.graphiteServerIP + '/getmeterdata', {
            params: {
                target: this.props.fullName,
                format: this.props.askFormat,
                from: this.state.timeFrom,
                until: this.state.timeUntil,
            }
        }).then(function (response) {
            let res = JSON.parse(response.request.responseText);
            for (let i = 0; i < res.length; i++) {
                let dataJSON = res[i];
                let isNull = true;
                for (let j = 0; j < dataJSON.datapoints.length; j++) {
                    let dateNow = new Date(1970, 1, 1);
                    let tempDate = new Date(1970, 1, 1);
                    tempDate.setTime(dataJSON.datapoints[j][1] * 1000);
                    dateNow.setTime(Date.now());
                    if (dataJSON.datapoints[j][0] !== "-1") {
                        instance.data.push(dataJSON.datapoints[j][0]);
                        isNull = false;
                    } else {
                        instance.data.push('-');
                    }
                    if (dateNow.getMonth() === tempDate.getMonth() && dateNow.getDate() === tempDate.getDate()) {
                        if (parseInt(tempDate.getMinutes(),10) < 10){
                            instance.date.push([tempDate.getHours(), '0'+tempDate.getMinutes()].join(':'));
                        } else {
                            instance.date.push([tempDate.getHours(), tempDate.getMinutes()].join(':'));
                        }

                    } else {
                        if (parseInt(tempDate.getMinutes(),10) < 10){
                            instance.date.push([[tempDate.getMonth() + 1, tempDate.getDate()].join('/'), [tempDate.getHours(), '0'+tempDate.getMinutes()].join(':')].join(' '));

                        } else {
                            instance.date.push([[tempDate.getMonth() + 1, tempDate.getDate()].join('/'), [tempDate.getHours(), tempDate.getMinutes()].join(':')].join(' '));

                        }
                    }
                }
                if (isNull){
                    instance.data[0] = '0';
                }
            }
            callback();
        }).catch(function (error) {
            return false;
        });

        return true;
    }

    update() {
        let instance = this;
        this.getMeterData(function () {
            let tempFormat = getValueFormat();
            let format = [];

            for (let i =0;i < tempFormat.length; i++){
                if (tempFormat[i].index === instance.props.detailName){
                    format = tempFormat[i];
                    break;
                }
            }
            let tempOption = instance.drawOption;

            tempOption.tooltip.formatter = function (params) {
                let res = [];
                for (let i = 0, l = params.length; i < l; i++) {
                    res += format.name + ' : ' + params[i].value + format.format;
                }
                return res;
            };

            tempOption.xAxis.data = instance.date;
            tempOption.series[0].data = instance.data;
            tempOption.title.text = [instance.props.targetFuncName, format.name].join(' - ');
            tempOption.series.name = format.name;
            if (instance.Echarts!==undefined){
                tempOption.dataZoom = instance.Echarts.getOption().dataZoom;
            }
            instance.drawOption = tempOption;
            instance.setState({
                loading:false,
            });
        });
    }

    onChartReady(echart){
        this.Echarts = echart;
        this.Echarts.setOption(this.drawOption);
        // this.update(echart);
    }
    renderController(){
        let onEvents = {
            'restore': this.onRestore
        };
        if (this.state.loading){
            return (<Spin>loading...</Spin>);
        } else {
            if (this.Echarts !== undefined){
                this.Echarts.setOption(this.drawOption);
            }
            return(
                <ReactEcharts
                    option={this.drawOption}
                    // ref={(c) => {
                    //     this.Echarts = c;
                    // }}
                    style={{height: '300px', width: '100%'}}
                    className={'react_for_echarts'}
                    onEvents={onEvents}
                    onChartReady={this.onChartReady}
                />
            )
        }
    }
    render() {
        return (
            this.renderController()
        )
    }
}

GraphiteChart.propTypes = {
    graphiteServerIP: PropTypes.string,
    askFormat: PropTypes.string,
    targetFuncName: PropTypes.string,
    detailName: PropTypes.string,
    serviceName: PropTypes.string,
    fullName: PropTypes.string
};
GraphiteChart.defaultProps = {
    graphiteServerIP: '127.0.0.1',
    askFormat: 'json',
    targetFuncName: 'test',
    detailName: 'testCount',
    serviceName: 'com.qunhe.test',
    fullName: 'Graphite.local.com.qunhe.test.test.testCount'
};

export default GraphiteChart;