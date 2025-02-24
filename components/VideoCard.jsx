import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '../constants'
import Heart from './Heart'
import { useState } from 'react'
import { Video, ResizeMode } from 'expo-av';
import { useGlobalContext } from '../context/GlobalProvider'

const VideoCard = ({ video: {  $id, title, thumbnail, video, likes, creator: { username, avatar }} }) => {
    const { user } = useGlobalContext();
    const [play, setPlay] = useState(false);

    const initialLiked = likes ? likes.includes(user.accountId) : false;

  return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-.5">
                    <Image 
                        source={{ uri: avatar}}
                        className="w-full h-full rounded-lg"
                        resizeMode='cover' 

                    />
                </View>
                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm">
                        {title}
                    </Text>
                    <Text 
                        className="text-xs text-gray-100 font-pregular" 
                        numberOfLines={1}>
                        {username}
                    </Text>   
                </View>
            </View>
            <View className="pt-2">
                <Heart 
                    initialLiked={initialLiked}
                    postId={$id}
                    accountId={user.accountId}
                />
            </View>
        </View>
        {play ? (            
            <Video 
                source={{ uri: video }}
                className="w-full h-60 rounded-xl mt-3"
                resizeMode={ResizeMode.CONTAIN}
                useNativeControls
                shouldPlay
                onPlaybackStatusUpdate={(status) => {
                    if(status.didJustFinish) {
                        setPlay(false)
                    }
                }}
            />
        ) : (
            <TouchableOpacity
                className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                activeOpacity={.7}
                onPress={() => setPlay(true)}
            >
                <Image 
                    source={{ uri: thumbnail }}
                    className="w-full h-full rounded-xl mt-3"
                    resizeMode="cover"
                />
                <Image 
                    source={icons.play}
                    className="w-12 h-12 absolute"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        )}
    </View>
  )
}

export default VideoCard