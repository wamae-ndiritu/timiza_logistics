import React from "react";
import { TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ActionButton = ({ type = "edit", handlePress }) => {
  return (
    <TouchableOpacity
      className={`w-20 h-12 rounded-lg flex-row items-center justify-center mb-3 py-2 ${
        type === "edit" ? "bg-green-600" : type === "delete" && "bg-red-600"
      }`}
      onPress={handlePress}
    >
      <View>
        {type === "edit" ? (
          <Icon name='edit' size={24} color='white' />
        ) : (
          type === "delete" && <Icon name='trash-2' size={24} color='white' />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
