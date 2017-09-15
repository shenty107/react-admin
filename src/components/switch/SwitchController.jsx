import React from 'react';
import {Switch,notification,Icon } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import {getServerPrefix} from "../../utils/constants";

export class SwitchController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded:false,
            checked:false
        };
        this.antSwitch = '';
        this.prefix = '';
        this.getFusingStatus = this.getFusingStatus.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentWillMount() {
        let servicePrefix = getServerPrefix();
        for (let i = 0;i < servicePrefix.length;i++){
            if (servicePrefix[i].name === this.props.serviceName){
                this.prefix = servicePrefix[i].prefix;
                break;
            }
        }
        this.getFusingStatus();
    }

    componentDidMount() {

    }

    getFusingStatus(){
        let instance = this;
        axios.get('http://' + this.props.remoteServerIP + this.prefix + '/isfusing').then(function (response) {
            if (response.data === 'true'){
                instance.setState(
                    {isLoaded:true,
                    checked:true}
                    );
            } else {
                instance.setState(
                    {isLoaded:true,
                        checked:false}
                );
            }
        });
    }
    onChange(val){
        let instance = this;
        this.setState({isLoaded:false},function () {
            axios.get('http://' + this.props.remoteServerIP + this.prefix + '/changefusing').then(function (response) {
                if (response.data === 'Success'){
                    instance.getFusingStatus();
                    notification.open({
                        message: 'Success',
                        description: '切换熔断开关成功',
                        icon: <Icon type="check-circle-o" style={{ color: '#14e963' }} />,
                    });
                } else {
                    instance.getFusingStatus();
                    notification.open({
                        message: 'Failed',
                        description: '切换熔断开关失败，请重试',
                        icon: <Icon type="close-circle-o" style={{ color: '#e93d40' }} />,
                    });
                }
            });
        });
    }
    render(){
        if(this.state.isLoaded){
            return (
                <Switch
                    checkedChildren={this.props.checkedChildren}
                    unCheckedChildren={this.props.unCheckedChildren}
                    checked={this.state.checked}
                    onChange={this.onChange}
                    size={'default'}
                    className={'Switch'}
                    key={this.props.remoteServerIP}
                >
                    <br />
                </Switch>
            );
        } else {
            return(
                <Switch
                    disabled={true}
                checkedChildren={this.props.checkedChildren}
                unCheckedChildren={this.props.unCheckedChildren}
                checked={this.state.checked}
                onChange={this.onChange}
                size={'default'}
                className={'Switch'}
                key={this.props.remoteServerIP}
            >
                    <br />
            </Switch>);
        }
    }
}

SwitchController.propTypes = {
    serviceName: PropTypes.string,
    remoteServerIP: PropTypes.string,
    checkedChildren: PropTypes.string,
    unCheckedChildren: PropTypes.string,
};
SwitchController.defaultProps = {
    serviceName: 'Design_Service',
    remoteServerIP: '127.0.0.1',
    checkedChildren: 'on',
    unCheckedChildren: 'off',
};