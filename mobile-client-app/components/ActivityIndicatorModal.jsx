import { View, Text, Modal, ActivityIndicator } from 'react-native'
import React from 'react'

const ActivityIndicatorModal = ({visible, transparent, onClose, description}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType='slide'
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      >
        <View
          style={{ padding: 20, backgroundColor: "white", borderRadius: 10 }}
        >
          <ActivityIndicator size='large' color='#2A7353' />
          <Text style={{ marginTop: 10 }}>{description}</Text>
        </View>
      </View>
    </Modal>
  );
}

export default ActivityIndicatorModal