import React from 'react';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';
import {
  paramProductByType, paramProductCard, listParamsProduct, paramProductCredit,
  paramProductDeposit
} from "../../api/actions";
import {getProducts} from "../../reducers/newProduct/reducer";
import {parseMoney} from "../../utils/text";
import {
  Dimensions,
  Platform,
  Linking,

  ScrollView,
  FlatList,

  View,
  Image,
} from 'react-native'
import TouchableOpacity from '../../components/Touchable';
import {TextRenderer as Text} from "../../components/TextRenderer";
import Icon from 'react-native-vector-icons/Ionicons';


import ProductFilter from './ProductFilter';

const openNewProductModal = (sid, id, navigator) => {

  Navigation.showModal({
    screen: 'unisab/Document',
    navigatorButtons: {
      leftButtons: Platform.OS === 'ios' ? [
        {
          component: 'ContractsSelectScreen/CloseModalButton',
          // title: 'Edit', // for a textual button, provide the button title (label)
          id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          passProps: {
            button: <View style={{paddingHorizontal: 15, paddingVertical: 5, marginLeft: -15}}><Icon size={25} name={'ios-arrow-back'} color={'#fff'}/></View>,
            navigator: navigator
          }
        }
      ] : []
    },
    passProps: {
      sid: sid,
      defaultValues: {
        'Идентификатор продукта': id
      }
    }
  })
};


class NewProductScreen extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true
  };

  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    }
  }

  componentDidMount() {
    this.props.dispatch(paramProductByType(this.props.type));
  }

  render() {
    let {products, type} = this.props;
    let productsLength = products.length;

    let ItemRenderer = CardRenderer;
    switch (type) {
      case 'credits':
        ItemRenderer = CreditRenderer;
        break;
      case 'deposits':
        ItemRenderer = DepositRenderer;
        break;
      default:
        break;
    }

    let arrows = null;

    if (products.length > 1) {
      arrows = [
        this.state.activeIndex > 0 && <TouchableOpacity
          key={1}
          style={{position: 'absolute', left: 0, width: 20, height: 40, zIndex: 2, marginLeft: 10}}
          disabled={this.state.activeIndex === 0 }
          onPress={() => {
            this.setState(
              (prevState) => ({activeIndex: prevState.activeIndex - 1 < 0 ? 0 : prevState.activeIndex - 1}),
              () => {
                this.carousel.scrollToIndex({animated: true, index: this.state.activeIndex})
              }
            )
          }}
        >
        <Icon name={'ios-arrow-back'} size={40}/>
        </TouchableOpacity>,
        this.state.activeIndex < products.length - 1 && <TouchableOpacity
          key={2}
          style={{position: 'absolute', right: 0, width: 20, height: 40, zIndex: 2, marginRight: 10}}
          disabled={this.state.activeIndex >= products.length - 1}
          onPress={() => {
            this.setState(
              (prevState) => ({activeIndex: prevState.activeIndex + 1 > productsLength - 1 ? productsLength - 1 : prevState.activeIndex + 1}),
              () => {
                this.carousel.scrollToIndex({animated: true, index: this.state.activeIndex})
              }
            )
          }}
        >
          <Icon name={'ios-arrow-forward'} size={40}/>
        </TouchableOpacity>
      ]
    }
    return (
      /*<ProductFilter type={this.props.type}>*/
      <ScrollView style={{flex: 1 }} contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        {
          products.length > 0 ?
            <View
              style={{
                justifyContent: 'center',
                paddingBottom: 20
              }}
            >

              {arrows}

              <FlatList
                ref={ref => this.carousel = ref}

                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled

                onMomentumScrollEnd={(e) => {
                  let contentOffset = e.nativeEvent.contentOffset;
                  let viewSize = e.nativeEvent.layoutMeasurement;

                  // Divide the horizontal offset by the width of the view to see which page is visible
                  let pageNum = Math.floor(contentOffset.x / viewSize.width);
                  this.setState({activeIndex: pageNum})
                }}

                // contentContainerStyle={{width: '100%'}}
                //  style={{borderColor: 'red', borderWidth: 2}}

                data={products}
                keyExtractor={el => '' + el.id}
                renderItem={(item) => (
                  <ItemRenderer {...item.item} navigator={this.props.navigator}/>
                )}
              />
            </View>
            :
            null
        }
      </ScrollView>
      // </ProductFilter>
    )
  }
}


const CardRenderer = (props) => (
  <View
    key={props.id}
    style={{
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',

      paddingHorizontal: Dimensions.get('window').width * .15//'15%'
    }}
  >

    <Text style={{fontWeight: '500', fontSize: 18, marginBottom: 10, textAlign: "center"}}>
      {props.name}
    </Text>

    <Image source={{uri: props.logo}} style={{height: 150, width: '85%'}} resizeMode="contain"/>

    <View style={{marginTop: 25, width: '100%'}}>
      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text style={{fontSize: 16}}>Плата за выпуск:</Text>
        <Text style={{fontSize: 16}}>{parseMoney(props.issueFee, props.currencyIssueFee)}</Text>
      </View>

      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text style={{fontSize: 16}}>Обслуживание:</Text>
        <Text style={{fontSize: 16}}>{parseMoney(props.serviceFee, props.currencyServiceFee)}</Text>
      </View>
    </View>

    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 50}}>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          borderWidth: 1,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          Linking.openURL(props.linkProductInfo)
        }}
      >
        <Text style={{fontSize: 20}}>i</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 200,
          height: 30,

          borderWidth: 1,
          borderRadius: 15,

          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          openNewProductModal('UBS_CARD_ISSUE', props.id, props.navigator);
        }}
      >
        <Text>Выбрать</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CreditRenderer = (props) => (
  <View
    key={props.id}
    style={{
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',

      paddingHorizontal: Dimensions.get('window').width * .15//'15%'
    }}
  >

    <Text style={{fontWeight: '500', fontSize: 18, marginBottom: 10}}>
      {props.name}
    </Text>

    <Image source={{uri: props.logo}} style={{height: 150, width: '85%'}} resizeMode="contain"/>

    <View style={{marginTop: 25, width: '100%'}}>
      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text style={{fontSize: 16}}>Сумма:</Text>
        <Text style={{fontSize: 16}}>до {parseMoney(props.maxSum, 'RUB')}</Text>
      </View>
      
      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text style={{fontSize: 16}}>Срок:</Text>
        <Text style={{fontSize: 15}}>{props.contractTerm}</Text>
      </View>
      
      <View style={{marginTop: 5, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
        <Text style={{fontSize: 16}}>Ставка:</Text>
        <Text style={{fontSize: 15}}>{props.rate}</Text>
      </View>
    </View>

    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 50}}>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          borderWidth: 1,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          Linking.openURL(props.linkProductInfo)
        }}
      >
        <Text style={{fontSize: 20}}>i</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 200,
          height: 30,

          borderWidth: 1,
          borderRadius: 15,

          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          openNewProductModal('UBS_FO_CREATE_CLAIM', props.id, props.navigator);
        }}
      >
        <Text>Выбрать</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const DepositRenderer = props => (
  <View
    key={props.id}
    style={{
      width: Dimensions.get('window').width,
      justifyContent: 'center',
      alignItems: 'center',

      paddingHorizontal: Dimensions.get('window').width * .15//'15%'
    }}
  >

    <Text style={{fontWeight: '500', fontSize: 18, marginBottom: 10, textAlign: "center"}}>
      {props.name}
    </Text>

    <Image source={{uri: props.logo}} style={{height: 150, width: '85%'}} resizeMode="contain"/>

    <View style={{marginTop: 25, width: '100%'}}>
      <View style={{
        marginTop: 5,
        width: '100%'
      }}>

        <Text style={{fontSize: 16}}>Ставка %:</Text>

        <View style={{marginTop: 5, marginLeft: 15}}>
          {
            props.parameters.map(parametr => (
                <View style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginTop: 5
                }}>
                  <Text>{parametr.currency}</Text>
                  <Text>{parametr.rate}</Text>
                </View>
              )
            )
          }
        </View>

      </View>
    </View>

    <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 50}}>
      <TouchableOpacity
        style={{
          width: 30,
          height: 30,
          borderWidth: 1,
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          // linkProductInfo
          Linking.openURL(props.linkProductInfo);
        }}
      >
        <Text style={{fontSize: 20}}>i</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 200,
          height: 30,

          borderWidth: 1,
          borderRadius: 15,

          justifyContent: 'center',
          alignItems: 'center'
        }}
        onPress={() => {
          openNewProductModal('UBS_DEPOSIT_OPEN', props.id, props.navigator);
        }}
      >
        <Text>Выбрать</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const mapStateToProps = (state, ownProps) => ({
  products: getProducts(state, ownProps.type)
});
export default connect(mapStateToProps)(NewProductScreen);
