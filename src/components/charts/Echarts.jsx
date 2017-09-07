/**
 * Created by hao.cheng on 2017/4/17.
 */
import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Menu, Row} from 'antd';
import GraphiteChart from "./GraphiteChart";

class Echarts extends React.Component {
    handleMenuClick = (e) => {
        switch (e.key) {
            case '1':
                this.chartPointer.setTimeFrom('-15min');
                break;
            case '2':
                this.chartPointer.setTimeFrom('-2h');
                break;
            case '3':
                this.chartPointer.setTimeFrom('-1d');
                break;
            default:
                break;
        }
    };

    constructor(props) {
        super(props);
        this.chartPointer = '';

        this.refCallback = this.refCallback.bind(this);
    }

    componentDidMount() {
        console.log(this);
    }

    refCallback(instance) {
        this.chartPointer = instance;
    }
    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">15分钟</Menu.Item>
                <Menu.Item key="2">2小时</Menu.Item>
                <Menu.Item key="3">1天</Menu.Item>
            </Menu>
        );
        return (
            <div className="gutter-example">
                <Row gutter={16}>
                    <Col className="gutter-row" md={24}>
                        <div className="gutter-box">
                            <Card title="com.qunhe.instdeco.plan.fusing" bordered={false} extra=
                                {
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            起始时间 <Icon type="down"/>
                                        </Button>
                                    </Dropdown>
                                }
                            >
                                <GraphiteChart
                                    graphiteServerIP={'http://10.1.13.131'}
                                    askFormat={'json'}
                                    targetFuncName={'ListRoomTypesCommand'}
                                    detailName={'count'}
                                    serviceName={'com.qunhe.instdeco.plan.fusing'}
                                    fullName={'Graphite_Report.10-10-31-166.com.qunhe.instdeco.plan.fusing.ListRoomTypesCommand.time.count'}
                                    ref={this.refCallback}
                                />
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Echarts;