/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import {PanGestureHandler} from 'react-native-gesture-handler';
const BOX_WIDTH = 300;
const BOX_HEIGHT = 200;
const PADDING_BOTTOM = 80;

const clamp = (value, minVal, maxVal) => {
  'worklet';
  if (value < minVal) {
    return minVal;
  }

  if (value > maxVal) {
    return maxVal;
  }
  return value;
};

const Box = ({height}) => {
  const {width} = useWindowDimensions();
  const boundX = width - BOX_WIDTH;
  const boundY = height - BOX_HEIGHT;
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.offsetX = translateX.value;
      ctx.offsetY = translateY.value;
    },

    onActive: (event, ctx) => {
      translateX.value = clamp(event.translationX + ctx.offsetX, 0, boundX);
      translateY.value = clamp(event.translationY + ctx.offsetY, 0, boundY);
    },

    onEnd: (event, ctx) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        clamp: [0, boundX],
      });

      translateY.value = withDecay({
        velocity: event.velocityY,
        clamp: [0, boundY],
      });
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    };
  });

  return (
    <PanGestureHandler {...{onGestureEvent}}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
};

const App = () => {
  const [height, setHeight] = useState(0);

  const onLayout = ({nativeEvent}) => {
    setHeight(nativeEvent.layout.height - PADDING_BOTTOM);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body} onLayout={onLayout}>
        <Box height={height} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 8,
    backgroundColor: 'blue',
  },
});

export default App;
