import { StyleSheet, Text, Dimensions, StatusBar, View } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  useDerivedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { HSVtoRGB, HueShift } from "./colorConvert";
const { height, width } = Dimensions.get("window");
const clamp = (value, min, max) => {
  "worlet";
  return Math.max(Math.min(value, max), min);
};
const CURSOR_WIDTH = 20;

const Header = ({ v, h, s, setShaderValue, backgroundColor }) => {
  const x = useDerivedValue(() => {
    return v.value * width - CURSOR_WIDTH / 2;
  });

  useDerivedValue(() => {
    runOnJS(setShaderValue)(x.value / width);
  });
  const offsetX = useSharedValue(0);
  const gesture = Gesture.Pan();
  gesture.onBegin(() => {
    offsetX.value = x.value;
  });
  gesture.onUpdate((e) => {
    const tmpX = clamp(
      e.translationX + offsetX.value,
      CURSOR_WIDTH,
      width - CURSOR_WIDTH
    );
    x.value = tmpX;
    v.value = Math.min(tmpX / width, 1);
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  const cursorStyle = useAnimatedStyle(() => {
    const newHue = HueShift(h.value, 180);
    const rgb = HSVtoRGB((360 - newHue) / 360, 100, 100);

    return {
      backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      transform: [{ translateX: x.value - CURSOR_WIDTH / 2 }],
    };
  });
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            paddingTop: StatusBar.currentHeight,
            height: 100,
            borderRadius: 15,
            justifyContent: "flex-end",
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            position: "absolute",
            height: CURSOR_WIDTH,
            justifyContent: "center",
            alignItems: "center",
            width: width,
          }}
        >
          <View
            style={{
              height: 2,
              width: width - 20,
              backgroundColor: "#3e3e3e",
            }}
          />
        </View>

        <Animated.View
          style={[
            {
              width: CURSOR_WIDTH,
              height: CURSOR_WIDTH,
              borderRadius: CURSOR_WIDTH / 2,
            },
            cursorStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default Header;

const styles = StyleSheet.create({});
