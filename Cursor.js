import { StyleSheet, Text, Dimensions, View } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  interpolate,
  Extrapolate,
  withSpring,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDecay,
  runOnJS,
  runOnUI,
  useDerivedValue,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedGestureHandler,
  defineAnimation,
  useAnimatedProps,
  interpolateColors,
} from "react-native-reanimated";
import {
  TapGestureHandler,
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
  ScrollView,
} from "react-native-gesture-handler";
import Svg, { Path } from "react-native-svg";
import { hsv2color } from "react-native-redash";
const { height, width } = Dimensions.get("window");
const CURSOR_WIDTH = 50;

const SIZE = width * 0.8 - 0;

const r = SIZE / 2;
function angle(ex, ey) {
  "worklet";

  var dy = ey - r;
  var dx = ex - r;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  // console.log('theta', theta);
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}

function degrees_to_radians(degrees) {
  "worklet";
  var pi = Math.PI;
  return degrees * (pi / 180);
}
function distance(x, y) {
  "worklet";
  var a = r - x;
  var b = r - y;

  var c = Math.sqrt(a * a + b * b);
  return c;
}
const Cursor = ({ v, h, s, backgroundColor }) => {
  const x = useDerivedValue(() => {
    const raduis = (s.value / 100) * r;
    const tmpx = r + raduis * Math.cos(degrees_to_radians(h.value));

    return tmpx;
  });
  const y = useDerivedValue(() => {
    const raduis = (s.value / 100) * r;
    const tmpy = r + raduis * Math.sin(degrees_to_radians(h.value));

    return tmpy;
  });

  const isPicking = useSharedValue(false);

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const gesture = Gesture.Pan();
  gesture.onBegin(() => {
    offsetX.value = x.value;
    offsetY.value = y.value;
    isPicking.value = true;
  });
  gesture.onUpdate((e) => {
    const tmpx = e.translationX + offsetX.value;
    const tmpy = e.translationY + offsetY.value;

    const tmpDistance = distance(tmpx, tmpy);
    const saturation = Math.min((tmpDistance / r) * 100, 100);
    const a = angle(tmpx, tmpy);

    h.value = a;
    s.value = saturation;
  });
  gesture.onEnd(() => {
    isPicking.value = false;
  });

  const rnStyle = useAnimatedStyle(() => {
    return {
      elevation: 24,
      borderRadius: CURSOR_WIDTH / 2,

      backgroundColor: backgroundColor.value,
      transform: [
        { translateX: x.value - CURSOR_WIDTH / 2 },
        { translateY: y.value - CURSOR_WIDTH / 2 },

        { scale: isPicking.value ? withTiming(1.2) : withTiming(1) },
      ],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: CURSOR_WIDTH,
            height: CURSOR_WIDTH,
            //  overflow: "hidden",
          },
          rnStyle,
        ]}
      ></Animated.View>
    </GestureDetector>
  );
};

export default Cursor;

const styles = StyleSheet.create({});
