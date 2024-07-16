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
        data={[{ id: 1, name: "Wamae Ndiritu" }]}
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
          <View className='bg-secondary-500'>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Staff;
