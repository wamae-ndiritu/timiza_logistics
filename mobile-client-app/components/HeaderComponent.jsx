import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { icons } from "../constants";
import TabBar from "./TabBar";

const HeaderComponent = ({
  title,
  inputPlaceHolder,
  links,
  containerStyles,
  showSearch = false,
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  isSearching,
  setIsSearching
}) => {
  
  

  return (
    <View className={`w-full bg-secondary px-4 z-[99] ${containerStyles}`}>
      <View className='flex-row justify-between items-center'>
        <Text className='font-pbold text-primary text-3xl'>{title}</Text>
        {showSearch && (
          <>
            {isSearching ? (
              <View className='h-8 flex-row items-center bg-white rounded-full'>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  // onEndEditing={}
                  onSubmitEditing={handleSearchSubmit}
                  placeholder={inputPlaceHolder}
                  placeholderTextColor='#888'
                  className='bg-white text-black rounded-l-full pl-4 py-1 w-48'
                />
                <TouchableOpacity
                className="bg-orange h-8 w-8 flex-row items-center rounded-r-full"
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
              <TouchableOpacity onPress={() => setIsSearching(true)} className='border-[1px] border-gray-300 px-2 h-8 w-12 flex-row items-center justify-center bg-orange rounded-full'>
                <Image
                  source={icons.search}
                  resizeMode='contain'
                  className='h-6 w-6'
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <TabBar links={links} />
    </View>
  );
};

export default React.memo(HeaderComponent);
