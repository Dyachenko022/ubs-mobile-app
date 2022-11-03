import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import BankTheme from '../../../utils/bankTheme';
import ComboBoxDropdownModal from './ComboBoxDropdownModal';

export default class ComboBoxListFind extends React.Component {

  state = {
    isFocused: false,
    visible: false,
  }

  focus = () => {
    this.setState({ isFocused : true, visible: true });
    if (this.props.onFocus) this.props.onFocus();
  }

  blur =() => {
    this.setState({ isFocused: false});
  }

  render() {
    let label = '';
    let indexSelected = -1;
    if (this.props.value) {
      indexSelected= this.props.options.findIndex((item) => item.value === this.props.value);
      if (indexSelected > -1) label = this.props.options[indexSelected].label;
    }
    let textStyle, containerStyle;
    if (this.state.isFocused) {
      textStyle = styles.selected;
      containerStyle = styles.selectedContainer;
    } else {
      textStyle = styles.blured;
    }
    if (!this.props.isValid) {
      textStyle = styles.error;
      containerStyle = styles.errorContainer;
    }
    return (
      <>
        <TouchableOpacity
          style={[styles.container, containerStyle]}
          onPress={this.focus}
        >
          {this.props.fieldName && (
            <Text style={[styles.textInputTitle, textStyle]}>
              {this.props.fieldName}
            </Text>
          )}
          <Text>
            {label}
          </Text>
        </TouchableOpacity>

        <ComboBoxDropdownModal
          visible={this.state.visible}
          options={this.props.options}
          selectedIndex={indexSelected}
          fieldName={this.props.fieldName}
          isSbp={this.props.isSbp}
          onSelect={(value) => {
            this.props.onChange(value);
            this.setState({visible: false});
          }}
          onCancel={() => this.setState({visible: false})}
        />

      </>
    );
  }
}

ComboBoxListFind.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  value: PropTypes.any,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  isValid: PropTypes.bool,
  onFocus: PropTypes.func,
  fieldName: PropTypes.string,
  isSbp: PropTypes.bool,
}

ComboBoxListFind.defaultProps = {
  options: [],
  isValid: true,
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    minHeight: 56,
    padding: 6,
    borderWidth: 1,
    borderColor: "#e7e7e7",
    borderRadius: 3
  },
  selectedContainer: {
    borderColor: BankTheme.color1,
  },
  errorContainer: {
    borderColor: '#cc4444'
  },

  textInputTitle: {
    fontSize: 14,
    lineHeight: 14,
  },
  selected: {
    color: BankTheme.color1,
  },
  blured: {
    color: 'rgba(0, 0, 0, 0.5)'
  },
  error: {
    color: '#EF3A51'
  },
})
