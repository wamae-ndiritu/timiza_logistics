import {
  View,
  Text,
  SafeAreaView,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listLocations } from "../../lib/redux/actions/locationActions";
import EmptyState from "../../components/EmptyState";
import TopBar from "../../components/TopBar";
import Icon from "react-native-vector-icons/Feather";
import { Link, router, useNavigation } from "expo-router";
import AdminRoute from "../../components/AdminRoute";

const Locations = () => {
  const dispatch = useDispatch();
  const { locations, loading, error } = useSelector((state) => state.location);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(listLocations());
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(listLocations());
    }, [dispatch])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        router.push(`/locations/view/${item._id}`);
      }}
      className='p-4 m-2 bg-white rounded-lg'
    >
      <View className='flex-row justify-between'>
        <Text className='text-lg font-semibold text-gray-700'>{item.name} {item.type}</Text>
      </View>
      <View className=''>
        <Text className='text-orange'>
          {item.branches.length}{" "}
          {item.branches.length === 1 ? "Branch" : "Branches"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <AdminRoute>
      <SafeAreaView className='flex-1 pt-4'>
        <TopBar title='Locations'>
          <Link href='/locations/new'>
            <Icon name='plus' size={24} color='#FFF' />
          </Link>
        </TopBar>

        <FlatList
          data={locations}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <EmptyState
              title='No Locations Found'
              subtitle='Click the plus button to add a new location.'
            />
          )}
        />
      </SafeAreaView>
    </AdminRoute>
  );
};

export default Locations;
