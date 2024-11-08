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
          className={`text-lg w-20 h-6 px-1 py-0.5 rounded text-center text-sm ${
            link.route === pathname ? "bg-white text-green-500" : "bg-primary"
          }`}
        >
          {link.title}
        </Link>
      ))}
    </View>
  );
};

export default TabBar;
