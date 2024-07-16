import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";

export default function CustomRadioButton({ options, title, handlePress }) {
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
    }
  }, [selectedId]);

  return (
    <View className='mb-3'>
      <Text className='text-base text-gray-600 text-lg font-pmedium'>
        {title}
      </Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={setSelectedId}
        selectedId={selectedId}
        layout='row'
      />
    </View>
  );
}
