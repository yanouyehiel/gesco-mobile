import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { dateParser, longueurTexte } from "@/utils/fonctions"
import { colors } from "@/utils/colors"

const Calendar = ({calendar}) => {
  return (
    <View style={styles.event}>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <MaterialIcons 
          name="event" 
          size={24} 
          color={calendar.id%2==0 ? colors.VERT : colors.BLEU_CLAIR} 
        />
      </View>
      
      <View style={styles.eventItem}>
        <Text style={{fontSize: 17}}>{longueurTexte(calendar.titre, 25)}</Text>
        <View>
          <Text style={{color: colors.NOIR}}>Date : {calendar.date}</Text>
          <Text style={{color: colors.NOIR}}>Enregistré le {dateParser(calendar.created_at)}</Text>
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

export default Calendar