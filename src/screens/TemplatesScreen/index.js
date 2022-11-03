import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {getTemplates} from '../../api/actions'

import {
  FlatList, Image,
  View,
} from 'react-native';
import {TextRenderer as Text} from '../../components/TextRenderer';

import Template from './Template'
import styles from './styles';
import {makeLeftBackButton} from '../../utils/navigationUtils';
import LeftSwipeIcon from '../../../assets/icons/leftSwipe.png';


class TemplatesScreen extends React.Component {
  constructor(props) {
    super(props);

    this._getTemplates = this._getTemplates.bind(this);

    this._renderItem = this._renderItem.bind(this);
    this._onPressItem = this._onPressItem.bind(this);
    this._keyExtractor = this._keyExtractor.bind(this);

    this._onRefresh = this._onRefresh.bind(this);

    this.swipersRef = [];

    this.state = {
      loading: false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return ({loading: nextProps.loading})
  }

  componentDidMount() {
    this._getTemplates();
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        leftButtons: [makeLeftBackButton('templatescreenbackbutton')]
      }
    });
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this.navigationEventListener?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    Navigation.dismissModal(this.props.componentId);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#f2f5f7'}}>

        {
          this.props.templates.length !== 0 ?
            <FlatList style={styles.list}
                      data={this.props.templates}
                      keyExtractor={this._keyExtractor}
                      renderItem={this._renderItem}
                      keyboardShouldPersistTaps='handled'
                      refreshing={this.state.loading}
                      onRefresh={this._onRefresh}
                      ListFooterComponent={
                        <View style={{width: '100%', alignItems: 'center', marginVertical: 64}}>
                          <Text style={styles.textFooter}>
                            Для выполнения операций над шаблоном
                          </Text>
                          <Text style={styles.textFooter}>
                            проведите пальцем
                          </Text>
                          <Text style={styles.textFooter}>
                            от правого края к левому
                          </Text>
                          <Image source={LeftSwipeIcon} style={{width: 32, height: 32, marginTop: 16}} />
                        </View>
                      }
            />
            :
            <Text style={{height: 56, textAlign: 'center', padding: 20}}>Шаблонов не найдено</Text>
        }

      </View>
    )
  }

  _getTemplates() {
    this.props.dispatch(getTemplates({countDocs: this.props.countDocs}));
  }

  _onSwiperRef(id, ref){
    this.swipersRef.push({id, ref});
  }

  _onSwipeStart(id, closeAll) {
    this.swipersRef.forEach((swiper) => {
      if(closeAll) {
        swiper.ref.recenter()
      } else {
        if(swiper.id !== id) {
          swiper.ref.recenter()
        }
      }
    });
  }

  _renderItem({item}) {
    return (
      <Template
        parentComponentId={this.props.componentId}
        onButtonPress={() => this._onSwipeStart(item.id, true)}
        onSwipeStart={() => this._onSwipeStart(item.id)}
        onSwiperRef={(ref) => this._onSwiperRef(item.id, ref)}
        item={item}
      />
    )
  }

  _keyExtractor = (item) => item.id + '';

  _onPressItem = (key, stateMsg) => {
  };

  _onRefresh() {
    this.setState(() => ({
      loading: true
    }), this._getTemplates);
  }
}


// which props do we want to inject, given the global state?
const mapStateToProps = (state) => ({
  templates: state.templatesPage.templates,
  countDocs: state.templatesPage.countDocs,
  loading: state.templatesPage.loading
});

export default connect(mapStateToProps)(TemplatesScreen);
