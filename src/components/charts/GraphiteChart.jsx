import React from 'react';
import axios from 'axios';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import PropTypes from 'prop-types';

class GraphiteChart extends React.Component {
    constructor(props) {
        super(props);

        // 设置 initial state
        this.state = {
            timeFrom: '-15min',
            timeUntil: '',
            flashTime: 30000,
        };

        this.drawOption = {
            tooltip: {
                trigger: 'axis',
                position: function (pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: this.props.targetFuncName,
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
                start: 50,
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
    }

    componentDidMount() {
        this.update();
        this.interval = setInterval(this.tick, this.state.flashTime);
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

    setTimeFrom(mtimeFrom) {
        this.setState({
            timeFrom: mtimeFrom
        }, this.update);
    }

    setTimeUntil(mtimeUntil) {
        this.setState({
            timeUntil: mtimeUntil
        }, this.update);
    }

    update() {
        let eChart = this.Echarts.getEchartsInstance();
        let instance = this;
        axios.get(this.props.graphiteServerIP + '/render', {
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
                    let data = [];
                    let date = [];
                    // console.log(data);
                    // console.log(date);
                    for (let j = 0; j < dataJSON.datapoints.length; j++) {
                        let dateNow = new Date(1970, 1, 1);
                        let tempDate = new Date(1970, 1, 1);
                        tempDate.setTime(dataJSON.datapoints[j][1] * 1000);
                        dateNow.setTime(Date.now());
                        data.push(dataJSON.datapoints[j][0]);
                        if (dateNow.getMonth() === tempDate.getMonth() && dateNow.getDate() === tempDate.getDate()) {
                            date.push([tempDate.getHours(), tempDate.getMinutes()].join(':'));
                        } else {
                            date.push([[tempDate.getMonth() + 1, tempDate.getDate()].join('/'), [tempDate.getHours(), tempDate.getMinutes()].join(':')].join(' '));
                        }
                    }

                    instance.drawOption.xAxis.data = date;
                    instance.drawOption.series[0].data = data;
                    instance.drawOption.dataZoom = eChart.getOption().dataZoom;
                    eChart.setOption(instance.drawOption, {
                        notMerge: true,
                        lazyUpdate: false,
                        silent: false
                    });
                }
            }
        ).catch(function (error) {
            // throw error
        });
    }

    render() {
        let onEvents = {
            'restore': this.onRestore
        };
        return (
            <ReactEcharts
                option={this.drawOption}
                ref={(c) => {
                    this.Echarts = c;
                }}
                style={{height: '300px', width: '100%'}}
                className={'react_for_echarts'}
                onEvents={onEvents}
            />
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