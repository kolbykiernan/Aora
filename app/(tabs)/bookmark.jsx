import { View, Alert, Text, FlatList, Image, RefreshControl } from 'react-native'

import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'

import { getSavedPosts, getCurrentUser } from '../../library/appwrite'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'


const Bookmark = () => {
  const { user } = useGlobalContext();
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSavedPosts = async () => {
      try {
        const currentUser = await getCurrentUser();
        const savedPosts = await getSavedPosts(currentUser.accountId);
        setPosts(savedPosts);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, [user]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSavedPosts();
        setRefreshing(false);
    };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="text-2xl font-psemibold text-white mt-4">
                  Saved Videos
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput
              placeholder="Search your saved videos"
            />

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Bookmark