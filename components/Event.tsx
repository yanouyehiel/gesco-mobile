import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView, StyleSheet, Text, View, Animated, TouchableOpacity } from "react-native"
import { colors } from "@/utils/colors"
import { dateParser } from "@/utils/fonctions"
import { useRef, useState } from "react"
import Modal from 'react-native-modal';

export const EventItem = ({event}: any) => {
  const [visible, setVisible] = useState<any>(false)
  console.log(event)
    
  return (
    <TouchableOpacity onPress={() => setVisible(!visible)}>
      <View style={styles.event}>
        <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <MaterialIcons 
            name="event" 
            size={24} 
            color={event.id%2==0 ? colors.VERT : colors.BLEU_CLAIR} 
          />
        </View>
        
        <View style={styles.eventItem}>
          <Text style={{fontSize: 20}}>{event.title}</Text>
          <View>
            <Text style={{color: colors.NOIR}}>Débute le {dateParser(event.start)}</Text>
            <Text style={{color: colors.NOIR}}>Fini le {dateParser(event.end)}</Text>
          </View>
        </View>
      </View>

      <Modal
        isVisible={visible}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
        }}
      >
        <View>
          <Animated.View /*style={[
            styles.popup, 
            {opacity: scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]})},
            {
              transform: [{scale: scale}]
            }]}*/>
              <Text>{event?.title}</Text>
              <Text>{event?.description}</Text>
              <Text>{event?.start}</Text>
              <Text>{event?.end}</Text>
          </Animated.View>
        </View>
      </Modal>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  event: {
    backgroundColor: '#f2f2f2',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10
  },
  eventItem: {
    flexDirection: 'column',
    marginLeft: 20
  },
})

export default EventItem