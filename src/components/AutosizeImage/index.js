import React, {useEffect, useState} from 'react';
import { Image } from 'react-native';

export default function AutosizeImage(props) {
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    Image.getSize(props.source?.uri, (w, h) => {
      setHeight(h);
      setWidth(w);
    });
  }, []);
  return (
    <Image source={props.source} style={{ width, height }} />
  )
}
