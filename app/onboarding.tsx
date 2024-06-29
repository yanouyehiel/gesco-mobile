import { View, Text, FlatList, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { slidesOnboarding } from '@/utils/slides'
import OnboardingItem from '@/components/OnboardingItem'
import Paginator from '@/components/Paginator'
import NextButton from '@/components/NextButton'
import { colors } from '@/utils/colors'
import { useNavigation } from '@react-navigation/native'

const Onboarding = () => {
  const scrollX = useRef(new Animated.Value(0)).current
  const [currentIndex, setCurrentIndex] = useState(0)
  const slidesRef = useRef(null)
  const navigate = useNavigation()

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index)
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollTo = () => {
    if (currentIndex < slidesOnboarding.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1})
    } else {
      console.log('Last item')
    }
  }
  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList 
          data={slidesOnboarding}
          renderItem={({ item }) => <OnboardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX }}}], {
            useNativeDriver: false
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <Paginator data={slidesOnboarding} scrollX={scrollX} />

      <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slidesOnboarding.length)} />
      
      <TouchableOpacity onPress={() => navigate.navigate('(tabs)')}>
        <Text 
          style={styles.slideEnd}
        >Passer</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BLANC
  },
  slideEnd: {
    color: colors.BLEU, 
    fontFamily: 'Regular', 
    fontSize: 30,
    padding: 20
  }
})

export default Onboarding