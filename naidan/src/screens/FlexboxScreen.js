import React from "react";
import { StyleSheet, Text, View } from "react-native";

const FlexboxScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: "#2F363F",
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "stretch"
        }}
      >
        <View style={{ backgroundColor: "#2475B0", flex: 4 }}></View>
        <View style={{ backgroundColor: "#E83350", flex: 3 }}></View>
        <View
          style={{
            backgroundColor: "#01CBC6",
            flex: 5,
            flexDirection: "column"
          }}
        >
          <View style={{ backgroundColor: "black", flex: 1 }}></View>
          <View style={{ backgroundColor: "blue", flex: 3 }}></View>
          <View style={{ backgroundColor: "green", flex: 2 }}></View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#2F363F",
          flex: 5,
          flexDirection: "column",
          justifyContent: "space-evenly",
          alignItems: "stretch"
        }}
      >
        <View style={{ backgroundColor: "#758AA2", flex: 4 }}></View>
        <View style={{ backgroundColor: "#F3B431", flex: 3 }}></View>
        <View style={{ backgroundColor: "#019031", flex: 5 }}></View>
      </View>
    </View>
  );
};

export default FlexboxScreen;

const styles = StyleSheet.create({});
