import { Text, View, StyleSheet, TouchableOpacity, ScrollView, FlatList, RefreshControl } from "react-native";
import { Link } from 'expo-router'
import { useAuth } from "@clerk/clerk-expo";
import {useRouter} from "expo-router"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@../../src/components/constants/theme";
import { styles } from "@../../src/utils/styles/feed.style";
import { STORIES } from "@../../src/components/constants/mock-data";
import Story from "@../../src/components/constants/story";
import { useQuery} from "convex/react"
import { Loader } from "@../../src/components/constants/Loader";
import { api } from "@../../convex/_generated/api";
import Post from "@../../src/components/constants/Posts"; // Import the Post component
import React, { useState } from "react";



export default function Index() {
const {signOut} = useAuth ();
const router = useRouter();
const [refreshing, setRefreshing]=useState(false)

const posts = useQuery(api.post.getFeedPosts)
if (posts === undefined) return <Loader/>
if (posts.length === 0) return <NoPostsFound/>

const onRefresh = () => {}

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log("✅ Signed out successfully");
      router.replace("/(auth)/login"); // Redirect to login screen after sign-out
    } catch (error) {
      console.error("❌ Error signing out:", error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems:"center",
       backgroundColor:'black',
       justifyContent:"center",
     
      }}
    >
     {/*header*/}
     <View style={styles.header}>
   <Text style={styles.headerTitle}>sunflower</Text>
<TouchableOpacity onPress = {handleSignOut}>
<Ionicons name="log-out-outline" size={24} color={COLORS.white} />
</TouchableOpacity>



</View>
 <FlatList
 data={posts}
 renderItem={({item}) => <Post post={item}/>}
 keyExtractor={(item) => item._id}
 contentContainerStyle={{paddingBottom:60}}
 ListHeaderComponent={<StoriesSection/>}
refreshControl={
  <RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  tintColor={COLORS.primary}
  />
}

 />
</View>
   
        
  );
}

const StoriesSection = () => {
  return (
   
<ScrollView
horizontal
showsHorizontalScrollIndicator={false}
style={styles.stroiesContainer}
>
 {STORIES.map((story) => ( 
<Story key={story.id} story={story}/>
 ))}
</ScrollView>
  )
}


const NoPostsFound = () => (
  <View style={{flex:1,
     backgroundColor: COLORS.background, 
     justifyContent:"center", 
     alignItems:"center"}}>
      <Text style={{fontSize:20, color: COLORS.primary}}>No posts yet</Text>
     </View>
)