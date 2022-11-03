import React from 'react';
import PropTypes from 'prop-types';
import {Navigation} from 'react-native-navigation';
import {
  Text,
  View,
  Linking,
  TouchableOpacity,
  SafeAreaView,
  BackHandler, ActivityIndicator,
} from 'react-native';
import {Dimensions } from "react-native";
import Carousel, {Pagination} from 'react-native-snap-carousel';
import styles from "./styles";
import BankTheme from '../../utils/bankTheme';
import CarouselItem from './CarouselItem';
import {makeLeftBackButton} from '../../utils/navigationUtils';

const screenWidth = Dimensions.get('window').width;

export default class NewProductsScreen extends React.Component {

  static options = (props) => ({
    bottomTabs: {
      visible: false,
    },
    topBar: {
      leftButtons: makeLeftBackButton('newproductsscreen_backbutton'),
    }
  });

  state = {
    activeIndex:0,
    dontRender: true,
  };

  componentDidMount() {
    this.navigationEvents = Navigation.events().bindComponent(this);
    this.androidBackButtonListener = BackHandler.addEventListener('hardwareBackPress',
      () => {
        this.navigationButtonPressed({ buttonId: 'newproductsscreen_backbutton' });
        return true;
      });
    setTimeout(() => this.setState({dontRender: false}), 3000);
  }

  componentWillUnmount() {
    this.navigationEvents?.remove();
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'newproductsscreen_backbutton') {
      this.setState({dontRender: true}, () => Navigation.pop(this.props.componentId));
    }
    if (buttonId === 'buttonnewproductssettings') this.props.openFilter();
  }

  pagination () {
    return (
      <Pagination
        dotsLength={this.props.products.length}
        activeDotIndex={this.state.activeIndex}
        containerStyle={{ height:5,  paddingVertical: 10}}
        dotContainerStyle={{
          height: 5,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: BankTheme.color1,
        }}
        inactiveDotStyle={{
          backgroundColor: 'gray',
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  }

  _renderItem({item}) {
    return (
      <CarouselItem
        logo={item.logo}
        description={item.description}
        infoProductCond={item.infoProductCond}
      />
    );
  }

  openNewProductModal = (sid, id) => {
    this.props.selectProduct(sid, id);
  };

  render() {
    let { activeIndex } = this.state;

    const {products} = this.props;
    if(products.length === 0) {
      return (
        <View style={{height: '100%', width: '100%', backgroundColor: 'white'}}>
          <Text>Продукты не найдены</Text>
        </View>
      )
    }

    // При больших данных в WebView некоторые Андроиды могут вылетать
    // Скорее всего это связанно с транзитными анимациями
    // Поэтому повесим на 3 секунды лоадер. Таймер вызывается в componentDidMount
    if(this.state.dontRender) return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={BankTheme.color1}/>
      </View>
    );

    if (activeIndex + 1 > products.length) {
      activeIndex = 0;
      this.carousel.snapToItem(0, false, false);
      this.setState({activeIndex});
    }

    const selectedProduct = products[activeIndex];

    return (
      <SafeAreaView style={styles.mainContainer}>

        <View style={{height: '4%'}}>
          {this.pagination()}
        </View>

        <View style={{justifyContent: 'space-between', height: '96%'}}>

          <View>
            <Carousel
              enableMomentum
              useScrollView
              layout={"default"}
              ref={ref => this.carousel = ref}
              data={this.props.products}
              sliderWidth={screenWidth}
              itemWidth={screenWidth}
              renderItem={this._renderItem}
              onSnapToItem = { index => {
                this.setState({activeIndex: index})
              }}
            />
            <View style={styles.buttonInfoBlock}>

              <TouchableOpacity
                onPress={() => Linking.openURL(selectedProduct.linkProduct)}
              >
                <Text  style={styles.buttonInfoText}>
                  {selectedProduct.buttonInfoText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.openNewProductModal(selectedProduct.sidDocument, selectedProduct.id)}
          >
            <Text style={{color: '#fff'}}>
              {products[activeIndex].buttonIssueText}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

NewProductsScreen.propTypes = {
  products: PropTypes.array,
  openFilter: PropTypes.func,
  selectProduct: PropTypes.func,
};

NewProductsScreen.defaultProps = {
  products: [],
};
