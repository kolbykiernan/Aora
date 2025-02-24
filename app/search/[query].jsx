import { View, Text, FlatList } from 'react-native'

import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import SearchInput from '../../components/SearchInput'
import { searchPosts } from '../../library/appwrite'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'
import useAppwrite from '../../library/useAppwrite'
import { useLocalSearchParams } from 'expo-router'



const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(
    () => searchPosts(query)
  );

  useEffect(() => {
    refetch()
  }, [query])
  

  const onRefresh = async () => {
    setRefreshing(true);
      await refetch();
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search Results
            </Text>
            <Text className="text-2xl font-psemibold text-white">
              {query}
            </Text>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            subtitle="No videos found for this search query"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Search