import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { updatePostLikes } from '../library/appwrite';
import icons from '../constants/icons'; // Adjust the path as needed

const Bookmark = ({ initialLiked = false, postId, accountId }) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    try {
      await updatePostLikes(postId, accountId, !liked);
      setLiked(!liked);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleLike}>
        <Image
          source={icons.bookmark}
          style={{ 
            width: 20, 
            height: 20, 
            marginTop: 2.5,
            marginRight: 2.5,
            tintColor: liked ? '#FF9C01' : undefined 
          }}
          resizeMode='contain'
        />
      </TouchableOpacity>
    </View>
  );
};

export default Bookmark;
