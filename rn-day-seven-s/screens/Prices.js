import React, { useState } from 'react';
import { FlatList, Image, Text, View, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { getPrices } from '../fetchers';

export default function Prices() {
  const { data, refetch, isLoading } = useQuery('prices', getPrices);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const cleanedTickers = data?.filter(
    (ticker) => ticker.circulating_supply !== 0
  );
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
      onRefresh={onRefresh}
      refreshing={refreshing}
      style={{
        flex: 1,
        backgroundColor: '#1e272e',
        paddingHorizontal: 10,
      }}
      data={cleanedTickers}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: 15,
            borderBottomWidth: 0.5,
            borderBottomColor: 'rgba(255, 255, 255, 0.2)',
          }}
        />
      )}
      keyExtractor={(coin) => coin.symbol}
      renderItem={({ item }) => (
        <View
          style={{
            paddingTop: 15,
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                marginRight: 10,
              }}
              source={{
                uri: `https://coinicons-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontWeight: '600',
              }}>
              {item.name}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{
                color: 'white',
                marginBottom: 5,
                fontWeight: '600',
                fontSize: 14,
              }}>
              ${item.quotes.USD.price.toFixed(2)}
            </Text>
            <Text
              style={{
                color: item.quotes.USD.percent_change_24h > 0 ? 'green' : 'red',
              }}>
              {item.quotes.USD.percent_change_24h > 0 ? '▲' : '▼'}{' '}
              {item.quotes.USD.percent_change_24h}%
            </Text>
          </View>
        </View>
      )}
    />
  );
}
