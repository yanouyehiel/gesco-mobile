import { MaterialIcons } from "@expo/vector-icons"
import { SafeAreaView, StyleSheet, Text, View, Animated, TouchableOpacity, Button } from "react-native"
import { colors } from "@/utils/colors"
import { dateParser } from "@/utils/fonctions"
import { useCallback, useMemo, useRef, useState } from "react"

export const EventItem = ({event}: any) => {
    
  return (
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
  )
}

const styles = StyleSheet.create({
  event: {
    flex: 1,
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
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
})

export default EventItem