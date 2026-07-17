import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';

interface LinearGradientProps extends ViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle | ViewStyle[];
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  colors,
  children,
  style,
  ...props
}) => {
  // Safe JS-only fallback for bare React Native CLI that uses the first gradient color as background.
  const baseStyle: ViewStyle = {
    backgroundColor: colors[0],
  };

  return (
    <View style={[baseStyle, style]} {...props}>
      {children}
    </View>
  );
};
