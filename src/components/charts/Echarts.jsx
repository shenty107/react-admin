/**
 * Created by hao.cheng on 2017/4/17.
 */
import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Menu, Row} from 'antd';
import GraphiteChart from "./GraphiteChart";
import PropTypes from 'prop-types';

class Echarts extends React.Component {

    constructor(props) {
        super(props);
        this.chartPointer = '';
        this.dataAvailable = {};
        this.menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">15分钟</Menu.Item>
                <Menu.Item key="2">2小时</Menu.Item>
                <Menu.Item key="3">1天</Menu.Item>
            </Menu>
        );
        this.refCallback = this.refCallback.bind(this);
        this.generateGraph = this.generateGraph.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

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

    refCallback(instance) {
        this.chartPointer= instance;
    }

    generateGraph(){
        return (
            <Row gutter={16}>
                <Col className="gutter-row" md={24}>
                    <div className="gutter-box">
                        <Card title={this.props.serviceName} bordered={false} extra=
                            {
                                <Dropdown overlay={this.menu}>
                                    <Button>
                                        起始时间 <Icon type="down" />
                                    </Button>
                                </Dropdown>
                            }
                        >
                            <GraphiteChart
                                graphiteServerIP={this.props.graphiteServerIP}
                                askFormat={this.props.askFormat}
                                targetFuncName={this.props.targetFuncName}
                                detailName={this.props.detailName}
                                serviceName={this.props.serviceName}
                                fullName={this.props.fullName}
                                ref={this.refCallback}
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        )
    }

    render() {
        return (
            <div className="gutter-example">
                {this.generateGraph()}
            </div>

        )
    }
}
Echarts.propTypes = {
    graphiteServerIP: PropTypes.string,
    askFormat: PropTypes.string,
    targetFuncName: PropTypes.string,
    detailName: PropTypes.string,
    serviceName: PropTypes.string,
    fullName: PropTypes.string
};
Echarts.defaultProps = {
    graphiteServerIP: '127.0.0.1',
    askFormat: 'json',
    targetFuncName: 'test',
    detailName: 'testCount',
    serviceName: 'com.qunhe.test',
    fullName: 'Graphite.local.com.qunhe.test.test.testCount'
};
export default Echarts;