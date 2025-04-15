import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Link } from 'expo-router'
import { useAuth } from "@clerk/clerk-expo";
import {useRouter} from "expo-router"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/feed.style";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/story";
import { useQuery} from "convex/react"
import { Loader } from "@/components/Loader";
import { api } from "@/convex/_generated/api";











export default function Index() {
const {signOut} = useAuth ();
const router = useRouter();

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
<TouchableOpacity onPress={() => signOut}>
<Ionicons name="log-out-outline" size={24} color={COLORS.white} />
</TouchableOpacity>
</View>
<ScrollView showsVerticalScrollIndicator={false}>

<ScrollView 
horizontal
showsHorizontalScrollIndicator= {false}
style={styles.stroiesContainer}
> 


{STORIES.map ((story) => ( 
  <Story key={story.id} story={story}/>
))}
</ScrollView> 

console.log(post)
</ScrollView> 
</View>
   
    
  );
}


const NoPostsFound = () => ( 
  <View style={{flex:1,
     backgroundColor:COLORS.background,
      justifyContent:"center", 
    alignItems:"center",}}
    >
<Text style={{fontSize:20,
   color: COLORS.primary}}
   >
    No post yet</Text>
    </View>
)
