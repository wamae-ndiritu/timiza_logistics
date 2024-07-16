import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import HeaderComponent from "../../../components/HeaderComponent";

const Staff = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const onRefresh = async () => {
    setRefreshing(true);
    // await refetch();
    setRefreshing(false);
  };
  return (
    <SafeAreaView className='h-full'>
      <FlatList
        className=''
        data={[
          {
            id: 1,
            fullName: "Wamae Joseph Ndiritu",
            role: "driver",
            email: "wamaejoseph392@gmail.com",
            ntionalId: "39840260",
          },
          {
            id: 2,
            fullName: "Susan Nakhumicha Kirwa",
            role: "loader",
            email: "susannakumicha@gmail.com",
            ntionalId: "39825610",
          },
        ]}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <HeaderComponent
            title='Staff'
            inputPlaceHolder='Search staff'
            containerStyles='pt-16 pb-8'
            showSearch={true}
            links={[
              { id: 0, title: "Staff", route: "/staff" },
              { id: 1, title: "Add Staff", route: "/register-staff" },
            ]}
          />
        )}
        renderItem={({ item }) => (
          <View className='px-2 my-2'>
            <View className='bg-white p-2'>
              <View className='border-b-[1px] border-dotted border-secondary py-2 flex-row justify-between'>
                <Text className='capitalize text-gray-600'>
                  {item.fullName}
                </Text>
                <Text
                  className={`w-20 text-center px-2 py-0.5 rounded-full text-sm text-white capitalize ${
                    item.role === "driver" ? "bg-orange-500" : "bg-green-500"
                  }`}
                >
                  {item.role}
                </Text>
              </View>
              <View className='flex-row justify-between items-center py-1'>
                <Text className='font-pmedium'>Email</Text>
                <Text className='text-gray-600'>{item.email}</Text>
              </View>
              <View className='flex-row justify-between items-center py-1'>
                <Text className='font-pmedium'>ID NO</Text>
                <Text className='text-gray-600'>{item.ntionalId}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Staff;
