import {
  Dimensions,
  Platform,
  StyleSheet
} from "react-native";
export const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height -(Platform.OS === 'ios' ? 75 : 1),
};

let iosPanelStyle = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    width: 355,
    height: 279,

    alignSelf: 'center',
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10
  },

  panelTitleWrapper: {
    zIndex: 1,
    height: 45,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(248,248,248,.95)' //orig .82 opacity + blur
  },
  panelTitle: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
    textAlign: 'center'
  },

  panelButton: {
    height: 56,
    borderTopWidth: 1,
    borderTopColor: "#ccc",

    backgroundColor: 'rgba(248,248,248,.95)'
  },
  btn: {
    height: '100%',
    width: '100%',

    alignItems: 'center',
    justifyContent: 'center'
  },
  panelButtonTitle: {
    fontSize: 20,
    fontWeight: 'normal',
    color: '#007AFF'
  },
  photo: {
    width: Screen.width - 40,
    height: 225,
    marginTop: 30
  },
  map: {
    height: Screen.height,
    width: Screen.width
  },

  roundTop: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14
  },
  roundBottom: {
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14
  },

  roundAll: {
    borderRadius: 14
  },

  //Date picker
  withBtns: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',

    // paddingHorizontal: 20
  },

  headerPickerBtn: {
    width: 75
  },

  panelPickerTitle: {
    color: "#3e3e3e",
    fontSize: 13,
    fontWeight: "400",
    textAlign: 'center',

    paddingHorizontal: 15,
    paddingVertical: 10
  },

  datePickerContainer: {
    flex: -11,
    justifyContent: 'center',

    height: 168,
    backgroundColor: 'rgba(248,248,248,.95)'
  }
});

let androidPanelStyle = StyleSheet.create({
  panelContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  panel: {
    width: '100%',
    height: 250,

    alignSelf: 'center',
    backgroundColor: '#fff'
  },
  panelHeader: {
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10
  },

  panelTitleWrapper: {
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  panelTitle: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "normal"
  },

  panelButton: {
    height: 48
  },
  btn: {
    height: '100%',
    width: '100%',

    justifyContent: 'center',
    backgroundColor: '#fff',

    paddingHorizontal: 32
  },
  panelButtonTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#3e3e3e'
  },

  roundTop: {
    borderRadius: 0
  },
  roundBottom: {
    borderRadius: 0
  },

  roundAll: {
    borderRadius: 0
  },

  //Date picker
  withBtns: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',

    // paddingHorizontal: 20
  },

  headerPickerBtn: {
    width: 75
  },

  panelPickerTitle: {
    color: "#3e3e3e",
    fontSize: 13,
    fontWeight: "400",
    textAlign: 'center',

    paddingHorizontal: 15,
    paddingVertical: 10
  },

  datePickerContainer: {
    flex: -11,
    justifyContent: 'center',

    height: 168,
    backgroundColor: 'rgba(248,248,248,.95)'
  }
});


export let styles = Platform.OS === 'ios' ? iosPanelStyle : androidPanelStyle ;
