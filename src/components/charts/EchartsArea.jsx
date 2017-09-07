/**
 * Created by hao.cheng on 2017/4/17.
 */
import React from 'react';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import axios from 'axios';
import {parseGraphiteMessage} from "../../utils/nameParse";

let date = [];
let data = [];
let parsedName = [];
let req = 'Graphite_Report.10-10-31-166.com.qunhe.instdeco.plan.fusing.ListRoomTypesCommand.time.count';

function update() {
    data = [];
    date = [];

}

class EchartsArea extends React.Component {

    getOption() {
        axios.get('http://10.1.13.131//render', {
            params: {
                target: req,
                format: 'json',
                from: '-1d',
            }
        }).then(function (response) {
                var res = response.request.responseText;
                var dataJSON = JSON.parse(res)[0];
                parsedName = parseGraphiteMessage(dataJSON.target);
                for (var i = 0; i < dataJSON.datapoints.length; i++) {
                    let dateNow = new Date(1970, 1, 1);
                    let tempDate = new Date(1970, 1, 1);
                    tempDate.setTime(dataJSON.datapoints[i][1] * 1000);
                    dateNow.setTime(Date.now());
                    if (!dataJSON.datapoints[i][0] === 'null') {
                        data.push(dataJSON.datapoints[i][0]);
                    }
                    else {
                        data.push(Math.random() * 1000);
                    }
                    if (dateNow.getMonth() === tempDate.getMonth() && dateNow.getDate() === tempDate.getDate()) {
                        date.push([tempDate.getHours(), tempDate.getMinutes()].join(':'));
                    } else {
                        date.push([[tempDate.getMonth() + 1, tempDate.getDate()].join('/'), [tempDate.getHours(), tempDate.getMinutes()].join(':')].join(' '));
                    }
                }
                console.log(data);
                console.log(date);
                option.title.text = parsedName.funcName;
                option.series.name = parsedName.detailName;
            }
        )
            .catch(function (error) {
                // throw error
            });
        var option = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: parsedName.funcName,
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    restore: {},
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%']
            },
            dataZoom: [{
                type: 'inside',
                start: 90,
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
                    name: parsedName.funcName,
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
                    data: data
                }
            ]
        };
        return option;
    }

    onRestore(param, echart) {
        console.log(param);
        console.log(echart);
    }

    render() {
        update();
        let onEvents = {
            'restore': this.onRestore()
        };
        return (
            <ReactEcharts
                option={this.getOption()}
                style={{height: '300px', width: '100%'}}
                className={'react_for_echarts'}
                onEvents={onEvents}
            />
        )
    }
}

export default EchartsArea;