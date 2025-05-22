import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default function MyInputArea(props) {
  return (
    <TextInput
      multiline={true}
      numberOfLines={5}
      autoCapitalize="none"
      autoCorrect={false}
      keyboardType="number-pad"
      {...props}
      style={[css.inputField, props.style]}
    >
      Message : {props.children}
    </TextInput>
  );
}

const css = StyleSheet.create({
  inputField: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10
  }
});
