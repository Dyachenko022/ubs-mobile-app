import {StyleSheet, Dimensions, Platform, PixelRatio} from 'react-native';
import BankTheme from '../../utils/bankTheme';

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - 75
};

function wp(percentage) {
  const value = (percentage * Screen.width) / 100;
  return Math.round(value);
}

const slideHeight = Screen.height * 0.4;
const slideWidth = wp(75);
const itemHorizontalMargin = Platform.OS === 'ios' ? -30 : -50;

export const sliderWidth = Screen.width;
export const itemWidth = slideWidth + itemHorizontalMargin * 2 + 20;

const entryBorderRadius = 10;


export default StyleSheet.create({
  container: {
    flex: 1,
    // height: Screen.height+500,
  },

  carouselContainer: {
    flex: 1
  },

  infoContainer: {
    flex: 2,
    backgroundColor: "#fff"
  },

  infoHeader: {
    flexDirection: 'row',
    // height: 28,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  infoHeaderText: {
    fontSize: 18,
    color: "#aaa"
  },

  balance: {
    fontSize: 19
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 5,
    minHeight: 30,

    paddingLeft: 35,
    paddingRight: 20
  },
  rowLabel: {
    // flex: 2,
    fontSize: 16,
    marginRight: 10
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right'
  },
  nameProduct: {
    maxWidth: 150,
    textAlign: 'right'
  },

  slideInnerContainer: {
    width: itemWidth,
    height: '100%',
    flex: 1,
    paddingHorizontal: itemHorizontalMargin,
    paddingVertical: 10 // needed for shadow
  },
  imageContainer: {
    flex: 1,
    height: '100%',
    borderRadius: entryBorderRadius,
    // borderWidth: 1,

    // shadowColor: '#000',
    // shadowOffset: {width: 1, height: 1},
    // shadowOpacity: 0.8,
    // shadowRadius: 1,
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    resizeMode: 'contain',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0
  },
  // image's border radius is buggy on ios; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // height: entryBorderRadius,
    backgroundColor: 'white'
  },

  cardContainer: {
    backgroundColor: "#000"
  },

  operations: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 5,
  },
  operationButton: {
    marginLeft: -50,
    paddingLeft: 70,
    paddingVertical: 10,
    // borderWidth: 1,

    alignItems: 'center',

    flexDirection: "row"
  },
  payButton: {
    // marginLeft: -50,
    // paddingLeft: 70,
    // paddingVertical: 10,
    // // borderWidth: 1,
    //
    alignItems: 'center',
    justifyContent: 'center',
    //
    // flexDirection: "row"

  },
  reissueButton: {
    height: 36,
    width: 140,
    borderColor: BankTheme.color1,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  operationButtonText: {
    marginLeft: 50,
    fontSize: 16
  },
  operationButtonLine: {
    height: 1,
    width: Screen.width - 85,
    backgroundColor: "#eee",

    position: 'absolute',
    bottom: 0,
    right: 0
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: '100%',

    backgroundColor: 'rgba(255,255,255,.85)'
  },

  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  btn: {
    color: BankTheme.color1,
    marginBottom: 20,
    fontSize: 13
  }
});
