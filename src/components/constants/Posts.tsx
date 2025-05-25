import { COLORS } from "./theme";
import { styles } from "../../utils/styles/feed.style";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@../../convex/_generated/api";
import CommentsModal from "../CommentsModal";
import {  formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";


type PostProps = {
  post: {
    _id: Id<"posts">;
    imageUrl: string;
    caption?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      image: string;
    };
  };
};

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);

  const {user} = useUser();

  const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user?.id } : "skip");


  const toggleLike = useMutation(api.post.toggleLike);
const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
const deletPost = useMutation(api.post.deletePost);

  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newIsLiked);
      setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    } catch (error) {
      // Optionally handle error
    }
  };


const handleBookmark = async () => {
  const newIsBookmarked = await toggleBookmark({ postId: post._id });
  setIsBookmarked(newIsBookmarked);
}

const handleDelete = async () => {
  try {
    await deletPost({ postId: post._id });
    // Optionally handle success (e.g., show a message or navigate away)
  } catch (error) {
    console.error("Error deleting post:", error);  
    // Optionally handle error
  }
}

  return (
    <View style={styles.post}>
      {/* POST HEADER */}
      <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
          <TouchableOpacity style={styles.postHeader}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

{/* if i'm the owner of the post show the delete button */}

{post.author._id === currentUser?._id ? (
<TouchableOpacity onPress={handleDelete} style={{ marginLeft: "auto" }}>
  <Ionicons name="ellipsis-horizontal-outline" size={20} color={COLORS.white} />
</TouchableOpacity>


      
) : (

         <TouchableOpacity style={{ marginLeft: "auto" }}>
          <Ionicons name="trash-outline" size={20} color={COLORS.grey} />
        </TouchableOpacity>  
)}

      </View>

      {/* IMAGE */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* POST ACTIONS */}
      <View style={styles.postAction}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24} 
              color={isLiked ? COLORS. grey : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ marginLeft: "auto"  }} onPress={handleBookmark}>
          <Ionicons name={ isBookmarked ? "bookmark" : "bookmark-outline"} size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCount > 0 ? `${likesCount} likes` : "Be the first to like this post"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        <View>
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.commentsText}>View all {post.comments} comment{post.comments !== 1 ? "s" : ""}</Text>
          </TouchableOpacity>
          <Text style={styles.timeAgo}>{ formatDistanceToNow(post._creationTime, {addSuffix:true})}</Text>
        </View>
      </View>


<CommentsModal
  postId={post._id}
  visible={showComments}
  onClose={() => setShowComments(false)}
  onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
/>

    </View>
  );
}