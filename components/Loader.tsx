import {COLORS} from "@/constants/theme"
import {ActivityIndicator, View} from "react-native"

export function Loader () {
return (
    <View
     style={{flex:1,
        backgroundColor:COLORS.background,
         justifyContent:"center", 
       alignItems:"center",}}
       >
       <ActivityIndicator size="large" color={COLORS.primary}/>
       </View>
    
)
}