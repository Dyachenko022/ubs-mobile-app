import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  View,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import TouchableOpacity from '../../Touchable';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { TextRenderer as Text } from "../../TextRenderer";
import Input from '../IconInput'

const Screen = { width, height } = Dimensions.get('window');

export default class TextBoxFindInput extends React.Component {
  static propTypes = {
    value: PropTypes.string,

    data: PropTypes.array,

    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    itemRenderer: PropTypes.func,
    filter: PropTypes.func,

    isValid: PropTypes.bool
  };
  static defaultProps = {
    value: '',
    onChange: (text) => {
      this.setState((prevState) => ({ input: text }))
    },
    onSubmit: () => { },
    onFocus: () => { },

    data: [],
    itemRenderer: (el, idx) => (
      <TouchableOpacity key={`${idx}-${el.title}`} onPress={() => {
      }}>
        <Text style={{ fontSize: 16, marginBottom: 5 }}>{el.title}</Text>
        <Text style={{ color: "#ddd", marginBottom: 5 }}>{el.subTitle}</Text>
      </TouchableOpacity>
    ),

    filter: (el, cond) => {
      if (!cond) {
        return el
      }
      return el.title.match(cond)
    },

    isValid: true
  };

  constructor(props) {
    super(props);

    this._deltaY = new Animated.Value(Screen.height);
    this.focus = this.focus.bind(this);

    this.state = { focus: false, textInputFocused: false }
  }

  componentDidMount() {
    if (this.input && this.props.focusEditableTextInput && !this.state.textInputFocused) {
      this.setState({ focusEditableTextInput: true })
    }
  }

  render() {
    const {
      onChange: onChangeText,
      value: searchText,
      data, itemRenderer, filter,
      name, placeholder, modalName
    } = this.props;
    let dataToRender = data.filter(el => filter(el, searchText)).map(itemRenderer);

    return (
      <View
        style={{
          alignItems: "center",
          overflow: 'visible',
          zIndex: 5,
          width: '100%'
        }}
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.focus}
          onRequestClose={() => {
          }}
        >
          <TouchableWithoutFeedback onPress={this.focus}>
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 35,
                backgroundColor: this.state.focus
                  ? "rgba(0,0,0,.5)"
                  : "transparent",
                width: Screen.width,
                height: Screen.height
              }}
            >
              <View style={{ padding: 15, paddingBottom: 0, height: '100%', backgroundColor: "#fff", borderRadius: 10 }}>

                <Text style={{ fontWeight: 'bold' }}>{modalName || name}</Text>
                <Input
                  inputProps={{
                    blurOnSubmit: false,
                    clearButtonMode: 'while-editing',
                    // clearTextOnFocus: true,

                    autoFocus: true,
                    onChangeText,
                    value: searchText,

                    returnKeyType: 'go',
                    returnKeyLabel: 'Выбрать',
                    onSubmitEditing: () => {
                      this.focus();
                      this.props.onSubmit(this.props.value)
                    }
                  }}
                />

                <KeyboardAwareScrollView
                  keyboardShouldPersistTaps={'handled'}
                  keyboardDismissMode={'none'}
                  style={{ marginTop: 10 }}
                >
                  {dataToRender}
                </KeyboardAwareScrollView>

              </View>

            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {this.props.editable ? this._editableRender() : this._defaultRender()}

      </View>
    )
  }

  _defaultRender = () => {
    const {
      value: searchText,
      name, placeholder
    } = this.props;

    return (
      <View>
        <TouchableWithoutFeedback onPress={this.focus}>
          <View style={{ borderRadius: 5, zIndex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        </TouchableWithoutFeedback>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        <Input inputProps={{ value: searchText, placeholder }} />
      </View>
    )
  };

  _editableRender = () => {
    const {
      value,
      name, placeholder, maxLength
    } = this.props;

    return (
      <View>
        <Text style={{ fontWeight: 'bold' }}>{name}</Text>
        <Input
          focusEditableTextInput={this.props.focusEditableTextInput}
          ref={e => this.input = e}
          isFocused={this.props.isFocused}
          onFocus={this.props.onFocus}
          coloredOnFocus={true}
          isValid={this.props.isValid}
          inputProps={{
            onChangeText: (text) => {
              this.props.onSubmit(text);
            },
            value, placeholder, maxLength
          }}
          iconRight={(iconProps) =>
            <TouchableOpacity onPress={this.focus}>
              <Icon name={'md-contacts'} color={"#bbb"} size={25} />
            </TouchableOpacity>
          }
        />
      </View>
    )
  }

  focus() {
    this.setState((prevState) => ({ focus: !prevState.focus }), () => {
      if (this.state.focus) {
        this.props.onFocus && this.props.onFocus();
      }
    })
  }

  blur() {
    this.setState((prevState) => ({ focus: false }), () => {
      this.props.onBlur && this.props.onBlur();
    })
  }
}
