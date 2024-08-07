import { View, Text, Image } from "react-native";
import { Redirect, router, Tabs } from "expo-router";

import { icons } from "../../constants";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center gap-2'>
      <Image
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className='w-6 h-6'
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
   const { userData } = useSelector((state) => state.user);

   useEffect(() => {
     if (!userData?.token) {
       router.replace("/sign-in");
     }
   }, [userData]);

   if (!userData?.token) {
     return null; // or a loading spinner, or a placeholder
   }

   const isAdmin = userData?.user?.role === "admin"
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#F8981D",
          tabBarInactiveTintColor: "#FFFFFF",
          tabBarStyle: {
            backgroundColor: "#2A7353",
            borderTopWidth: 1,
            borderTopColor: "#f9fafb",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false,
            href: isAdmin ? "/home" : "/userhome",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name='Home'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='(deliveries)'
          options={{
            title: "Deliveries",
            headerShown: false,
            href: "/list",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.deliveryTruck}
                color={color}
                name='Deliveries'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='userhome'
          options={{
            title: "Home",
            headerShown: false,
            href: null,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.deliveryTruck}
                color={color}
                name='Deliveries'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='(staff)'
          options={{
            title: "Staff",
            headerShown: false,
            href: isAdmin ? "/staff" : null,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.driver}
                color={color}
                name='Staff'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name='Account'
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
