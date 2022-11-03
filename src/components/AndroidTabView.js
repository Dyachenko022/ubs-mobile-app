import React from 'react';
import {TouchableOpacity, StyleSheet, Dimensions, Text, View, Animated,  Platform} from 'react-native';
import ViewPager from 'react-native-pager-view';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  tabs: {
    width: '100%',
    flexDirection: 'row',
    height: 44,
  },
});

const _ViewPager = Animated.createAnimatedComponent(ViewPager);

class UniversalViewPager extends React.Component {
  pager: React.RefObject = React.createRef();

  scroll: React.RefObject = React.createRef();

  handleScroll = (e) => {
    this.props.animated.setValue(e.nativeEvent.contentOffset.x);
  };

  handlePageScroll = (e) => {
    this.props.animated.setValue((e.nativeEvent.offset + e.nativeEvent.position) * width);
  };

  scrollToPage(page: number) {
    if (this.scroll.current) {
      this.scroll.current.scrollTo({x: width * page});
    }
    if (this.pager.current) {
      this.pager.current.setPage(page);
    }
  }

  render() {
    const {animated, ...props} = this.props;
    if (Platform.OS === 'ios') {
      return (
        <Animated.ScrollView
          horizontal
          onScroll={this.handleScroll}
          pagingEnabled
          ref={this.scroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          {...props}
        />
      );
    }
    return (
      <_ViewPager
        initialPage={0}
        onPageScroll={this.handlePageScroll}
        ref={this.pager}
        scrollEventThrottle={16}
        style={StyleSheet.absoluteFill}
        {...props}
      />
    );
  }
}

export default class AndroidTabView extends React.Component {
  animated = new Animated.Value(0);

  viewPager = React.createRef();

  jumpToTab(index) {
    if (this.viewPager.current) {
      if(this.props.onSlideChange){
       this.props.onSlideChange(index)
      }
      this.viewPager.current.scrollToPage(index);
    }
  }

  renderHeader() {
    const _width = width / this.props.navigationState.routes.length;
    const arr = new Array(this.props.navigationState.routes.length).fill(1).map((i, j) => j);
    const translateX = this.animated.interpolate({
      inputRange: arr.map(i => i * width),
      outputRange: arr.map(i => i * _width),
    });
    return (
      <View>
        <View style={styles.tabs}>
          {this.props.navigationState.routes.map((r, index) => (
            <TouchableOpacity key={r.key} onPress={() => this.jumpToTab(index)}>
              <View style={[styles.tab, {width: _width}]}>
                <Text style={{fontSize: 16}}>
                  {r.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={[
          this.props.indicatorStyle, {
            width: _width,
            height: 2,
            transform: [{translateX}],
          },
        ]}/>
      </View>
    );
  }

  renderScene(route, index, props) {
    return (
      <View
        key={route.key}
        style={{width}}
      >
        {this.props.renderScene({...props, route})}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <View style={styles.container}>
          <UniversalViewPager
            animated={this.animated}
            ref={this.viewPager}
          >
            {this.props.navigationState.routes.map((scene, index) => this.renderScene(scene, index, this.props))}
          </UniversalViewPager>
        </View>
      </View>
    );
  }
}
