import { Image, Text, View } from "react-native";

const DashboardCard = ({ title, stats, containerStyles, textStyles, icon=null, color="bg-white" }) => {
  return (
    <View
      className={`mt-3 p-4 rounded shadow-md mb-2 mx-0 ${containerStyles} flex-row items-center ${color}` }
    >
      {icon && (
        <View className='h-12 w-12 bg-primary rounded-full flex items-center justify-center mr-2'>
          <Image source={icon} className='h-8 w-8 rounded-lg' resizeMode='contain' />
        </View>
      )}
      <View className="flex-col">
        <Text className={`text-xl text-gray-700 ${textStyles}`}>
          {title}
        </Text>
        <Text className={`text-2xl text-center text-secondary`}>
          {stats}
        </Text>
      </View>
    </View>
  );
};


export default DashboardCard;