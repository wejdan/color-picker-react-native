import { StyleSheet, Text, Dimensions, StatusBar, View } from "react-native";
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
const clamp = (value, min, max) => {
  "worlet";
  return Math.max(Math.min(value, max), min);
};
const CURSOR_WIDTH = 20;
const Header = ({ h, s, v, setShaderValue, backgroundColor }) => {
  const x = useDerivedValue(() => {
    return v.value * width - CURSOR_WIDTH / 2;
  });

  useDerivedValue(() => {
    runOnJS(setShaderValue)(x.value / width);
  });
  const offsetX = useSharedValue(0);
  const cursorColor = useSharedValue("white");
  const gesture = Gesture.Pan();
  gesture.onBegin(() => {
    offsetX.value = x.value;
  });
  gesture.onUpdate((e) => {
    const tmpX = clamp(
      e.translationX + offsetX.value,
      CURSOR_WIDTH / 2,
      width - CURSOR_WIDTH / 2
    );
    x.value = tmpX;
    v.value = Math.min(tmpX / width, 1);
  });
  const containerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });
  const rnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value - 25 }],
    };
  });
  const cursorStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: cursorColor.value,
    };
  });
  return (
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
          height: 50,
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
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            },
            rnStyle,
          ]}
        >
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
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({});
