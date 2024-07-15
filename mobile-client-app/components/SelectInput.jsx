import React from "react";
import { StyleSheet, View, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SelectInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  data,
  ...props
}) => {

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-black-300 text-lg font-pmedium'>
        {title}
      </Text>
      <View className='border-4 border-gray-300 w-full h-14  bg-transparent rounded-2xl focus:border-secondary items-center flex-row'>
        <SelectDropdown
          data={data}
          onSelect={(selectedItem, index) => {
            handleChangeText(selectedItem.title)
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View
                style={styles.dropdownButtonStyle}
              >
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Select your choice"}
                </Text>
                <Icon
                  name={isOpened ? "chevron-up" : "chevron-down"}
                  style={styles.dropdownButtonArrowStyle}
                />
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
    </View>
  );
};

export default SelectInput;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    color: "#959DA5",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#959DA5",
    marginLeft: 6,
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
