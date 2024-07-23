import { Link, usePathname } from "expo-router";
import React from "react";
import { View } from "react-native";

const TabBar = ({ links }) => {
  const pathname = usePathname();
  return (
    <View className='flex-row my-3 space-x-2'>
      {links?.map((link) => (
        <Link
          href={link.route}
          key={link.id}
          className={`text-lg w-24 px-2 py-0.5 rounded text-center ${
            link.route === pathname ? "bg-orange text-white" : "bg-primary text-gray-600"
          }`}
        >
          {link.title}
        </Link>
      ))}
    </View>
  );
};

export default TabBar;
