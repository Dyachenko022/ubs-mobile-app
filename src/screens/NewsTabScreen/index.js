import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import Collapsible from '../../components/Collapsible';
import HTML from 'react-native-render-html';
import {
  Linking,
  FlatList,
  ListView,
  Text,
  Image,
  ImageBackground,
  View,
  TextInput,
  Button,
  BackHandler
} from 'react-native';
import TouchableOpacity from '../../components/Touchable';
import styles from './styles';
import BankTheme from '../../utils/bankTheme';
import {news} from '../../api/actions'
import androidBeforeExit from '../../utils/androidBeforeExit';
import {Navigation} from 'react-native-navigation';


class NewsTabScreen extends React.Component {
  constructor(props) {
    super(props);

    this._renderItem = this._renderItem.bind(this);
    this._onPressItem = this._onPressItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);

    this.state = {
      selected: (new Map(): Map<string, boolean>)
    }
  }

  static options = (props) => {
    let options = {};
    if (props.header !== 'native') {
      options = {
        topBar: {
          visible: true,
          title: {
            component: {
              name: 'unisab/CustomTopBar',
              alignment: 'fill',
              passProps: {
                loginPage: true,
              }
            }
          }
        },
      };
    }
    if (props.hideBottomTabs) {
      options = {
        ...options,
        bottomTabs: {
          visible: false,
        }
      }
    }
    return options;
  }

  componentDidMount() {
    this.props.dispatch(news());
    this.navigationEvents = Navigation.events().bindComponent(this);
  }

  componentDidAppear() {
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress', this.androidBackButtonPress);
  }

  componentDidDisappear() {
    this.androidBackButtonListener?.remove();
  }

  androidBackButtonPress = () => {
    androidBeforeExit();
    return true; // Это нужно, чтобы у Андроида не работала кнопка Назад
  }

  render() {
    return (
      <View>

        <FlatList style={styles.list}
          data={this.props.news}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />

      </View>
    )
  }

  _renderItem({item}) {
    return(
      <View style={styles.listItem}>
        <TouchableOpacity style={styles.itemBtn} onPress={() => this._onPressItem(item.title)}>
          <Text style={styles.title}>{item.title}</Text>
          <View><Text style={styles.date}>{moment(item.date).format('DD.MM.YYYY')}</Text></View>
        </TouchableOpacity>

        <Collapsible collapsed={!this.state.selected.get(item.title)}>
          <View>
            {
              item.description !== '' ?
                <View style={styles.fullTextContainer}>
                  <HTML
                    containerStyle={{backgroundColor: 'transparent'}}
                    html={item.description}
                    onLinkPress={(e, url) => Linking.openURL(url)}
                  />
                </View>
              :
                <Text/>
            }
          </View>
        </Collapsible>
      </View>
    )
  }

  _keyExtractor = (item, index) => item.title;

  _onPressItem = (key) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(key, !selected.get(key)); // toggle
      return {selected};
    });
  };

}


// which props do we want to inject, given the global state?
const mapStateToProps = (state) => ({
  news: state.newsPage.news
})

export default connect(mapStateToProps)(NewsTabScreen);
