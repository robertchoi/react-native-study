import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useQuery } from 'react-query';
import { getNews } from '../fetchers';

export default function News() {
  const { data, refetch, isLoading } = useQuery('news', getNews);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const onRead = async (url) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.log(e);
    }
  };
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#1e272e',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <FlatList
      data={data?.hits}
      onRefresh={onRefresh}
      keyExtractor={(hit) => hit.objectID}
      refreshing={refreshing}
      style={{
        flex: 1,
        backgroundColor: '#1e272e',
        paddingHorizontal: 10,
      }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 15,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}>
          <Text style={{ fontSize: 18, color: 'white', fontWeight: '600' }}>
            {item.title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 14,
                  color: 'white',
                  marginRight: 10,
                }}>
                👍🏻 {item.points}
              </Text>
              <Text style={{ fontWeight: '500', fontSize: 14, color: 'white' }}>
                💬 {item.num_comments}
              </Text>
            </View>
            {item.url ? (
              <TouchableOpacity
                onPress={() => (item.url ? onRead(item.url) : null)}>
                <Text style={{ color: '#fd79a8', fontWeight: '600' }}>
                  Read 👉🏻
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    />
  );
}
