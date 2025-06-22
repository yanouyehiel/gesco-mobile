import { View, FlatList } from 'react-native'
import React from 'react'
import SkeletonComponent from '@/components/SkeletonComponent'
import Heading from '@/components/Heading'
import NoData from '@/components/NoData'

const Slider = ({ 
    titleHeading, 
    slider, 
    Component, 
    headers, 
    user, 
    style, 
    loading 
}) => {
  
    return (
        <View style={style}>
            <Heading text={titleHeading} />
            {loading ?
                <View style={{ flexDirection: 'row'}}>
                    {[0, 1, 2].map((t, i) => (
                        <SkeletonComponent key={i} />
                    ))}
                </View>
                :
                <FlatList 
                    data={slider}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item, i}) => (
                        <Component item={item} headers={headers} user={user} key={i} />
                    )}
                />
            }
            {(!loading && slider.length === 0) &&
                <NoData />
            }
        </View>
    )
}

export default Slider