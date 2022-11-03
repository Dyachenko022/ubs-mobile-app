import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableWithoutFeedback, Keyboard, SafeAreaView, FlatList, Image
} from 'react-native';
import Modal from 'react-native-ui-lib/modal';
import TouchableOpacity from '../../Touchable';
import Icon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview'
import { TextRenderer as Text } from "../../TextRenderer";
import Input from '../IconInput'

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
    this.focus = this.focus.bind(this);
    this.state = {
      focus: false,
      textInputFocused: false,
      modalSearchText: '',
      dataToRender: [],
    }
    // Задаем отдельно, потому что в методе используется state
    this.state.dataToRender = this.getDataToRender(this.state, props);
  }

  componentDidMount() {
    if (this.input && this.props.focusEditableTextInput && !this.state.textInputFocused) {
      this.setState({ focusEditableTextInput: true })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Если закрыли модальное окно, то сбрасываем строку поиска
    if (prevState.focus && !this.state.focus) {
      this.setState({ modalSearchText: '' });
    }
    if (prevState.modalSearchText !== this.state.modalSearchText || prevProps.data !== this.props.data) {
      this.setState((prevState, props) => ({
        dataToRender: this.getDataToRender(prevState, props),
      }));
    }
  }

  getDataToRender = (state, props) => props.data.filter(el => props.filter(el, state.modalSearchText)).slice(0, 20);

  keyExtractor = (item, index) => index.toString();

  render() {
    const {
      name, modalName
    } = this.props;

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
          visible={this.state.focus}
          animationType="slide"
        >
          <SafeAreaView style={{flex: 1}}>
            <Modal.TopBar
              title={modalName || name}
              titleStyle={{fontSize: 16}}
              onCancel={this.focus}
            />
            <Input
              styles={{width: '95%', alignSelf: 'center', height: 35, marginBottom: 10}}
              inputProps={{
                blurOnSubmit: false,
                clearButtonMode: 'while-editing',
                onChangeText: (modalSearchText) => this.setState({ modalSearchText }),
                value: this.state.modalSearchText,
                returnKeyType: 'go',
                returnKeyLabel: 'Выбрать',
                onSubmitEditing: Keyboard.dismiss,
              }}
            />
            <FlatList
              style={{flex: 1, paddingHorizontal: 8}}
              data={this.state.dataToRender}
              keyboardShouldPersistTaps="handled"
              keyExtractor={this.keyExtractor}
              renderItem={(info) => this.props.itemRenderer(info.item, info.index)}
            />
          </SafeAreaView>
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
