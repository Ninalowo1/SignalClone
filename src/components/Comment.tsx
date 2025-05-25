import { View, Text, Image } from "react-native";
import { styles } from '../utils/styles/feed.style';
import { formatDistanceToNow } from "date-fns";

interface Comment {
  content: string;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
  };
}

export default function Comment({ comment }: { comment: Comment }) {
  return (
    <View style={styles.commentContainer}>
      <Image source={{ uri: comment.user.image }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsermane}>{comment.user.fullname}</Text>
        <Text style={styles.commentContent}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(new Date(comment._creationTime))} ago
        </Text>
      </View>
    </View>
  );
}
