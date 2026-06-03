import React, { useImperativeHandle } from 'react';
import { View, Text } from 'react-native';

const MapView = React.forwardRef(({ children, style, ...props }: any, ref: any) => {
  useImperativeHandle(ref, () => ({
    animateToRegion: () => {
      console.log('animateToRegion called on web mock map');
    },
    fitToCoordinates: () => {
      console.log('fitToCoordinates called on web mock map');
    }
  }));

  return (
    <View style={[{ backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' }, style]} {...props}>
      <Text style={{ color: '#4b5563', fontWeight: 'bold' }}>Peta tidak tersedia di Web</Text>
      {children}
    </View>
  );
});

export const Marker = ({ children, style, ...props }: any) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export const PROVIDER_DEFAULT = 'default';

export default MapView;
