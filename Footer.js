import {
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import * as Clipboard from "expo-clipboard";
const { height, width } = Dimensions.get("window");

const Footer = ({ hexText, onTextChange }) => {
  function showToast() {
    ToastAndroid.show("Copied To Clipboard", ToastAndroid.SHORT);
  }
  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(hexText);
    showToast();
  };

  return (
    <View
      style={{
        width,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        onFocus={copyToClipboard}
        onChangeText={onTextChange}
        style={{ backgroundColor: "white" }}
        value={hexText}
        placeholder="useless placeholder"
        keyboardType="numeric"
      />
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({});
