/**
 * Created by hao.cheng on 2017/5/3.
 */
import React from 'react';
import { Row, Col, Card, Icon } from 'antd';

import EchartsForce from "../charts/EchartsForce";


class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <br />
                <Row gutter={16}>
                    <Col span={3} >

                        <Card>
                            <Icon type="database" style={{ color: '#14e963' }}/>这里是所有的服务器列表，用图像颜色来表示健康度
                        </Card>
                        <text> title </text>
                        <Card>
                            666666
                        </Card>
                        <Card>
                            666666
                        </Card>
                        <Card width={960}>
                            666666
                        </Card>
                    </Col>
                    <Col span={16}>
                        <Card>
                            当天从0:00到现在的统计，可以查看历史，一共3天
                            点选任意一个节点可以看到相应的统计，主要是访问时间分布

                            连接线 的值为平均调用所用的时间




                            <EchartsForce />
                        </Card>
                    </Col>
                    <Col span={5} width={480}>
                        <Card>
                            echart http://echarts.baidu.com/demo.html#bar-stack
                            timeline for server
                            直方图分布

                            0-20 21-60 61-100 101-200 201- 500 >500
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Dashboard;