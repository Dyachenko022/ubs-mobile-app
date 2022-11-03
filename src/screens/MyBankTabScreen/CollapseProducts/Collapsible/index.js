import React from 'react';
import PropTypes from 'prop-types';
import {LayoutAnimation, View} from 'react-native';
import TouchableOpacity from '../../../../components/Touchable';
import {TextRenderer as Text} from '../../../../components/TextRenderer';
import Collapsible from '../../../../components/Collapsible';

import styles from './styles';


export default class Collapse extends React.Component {
  static propTypes = {
    collapsed: PropTypes.bool,
    duration: PropTypes.number,

    header: PropTypes.element,

    data: PropTypes.array.isRequired,
    dataRender: PropTypes.func.isRequired,

    // containerStyle: PropTypes.ViewPropTypes
  };
  static defaultProps = {
    collapsed: true
  };

  constructor(props) {
    super(props);

    this._renderHeader = this._renderHeader.bind(this);

    this._onCollapse = this._onCollapse.bind(this);

    this.state = {
      collapsed: true
    }
  }

  render() {
    const header = this.props.header ? this.props.header : this._renderHeader();

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        {header}
          <Collapsible collapsed={this.props.collapsed}>
            {
              this.props.data.map((el, index) => {
                return this.props.dataRender(el, index)
              })
            }
          </Collapsible>
      </View>
    )
  }

  _renderHeader() {
    return(
      <TouchableOpacity onPress={this._onCollapse}>
        <Text>Header</Text>
      </TouchableOpacity>
    )
  }

  _onCollapse() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }
}
