import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  textStyles="",
  inputStyles="",
  type="text",
  editable=true,
  ...props
}) => {
  const [showPasssord, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {title && (
        <Text
          className={`text-base text-gray-600 text-lg font-pmedium ${textStyles}`}
        >
          {title}
        </Text>
      )}
      <View
        className={`border-[1px] border-gray-300 w-full h-12 px-4 bg-slate-300 bg-transparent rounded focus:border-secondary items-center flex-row ${inputStyles}`}
      >
        <TextInput
          className={`flex-1 text-white font-pregular text-gray-600 text-lg`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor='#7b7b8b'
          onChangeText={handleChangeText}
          secureTextEntry={
            (title === "Password" || type === "password") && !showPasssord
          }
          cursorColor='#7b7b8b'
          editable={editable}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPasssord)}>
            <Image
              source={!showPasssord ? icons.eye : icons.eyeHide}
              className='w-6 h-6'
              resizeMode='contain'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
