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
                  className='bg-white text-black text-lg rounded-l-full pl-4 py-1 w-48 h-10'
                />
                <TouchableOpacity
                className="bg-orange h-10 w-10 flex-row items-center rounded-r-full"
                  onPress={() => {
                    setIsSearching(false);
                    setSearchQuery("");
                  }}
                >
                  <Image
                    source={icons.close}
                    resizeMode='contain'
                    className='h-6 w-6 ml-2'
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => setIsSearching(true)} className='px-2 h-8 w-12 flex-row items-center justify-center rounded-full'>
                <Image
                  source={icons.search}
                  resizeMode='contain'
                  className='h-8 w-8'
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
