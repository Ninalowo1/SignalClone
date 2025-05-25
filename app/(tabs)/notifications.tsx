import { View, Text, FlatList, TouchableOpacity,  } from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { Loader } from '@/components/constants/Loader';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/utils/styles/notifications.styles';
import { COLORS } from '@/components/constants/theme';
import { Link } from 'expo-router';
import { Image } from 'expo-image';

export default function notifications() {
const notifications = useQuery(api.notifications.getNotifications);

if (notifications === undefined) return <Loader/>
if  (notifications.length ===0) return <NoNotificationsFound/>

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={styles.headerTitle}>Notifications</Text>
      </View>

   

   <FlatList  
      data={notifications}
      keyExtractor={(item) => item._id}
      renderItem={({item}) => <NotificationItem notification={item} />}
      contentContainerStyle={styles.listContainer}   
      showsVerticalScrollIndicator={false}
      />  
     </View> 


  );
}

function NotificationItem ({notification}: any) {
return(
<View style={styles.notificationContent}>
  <Link href={`/notification`} asChild>
  <TouchableOpacity style={styles.avatarContainer}>
<Image
source={notification.sender.image}
style={styles.avatar}
contentFit="cover"
transition={200}
/>
<View style={styles.iconBadge}>
  {notification.type === "like" ? (
 <Ionicons name="heart" size={14} color={COLORS.primary}/>
  ) : notification.type=== "follow" ? (
    <Ionicons name="person-add" size={14} color="#8B5CF6"/>

  ) : (
<Ionicons name="chatbubble" size={14} color="#3B82F6"/>
  ) 
}
</View>
  </TouchableOpacity>
  </Link>
</View>

)

}

function NoNotificationsFound(){
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={48} colors= {COLORS.surfaceLight}/>
      <Text style={{fontSize:20, color: COLORS.white}}>No notifications yet</Text>
    </View>
  )
}