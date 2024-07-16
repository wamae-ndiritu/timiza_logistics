import { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { icons } from "../constants";
import TabBar from "./TabBar";

const HeaderComponent = ({title, inputPlaceHolder, links, containerStyles, showSearch=false}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className={`w-full bg-secondary px-4 ${containerStyles}`}>
      <View className='flex-row justify-between'>
        <Text className='font-pbold text-primary text-3xl'>{title}</Text>
        {isSearching ? (
          <View className='flex-row items-center bg-white rounded-lg px-2'>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={inputPlaceHolder}
              placeholderTextColor='#888'
              className='bg-white text-black rounded-lg py-1 w-48'
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
            >
              <Image
                source={icons.close}
                resizeMode='contain'
                className='h-4 w-4 ml-2'
              />
            </TouchableOpacity>
          </View>
        ) : (
          showSearch && <TouchableOpacity onPress={() => setIsSearching(true)}>
            <Image
              source={icons.search}
              resizeMode='contain'
              className='h-6 w-6'
            />
          </TouchableOpacity>
        )}
      </View>
      <TabBar links={links} />
    </View>
  );
};


export default HeaderComponent;