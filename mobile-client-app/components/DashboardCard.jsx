import { Image, Text, View } from "react-native";

const DashboardCard = ({ title, stats, containerStyles, textStyles, icon=null }) => {
  return (
    <View
      className={`mt-3 p-4 rounded shadow-md mb-2 mx-0 ${containerStyles} flex-row items-center`}
    >
      {icon && (
        <View className='h-12 w-12 bg-primary rounded-full flex items-center justify-center mr-2'>
          <Image source={icon} className='h-8 w-8 rounded-lg' resizeMode='contain' />
        </View>
      )}
      <View className="flex-col">
        <Text className={`text-xl font-psemibold text-black-300 ${textStyles}`}>
          {title}
        </Text>
        <Text className={`text-2xl font-pbold text-primary text-white`}>
          {stats}
        </Text>
      </View>
    </View>
  );
};


export default DashboardCard;