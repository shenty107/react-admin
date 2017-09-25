import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';

export class Histogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
        this.Echarts = undefined;
        this.axis = ['总请求数','0~5ms','5~20ms','20~50ms','50~100ms','> 100 ms'];
        this.option = {
            title: {
                text: '请求响应时间分布直方图',
                subtext: this.props.nav,
                textStyle:{
                    align:'center',
                },
                subtextStyle:{
                    align:'center',
                }
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    if (params[0].dataIndex > 0){
                        let tar = params[params[0].dataIndex - 1];
                        return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
                    } else {
                        let axis = params[params.length - 1].seriesName.split(',');
                        let returnDesciption = '';
                        for (let i = 1 ;i<params.length;i++){
                            returnDesciption += axis[i] + params[i - 1].seriesName + ' : ' + params[i - 1].value + '<br />';
                        }
                        returnDesciption = axis[0] + ' : ' + params[params.length - 1].value + '<br />' + returnDesciption;
                        return returnDesciption;
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type : 'category',
                splitLine: {show:false},
                data : this.axis
            },
            yAxis: {
                type : 'value'
            },
            series: [
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#5eff57'
                        }
                    },
                    label:{
                        normal: {
                            show: false,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                },
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#c6ff50'
                        }
                    },
                    label:{
                        normal: {
                            show: false,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                },
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#faf60f'
                        }
                    },
                    label:{
                        normal: {
                            show: false,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                },
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#ffb463'
                        }
                    },
                    label:{
                        normal: {
                            show: false,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                },
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            show: true,
                            color: '#ff594b'
                        }
                    },
                    label:{
                        normal: {
                            show: false,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                },
                {
                    name: this.axis,
                    type: 'bar',
                    stack: '辅助',
                    itemStyle: {
                        normal: {
                            show: false,
                            position: 'inside',
                            color: 'rgba(0,0,0,0)',
                        }
                    },
                    barGap:'-100%',
                    label:{
                        normal: {
                            show: true,
                            position: 'top',
                            color: '#000000'
                        }
                    },
                    data:[]
                }
            ]
        };
        this.parsedata = this.parsedata.bind(this);
        this.onChartReady = this.onChartReady.bind(this);
    }
    componentDidMount(){
        this.parsedata();
    }
    onChartReady(echart){
        this.Echarts = echart;
        this.Echarts.setOption(this.option,true);
    }
    parsedata(){
        if (this.props.data.length > 0){
            let i=1;
            let sum=0;
            this.props.data.map(d => {
                let tempData = new Array(this.axis.length + 1).join(0).split('');
                if (parseInt(d,10) >= 0){
                    tempData[i] = Math.round(d);
                    tempData[0] = Math.round(d);
                    sum+=Math.round(d);
                }
                this.option.series[i - 1].data = tempData;
                i++;
                return d;
            });
            let tempData=[];
            this.props.data.forEach(function (element) {
                tempData.push(Math.round(element));
            });
            tempData.unshift(sum);
            this.option.series[i - 1].data = tempData;
            // let previous = sum;
            // tempData.map(d => {
            //     if (d>0){
            //         supportData.push(previous - d);
            //         previous -= d;
            //     } else {
            //         supportData.push(0);
            //     }
            //
            //     return previous;
            // });
            // tempData.unshift(sum);
            // supportData.unshift(0);
            // //for support data
            // this.option.series[0].data = supportData;
            // this.option.series[1].data = tempData;
        }

        this.setState({
            isLoaded:true
        })
    }
    render(){
        let height = window.innerHeight*0.85.toString()+'px';
        return (
            <ReactEcharts
                option={this.option}
                style={{height: height, width: '100%'}}
                className={'react_for_echarts'}
                onChartReady={this.onChartReady}
            />

        );
    }
}
Histogram.propTypes = {
    data:PropTypes.array,
    nav:PropTypes.string
};
Histogram.defaultProps = {
    data: [1200, 300, 200, 900, 300],
};