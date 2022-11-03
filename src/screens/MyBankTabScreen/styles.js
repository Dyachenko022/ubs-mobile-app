import { StyleSheet, Dimensions, Platform } from 'react-native';
import BankTheme from '../../utils/bankTheme';
// import { colors } from 'example/src/styles/index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


export const slideHeight = 100;
export const itemWidth = viewportWidth;
const entryBorderRadius = 8;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5f7",
    maxHeight: '100%',
    height: '100%',
    width:'100%',
  },

  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  newsDescription: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: "transparent"
  },

  textConteiner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  button: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',

    width: 180,
    height: 40,

    backgroundColor: BankTheme.color1,

  },

  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  paginationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
    height: 25,

    marginBottom: 56,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainerEven: {
    backgroundColor: '#000'//colors.black
  },

  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  backgroundImage: {
    resizeMode: 'cover',
    width: "100%",
    height: "100%"
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

  collapseContainer: {
    marginTop: 1
  }
});
