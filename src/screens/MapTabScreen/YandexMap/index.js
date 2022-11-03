import React, { Component } from 'react';
import _ from 'lodash';
import {
  View
} from 'react-native';
import { WebView } from 'react-native-webview';


export default class YandexMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      markers: [],
      mapPoints: []
    };

    this.onWebViewMessage = this.onWebViewMessage.bind(this);
    this.injectJavaScript = this.injectJavaScript.bind(this);

    this.placeMarkers = this.placeMarkers.bind(this);
  }

  onWebViewMessage(event) {

    let msg;
    try {
      msg = JSON.parse(event.nativeEvent.data);
      switch (msg.type) {
        case 'ready':
          this.placeMarkers();
          break;
        case 'markerPress':
          this.fitToSuppliedMarkers(msg.marker.geometry.coordinates)
          this.props.onMarkerPress(msg.marker.uId)
          break;
        default:
          break;
      }

    } catch (err) {

    }
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.markers.length !== this.props.markers.length) {
      this.placeMarkers()
    }

  }


  placeMarkers() {
    const injectPlaceMarkes = `
      (function() {
        var markers = ${JSON.stringify(this.props.markers)}
        
        window.ReactNativeWebView.postMessage(JSON.stringify(markers))
        
        myMap.geoObjects.removeAll()
        myMap.geoObjects.each(function (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({type: 'custom', e}))
          }
        )
        markers.forEach(function(marker, i) {
          const point = new ymaps.Placemark(marker.coordinates, {}, {
              iconLayout: marker.iconLayout,
              iconImageHref: marker.iconImageHref,
              iconImageSize: marker.iconImageSize,
          });
          
          point.events.add("click", function (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'markerPress', markerIndex: marker.uId, marker: marker}))
          });
        
          myMap.geoObjects.add(point)
        })
        
      })();
    `;

    this.injectJavaScript(injectPlaceMarkes);
  }

  fitToSuppliedMarkers(location) {
    const injectPlaceMarkes = `
      (function() {
        myMap.panTo([
            ${location},
        ], {
          delay: 1000
        }).then(function () {
          myMap.setZoom(17);
        })
      })();
    `;

    this.injectJavaScript(injectPlaceMarkes);
  }

  injectJavaScript(inject) {
    this.webview.injectJavaScript(inject);
  }

  render() {
    this.html = `
        <html lang="ru">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no">
          <script src="https://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
          <script type="text/javascript">
            ymaps.ready(init);
            let myMap;
    
            function init(){
              myMap = new ymaps.Map("map", {
                // center: [-55.661112, 37.626922],
                center: [${this.props.initialCoordinates.latitude},${this.props.initialCoordinates.longitude}],
                controls: ['geolocationControl', 'zoomControl' ],
                zoom: 13
              });
              /*ymaps.geolocation.get({
                  // Выставляем опцию для определения положения по ip
                  provider: 'auto',
                  // Карта автоматически отцентрируется по положению пользователя.
                  // mapStateAutoApply: true
              }).then(function (result) {
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'myPoint', point: JSON.stringify(result.geoObjects)}));
                  // myMap.geoObjects.add(result.geoObjects);
              });*/
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ready'}));
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'added'}));
              myMap.events.add('click', function (e) {
                // Получение координат щелчка
                var coords = e.get('coords');
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'helloworld'}));
                window.ReactNativeWebView.postMessage(JSON.stringify({type: 'hello', coords: coords.join(', ')}));
            });
            }
          </script>
        </head>
          <body>
              <div id="map" style="width: 100%; height: 100%; border: 20px red; box-sizing: border-box"></div>
          </body>
        </html>
    `;

    //   const INJECTED_JAVASCRIPT = `(function() {
    //     window.ReactNativeWebView.postMessage(JSON.stringify(window.location));
    // })();`;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          ref={ref => this.webview = ref}
          source={{ html: this.html }}
          style={{ flex: 1, margin: -8 }}
          mixedContentMode='always'
          scalesPageToFit
          scrollEnabled={false}
          onMessage={this.onWebViewMessage}
          onLoad={this.placeMarkers}
        />

        {/*<View style={{position: 'absolute', bottom: 0, left: 70, right: 70, backgroundColor: 'rgba(255,255,255,.95)', borderWidth: 2, borderColor: 'red'}}>
          <Button
            onPress={this.placeMarkers}
            title="[DEV] Reload Markers"
            color={'red'}
          />
        </View>*/}
      </View>
    );
  }
}
