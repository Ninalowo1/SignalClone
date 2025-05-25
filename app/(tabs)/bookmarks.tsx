import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import React from 'react';
import { api } from "../../convex/_generated/api";
import { useQuery } from 'convex/react';
import { Loader } from '@/components/constants/Loader';
import { COLORS } from '@/components/constants/theme';
import { styles } from '@/utils/styles/feed.style';

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (bookmarkedPosts === undefined) return <Loader />;
  if (bookmarkedPosts.length === 0) return <NoBookmarksFound />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {/* POST GRID */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <View key={post._id} style={{ width: '33.33%', padding: 1 }}>
              <Image
                source={{ uri: post.imageUrl }} // ✅ Wrap imageUrl in { uri: ... }
                style={{ width: '100%', aspectRatio: 1 }} // ✅ Use aspectRatio to maintain square
                resizeMode="cover"
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
      }}
    >
      <Text style={{ color: COLORS.primary, fontSize: 22 }}>
        No bookmarked posts
      </Text>
    </View>
  );
}
