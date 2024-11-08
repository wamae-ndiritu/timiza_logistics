import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

export default function CustomRadioButton({ options, title, handlePress, selectedValue="", mode="" }) {
  const radioButtons = useMemo(() => options, []);
  const [selectedId, setSelectedId] = useState();

  useEffect(() => {
    if (selectedId) {
      const selectedOption = options?.find(
        (option) => option.id === selectedId
      );
      if (selectedOption) {
        handlePress(selectedOption?.value);
      }
    } else if (selectedValue) {
      const selectedOption = options?.find(
        (option) => option.value === selectedValue
      );
      if (selectedOption) {
        setSelectedId(selectedOption.id);
      }
    }
  }, [selectedId, selectedValue]);

  return (
    <View className='mb-3'>
      <Text className='text-base text-gray-600 text-lg font-pmedium'>
        {title}
      </Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={mode==="view" ? () => {} : setSelectedId}
        selectedId={selectedId}
        layout='row'
      />
    </View>
  );
}
