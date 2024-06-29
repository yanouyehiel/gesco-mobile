import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Skeleton } from 'moti/skeleton'
import { skeletonProps } from '@/utils/skeletonProps'


const SkeletonComponent = () => {
  return (
    <View style={styles.sliderItem}>
        {/* <Skeleton 
          show={true}
          width={'100%'}
          height={130}
          {...skeletonProps}
        ></Skeleton> */}
        
        <View style={styles.sliderBottom}>
          <Skeleton
            show={true}
            height={'100%'}
            width={70}
            {...skeletonProps}
          ></Skeleton>
          <Skeleton
            show={true}
            height={'100%'}
            width={140}
            {...skeletonProps}
          ></Skeleton>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sliderItem: {
    width: 200,
    height: 80,
    marginRight: 30,
    borderRadius: 20,
  },
  sliderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    gap: 5
  }
})

export default SkeletonComponent