import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import HeaderComponent from "../../../components/HeaderComponent";
import { useDispatch, useSelector } from "react-redux";
import { listUsers } from "../../../lib/redux/actions/userActions";
import EmptyState from "../../../components/EmptyState";

const Staff = () => {
  const dispatch = useDispatch();
  const { usersList } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listUsers((type = ""), (search = "")));
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(listUsers("", ""));
  }, []);

  const links = [
    { id: 0, title: "List Staff", route: "/staff" },
    { id: 1, title: "Add Staff", route: "/register-staff" },
  ];

  return (
    <SafeAreaView className='h-full'>
      <HeaderComponent
        title='Staff'
        inputPlaceHolder='Type National ID and enter..'
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        handleSearchSubmit={() =>
          dispatch(listUsers((type = ""), (search = searchQuery)))
        }
        containerStyles='pt-10 pb-3'
        showSearch={true}
        links={links}
      />
      <FlatList
        className=''
        data={usersList}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View className='px-2 my-2'>
            <View className='bg-white p-2'>
              <View className='border-b-[1px] border-dotted border-secondary py-2 flex-row justify-between'>
                <Text className='capitalize text-gray-600'>
                  {item.fullName}
                </Text>
                <Text
                  className={`w-20 text-center px-2 py-0.5 rounded-full text-sm text-white capitalize ${
                    item?.user?.role === "driver"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                >
                  {item?.user?.role}
                </Text>
              </View>
              <View className='flex-row justify-between items-center py-1'>
                <Text className='font-pmedium'>Email</Text>
                <Text className='text-gray-600'>{item.email}</Text>
              </View>
              <View className='flex-row justify-between items-center py-1'>
                <Text className='font-pmedium'>ID NO</Text>
                <Text className='text-gray-600'>{item.nationalId}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No created users'
            subtitle='Click Add Staff to add both Drivers and Loaders'
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Staff;
