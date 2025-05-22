import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import MyButton from "../components/MyButton";
import MyInput from "../components/MyInput";

export default function({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    Alert.alert(`Таны утас: ${phone}, нууц үг: ${password}`);
  };

  return (
    <View>
      <Image
        style={{ width: "100%", height: "50%" }}
        source={require("../../assets/img/shop.png")}
      />
      <Text style={{ textAlign: "center", fontSize: 20 }}>
        {phone} - {password}
      </Text>

      <MyInput
        askeyboardType="number-pad"
        placeholder="Та утасны дугааараа оруулна уу"
        onChangeText={setPhone}
      />

      <MyInput
        secureTextEntry={true}
        placeholder="Нууц үгээ оруулна уу"
        onChangeText={setPassword}
      />

      <MyButton title="Нэвтрэх" onPress={loginHandler} />
      <MyButton title="Буцах" onPress={() => navigation.pop()} />
    </View>
  );
}

const css = StyleSheet.create({
  inputField: {
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10
  },
  button: {
    marginVertical: 5
  }
});
