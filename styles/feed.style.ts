import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";


const { width } = Dimensions.get ("window");


export const styles = StyleSheet.create ({
container: {
flex: 1, 
backgroundColor: COLORS. background,
}, 

header: {
    flexDirection: "row",

  alignItems: "center" ,
  paddingHorizontal: 16,
   paddingVertical: 12,
   
    borderBottomColor: COLORS.grey,

}, 
headerTitle: {
fontSize: 24,
 fontFamily: "JetBrainsMono-Medium",
 color: COLORS.primary,
 marginRight:200,
 
},

stroiesContainer:{
    paddingVertical:12,
    borderBottomWidth:0,
    borderBottomColor:COLORS.grey,
},
storyWrapper:{
    alignItems:'center',
    marginHorizontal:8,
    width:72,
},
storyRing:{
    width:68,
    height:68,
    borderRadius:34,
    padding:2,
    backgroundColor: COLORS.background,
    borderWidth:2, 
    marginBottom:4,
},
noStory:{
borderColor: COLORS.grey
},
storyAvatar:{
    width:60,
    height:60,
    borderRadius:30,
    borderWidth:2,
    borderColor: COLORS.background,
},
storyUsername:{
    fontSize:11,
    color: COLORS.white,
    textAlign:"center"
},
post:{
    marginBottom:16,
},
postHeader:{
    flexDirection:"row",
    alignItems:"center",
},
postHeaderLeft:{
flexDirection:"row",
alignItems:"center",
},
postAvatar:{
    width:32,
    height:32,
    borderRadius:16,
    marginRight:8,
},
postUsername:{
    fontSize:14,
    fontWeight:"600",
    color: COLORS.white,
},
postImage:{
width: width,
height: width,
},
postAction:{
flexDirection:"row",
alignItems:"center",
gap:16,

},
postInfo:{
    paddingHorizontal:12,
},
likesText:{
fontSize:14,
fontWeight:"600",
color: COLORS.white,
marginBottom:6,
},
captionUsername:{
    fontSize:14,
    fontWeight:"600",
    color: COLORS.white,
    marginRight:6,
},
captionText: {
    fontSize:14,
    color: COLORS.white,
    flex:1,
},
commentsText:{
fontSize:1,
color: COLORS.grey,
marginBottom:8,
},
timeAgo:{
    fontSize:12,
    color: COLORS.grey,
    marginBottom:8,
},
modalContainer:{
    backgroundColor: COLORS.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex:1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
},

modalHeader:{
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    paddingHorizontal:16,
    height:56,
    borderBottomWidth:0.5,
    borderBottomColor: COLORS.grey,

},
modalTitle:{
    color: COLORS.white,
    fontSize:16,
    fontWeight:"600"
},
commentsList:{
    flexDirection:"row",
    paddingHorizontal:16,
    paddingVertical:12,
    borderBottomColor: COLORS.grey,
},
commentAvatar:{
    width: 32,
    height: 32,
    borderRadius:16,
    marginRight:12,
},
commentContent:{
    flex:1,
},
commentUsermane:{
    color: COLORS.white,
    fontWeight:"500",
    marginBottom:4,
},
commentText:{
color: COLORS.white,
fontSize:14,
lineHeight:20,


},
commentTime:{
    color:COLORS.grey,
    fontSize:12,
    marginTop:4,
},
commentInput:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:16,
paddingVertical:21,
borderTopWidth:0.5,
borderTopColor: COLORS.grey,
backgroundColor: COLORS.background,

},
input:{
    flex:1,
    color: COLORS.white,
    paddingVertical:8,
    paddingHorizontal:16,
    marginRight:12,
    backgroundColor: COLORS.grey,
    borderRadius:20,
    fontSize:14,
},
posyButton:{
    color: COLORS.primary,
    fontWeight:"600",
    fontSize:14,
},
postButtonDisabbled:{
    opacity:0.5,
},
centered:{
    justifyContent:"center",
    alignItems:"center",
}
})