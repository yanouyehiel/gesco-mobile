import { View, Text, StyleSheet, ImageBackground, Image,ScrollView } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { colors } from '../utils/colors'


const SideBar = (props) => {

  return (
    <DrawerContentScrollView {...props}>
      <ScrollView>
        <ImageBackground 
            style={{padding: 16, paddingTop: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center'}}
        >
            <Image source={require("@/assets/images/classe.png")} style={styles.image} />
            <View>
                <Text style={styles.name}>{props.classe.nom}</Text>
                <Text>{props.classe.nom_ecole}</Text>
            </View>
        </ImageBackground>

        <View style={{ borderBottomColor: colors.BLEU, borderBottomWidth: 1 }} />

        <View style={styles.container}>
            <DrawerItemList 
                {...props}
                itemStyle={{ marginVertical: 5 }}
                onPress={(route) => {
                    props.navigation.navigate(route.route.name);
                }}
                activeLabelStyle={{
                    color: colors.BLANC,
                    fontWeight: 'bold'
                }}
                activeItemStyle={{
                    backgroundColor: colors.BLEU_CLAIR
                }}
            />
        </View>
      </ScrollView>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50
    },
    image: {
        width: 80,
        height: 80
    },
    name: {
        color: colors.NOIR,
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 8
    }
})

export default SideBar