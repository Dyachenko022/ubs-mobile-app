import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View, Text
} from 'react-native';
import Touchable from '../../Touchable';
import BankTheme from '../../../utils/bankTheme';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  containerDisabled: {
    backgroundColor: '#bbb'
  },
  textContainer: {
    backgroundColor: BankTheme.color1,
    color: 'white',
    width: "100%",
    height: 50,
    padding: 10,

    flex: 1,
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  }
});


export default class FilledButton extends React.PureComponent {
  render() {
    const Container = this.props.disabled ? View : Touchable;

    return (
      <Container
        onPress={this.props.onPress}
        style={[styles.container]}
      >
        <View style={[styles.textContainer, this.props.disabled && styles.containerDisabled]}>
          <Text style={styles.text}>
            {this.props.title}
          </Text>
        </View>
      </Container>
    )
  }
}

FilledButton.propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  title: PropTypes.string
};

FilledButton.defaultProps = {
  onPress: () => {},
  disabled: false,
  title: ''
};
