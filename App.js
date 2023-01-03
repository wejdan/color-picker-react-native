import { StyleSheet, Text, Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useState } from "react";

import {
  useSharedValue,
  runOnJS,
  useDerivedValue,
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
  HSVtoRGB,
  rgbToHsv,
} from "./colorConvert";
const { height, width } = Dimensions.get("window");

const SIZE = width * 0.8;
const r = SIZE / 2;

export default function App() {
  const h = useSharedValue(0);
  const s = useSharedValue(0);
  const v = useSharedValue(1);
  const [ShaderValue, setShaderValue] = useState(1.0);
  const [hexText, sethexText] = useState("");

  const backgroundColor = useDerivedValue(() => {
    const rgb = HSVtoRGB((360 - h.value) / 360, s.value, v.value);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    runOnJS(sethexText)(hex);

    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  });
  const onTextChange = (text) => {
    const rgb = hexToRgb(text);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      h.value = hsv.h;
      s.value = hsv.s;
      v.value = hsv.v;
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
