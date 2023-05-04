import React from 'react';
import { View, StyleSheet } from 'react-native';

import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

type DrawableProps<T> = {
    renderItem:()=>JSX.Element
    onStart:()=>void
    onActive:(position:{x:number, y:number})=>void
    onEnd:(position:{x:number, y:number})=>boolean
  }

export default <T,>({renderItem, onStart, onActive, onEnd}:DrawableProps<T>) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context:any) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
      context.x = event.x
      context.y = event.y
      onStart()
    },
    onActive: (event, context) => {
      onActive({x:event.translationX + context.x, y:event.translationY + context.y})
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: (event, context) => {
      if (!onEnd({x:event.translationX + context.x, y:event.translationY + context.y})){
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.dropzone}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={rStyle}>
            {renderItem()}
        </Animated.View>
      </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropzone: {
      backgroundColor: '#f4f5f7',
      width: '100%',
      height: '100%'
    },
  });