import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Dimensions, View } from "react-native";
import {
  TapGestureHandler,
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import React, { useState } from "react";

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
import Circle from "./Circle";
import Cursor from "./Cursor";
import Footer from "./Footer";
import Header from "./Header";
import {
  hslToRgb,
  rgbToHsl,
  rgbToHex,
  hexToRgb,
  hsl2hsv,
} from "./colorConvert";
const { height, width } = Dimensions.get("window");

const cx = width / 2;
const cy = height / 2;

const SIZE = width * 0.8;

const r = SIZE / 2;
const C = r * Math.PI * 2;

export default function App() {
  const h = useSharedValue(0);
  const s = useSharedValue(0);
  const v = useSharedValue(100);
  const [ShaderValue, setShaderValue] = useState(1.0);
  const [hexText, sethexText] = useState("");

  const backgroundColor = useDerivedValue(() => {
    var l = ((2 - s.value / 100) * v.value) / 2;
    let s1 = (s.value * v.value) / (l < 50 ? l * 2 : 200 - l * 2);
    if (isNaN(s1)) {
      s1 = 0;
    }

    const rgb = hslToRgb((360 - h.value) / 360, s1 / 100, l / 100);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    runOnJS(sethexText)(hex);

    return `hsl(${360 - h.value},${s1}%,${l}%)`;
  });
  const onTextChange = (text) => {
    const rgb = hexToRgb(text);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.b, rgb.g);
      const hsv = hsl2hsv(hsl[0] * 360, hsl[1] * 100, hsl[2] * 100);
      h.value = hsv[0];
      s.value = hsv[1];
      v.value = hsv[2];

      console.log("textChange", rgb, hsl, hsv);
      console.log("old hsl", backgroundColor.value);
    }

    sethexText(text);
  };
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "black",
      }}
    >
      <Header
        setShaderValue={setShaderValue}
        backgroundColor={backgroundColor}
        h={h}
        s={s}
        v={v}
      />
      <View
        style={{
          width: r * 2,
          height: r * 2,
          alignSelf: "center",
        }}
      >
        <Circle ShaderValue={ShaderValue} />

        <Cursor backgroundColor={backgroundColor} v={v} h={h} s={s} />
      </View>
      <Footer onTextChange={onTextChange} hexText={hexText} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
