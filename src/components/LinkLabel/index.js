import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import PropTypes from 'prop-types';
import {showModal} from '../../utils/navigationUtils';
import BankTheme from '../../utils/bankTheme';

export default class LinkLabel extends React.PureComponent {

  linkClicked = (url) => {
    const extension = url.split('.').pop() || '';
    const isPdf = extension.toUpperCase() === 'PDF';
    showModal({screenName: 'WebViewModalConfirmation', passProps: {url, isPdf}});
  }

  render() {
    let { value } = this.props;
    const {name, hideName, listValues} = this.props;

    const links = value.match(/@(\w*)[^;.\s@]/g);

    const components = [];

    for (let match of links) {
      let indexOfInt = value.indexOf(match);
      components.push(
        <Text>{value.substring(0, indexOfInt)}</Text>
      );

      const macro = listValues.find(item => item[0] === match);
      if (macro) {
        components.push(
          <TouchableOpacity
            onPress={() => this.linkClicked(macro[1])}
          >
            <Text style={{color: BankTheme.color1, textDecoration: 'underline',}}>
              {macro[2]}
            </Text>
          </TouchableOpacity>
        );
      }
      value = value.substring(indexOfInt + match.length);
    }

    if (value.length > 0) components.push(value);

    return (
      <View>
        {!hideName &&
          <View>
            <Text style={{
              fontSize: 11,
              color: '#aeaeae',
              paddingTop: 2}}
            >
              {name}
            </Text>
          </View>
        }
        <View style={{flexDirection: 'row', justifyContent: hideName ? 'center' : '',}}>
          {components}
        </View>
    </View>
    );
  }
}

LinkLabel.propTypes = {
  listValues: PropTypes.array,
  value: PropTypes.string,
  name: PropTypes.string,
  hideName: PropTypes.bool,
};

LinkLabel.defaultProps = {
  listValues: [],
  value: '',
  name: '',
  hideName: false,
};
