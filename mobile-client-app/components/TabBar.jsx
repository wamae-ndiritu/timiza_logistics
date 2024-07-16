import { router, useNavigation, usePathname } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const TabBar = ({links}) => {
  const [activeTab, setActiveTab] = useState("");
  const navigation = useNavigation();
  const pathname = usePathname();
  return (
    <View className=''>
      <View className='flex-row justify-around'>
        {links?.map((link) => (
          <TouchableOpacity
            key={link.id}
            onPress={() => {
              setActiveTab("staff");
              router.push(link.route)
            }}
            className={`flex-1 items-center py-4 ${
              link.route === pathname ? "border-b-2 border-orange" : ""
            }`}
          >
            <Text
              className={`text-lg ${
                link.route === pathname ? "text-orange" : "text-primary"
              }`}
            >
              {link.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default TabBar;
