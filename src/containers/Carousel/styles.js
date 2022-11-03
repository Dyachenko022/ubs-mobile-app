import { StyleSheet, Dimensions, Platform } from 'react-native';
// import { colors } from 'example/src/styles/index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

export const slideHeight = (viewportWidth/**9*/)/4/**16*/;//80;//
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
  container: {
  },

  slideInnerContainer: {
    width: itemWidth,
    // height: slideHeight,

    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },


  newsDescription: {
    color: '#fff',
    fontSize: 12,

    // borderWidth: 1,
    // borderColor: 'red',

    flex: 1,

    backgroundColor: "transparent"
  },

  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',

    height: 25,

    marginVertical: 0,

    paddingHorizontal: 0,
    paddingVertical: 0
  },
  paginationContainerAbsolute: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // marginHorizontal: 8,
  },

  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius
  },
  imageContainerEven: {
    backgroundColor: '#000'//colors.black
  },
  image: {
    // ...StyleSheet.absoluteFillObject,
    // resizeMode: 'cover',
    // borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    // borderTopLeftRadius: entryBorderRadius,
    // borderTopRightRadius: entryBorderRadius,

    width: 60,
    height: 60,
    marginRight: 10
  },
  // image's border radius is buggy on ios; let's hack it!
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'white'
  },
  radiusMaskEven: {
    backgroundColor: '#000'//colors.black
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius
  },
  textContainerEven: {
    backgroundColor: '#000'//colors.black
  },
  title: {
    color: '#000',//colors.black,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  titleEven: {
    color: 'white'
  },
  subtitle: {
    marginTop: 6,
    color: 'gray',//colors.gray,
    fontSize: 12,
    fontStyle: 'italic'
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)'
  }
});
