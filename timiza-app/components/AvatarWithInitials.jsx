import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

const AvatarWithInitials = ({ name }) => {
  const [initials, setInitials] = useState("");
  const [bg, setBg] = useState("#E0E0E0");

  useEffect(() => {
    if (name) {
      const nameParts = name.trim().split(" ");
      const initialLetters = nameParts
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
      setInitials(initialLetters);

      // Generate a random background color
      const randomColor = generateRandomColor();
      setBg(randomColor);
    }
  }, [name]);

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 50,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text className="font-pbold text-white text-2xl">{initials}</Text>
    </View>
  );
};

export default AvatarWithInitials;
