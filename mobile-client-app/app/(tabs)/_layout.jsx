import { View, Text, Image } from "react-native";
import { router, Tabs } from "expo-router";
import Icon from "react-native-vector-icons/Feather";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className='items-center justify-center gap-2'>
      <Icon name={icon} size={24} color={color} />
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
          tabBarInactiveTintColor: "#2A7353",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
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
                icon='home'
                color={color}
                name='Home'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='trip'
          options={{
            title: "Trips",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='truck'
                color={color}
                name='Trips'
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
                icon='truck'
                color={color}
                name='Deliveries'
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='staff'
          options={{
            title: "Staff",
            headerShown: false,
            href: isAdmin ? "/staff" : null,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='users'
                color={color}
                name='Staffs'
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
            href: "/profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='user'
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
