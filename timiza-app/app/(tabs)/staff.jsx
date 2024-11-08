import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  FlatList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUsers } from "../../lib/redux/actions/userActions";
import EmptyState from "../../components/EmptyState";
import TopBar from "../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import { Link, router } from "expo-router";
import { TouchableOpacity } from "react-native";

const Staff = () => {
  const dispatch = useDispatch();
  const { usersList, loading, error } = useSelector((state) => state.user);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listUsers((type = ""), (search = "")));
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(listUsers("", ""));
    }, [dispatch])
  );

  const links = [
    { id: 0, title: "List Staff", route: "/staff" },
    { id: 1, title: "Add Staff", route: "/register-staff" },
  ];

  return (
    <SafeAreaView className='flex-1 pt-4'>
      <TopBar title='Staff'>
        <Link href='/new-staff'>
          <Icon name='search' size={24} color='#FFF' />
        </Link>
        <Link href='/new-staff'>
          <Icon name='plus' size={24} color='#FFF' />
        </Link>
      </TopBar>
      <FlatList
        className=''
        data={usersList}
        keyExtractor={(item) => item._id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/users/view/${item.user?._id}`)}
            className='px-2 my-2'
          >
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
          </TouchableOpacity>
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
