import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const ActionButton = ({ type = "edit", handlePress }) => {
  return (
    <TouchableOpacity
      className={`w-1/2 mb-4 p-4 bg-white border border-gray-300 rounded-lg flex-row items-center space-x-4 ${
        type === "edit" ? "bg-secondary" : type === "delete" && "bg-red-500"
      }`}
      onPress={handlePress}
    >
      {type === "edit" ? (
        <>
          <Icon name='edit' size={24} color='white' />
          <Text className='text-white text-lg font-semibold'>Edit</Text>
        </>
      ) : (
        type === "delete" && (
          <>
            <Icon name='trash-2' size={24} color='white' />
            <Text className='text-white text-lg font-semibold'>Delete</Text>
          </>
        )
      )}
    </TouchableOpacity>
  );
};


export default ActionButton;
