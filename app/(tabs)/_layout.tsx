import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../src/components/constants/theme';


export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.grey,
                tabBarStyle: {
                    position: 'absolute',
                    elevation: 0,
                    backgroundColor: "black",
                    borderTopWidth: 0,
                    height: 40,
                    paddingBottom: 8,
                    flex:1
                },
            }}
        >
            <Tabs.Screen name='index'
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name='home' size={24} color={color} />,

                }}
            />

            <Tabs.Screen name='bookmarks'

                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name='bookmarks' size={size} color={color} />,
                }}
            />

            <Tabs.Screen name='create'
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name='add-circle' size={size} color={color} />,
                }}
            />

            <Tabs.Screen name='profile'
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="person-circle-outline" size={size} color={color} />,

                }}
            />

            <Tabs.Screen name='notifications'
                options={{
                    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name="notifications-outline" size={size} color={color} />,

                }}
            />
        </Tabs>
    );
}