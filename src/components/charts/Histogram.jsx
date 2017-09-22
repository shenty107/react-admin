import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import {Spin} from 'antd';

export class Histogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
        this.Echarts = undefined;
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
                    let tar = params[1];
                    return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
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
                data : ['总请求数','0~5ms','5~20ms','20~50ms','50~100ms','> 100 ms',]
            },
            yAxis: {
                type : 'value'
            },
            series: [
                {
                    name: '辅助',
                    type: 'bar',
                    stack:  '总量',
                    itemStyle: {
                        normal: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: []
                },
                {
                    name: '请求数',
                    type: 'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
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
        this.Echarts.setOption(this.option);
    }
    parsedata(){


        if (this.props.data.length > 0){
            let tempData=[];
            let sum=0;
            let supportData=[];
            this.props.data.map(d => {
                if (parseInt(d,10) > 0){
                    sum+=Math.round(d);
                    tempData.push(Math.round(d))
                } else {
                    tempData.push(0)
                }
                return d;
            });
            let previous = sum;
            tempData.map(d => {
                if (d>0){
                    supportData.push(previous - d);
                    previous -= d;
                } else {
                    supportData.push(0);
                }

                return previous;
            });
            tempData.unshift(sum);
            supportData.unshift(0);
            //for support data
            this.option.series[0].data = supportData;
            this.option.series[1].data = tempData;
        }

        this.setState({
            isLoaded:true
        })
    }
    render(){
        let height = window.innerHeight*0.85.toString()+'px';
        return (

            <
                ReactEcharts
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