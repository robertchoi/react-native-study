import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import {useQuery}from "react-query";
import {getCoins}from "../fetchers";
import { View, Text, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';

export default function Coins() {
  const navigation = useNavigation();
  const { data, refetch, isLoading } = useQuery("coins", getCoins);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // Use this variable to access the data
  const cleanedCoins = data
    ?.filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1e272e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        backgroundColor: "#1e272e",
        paddingHorizontal: 10,
      }}
      data={cleanedCoins}
      ItemSeparatorComponent={() => <View style={{ height: 10, width: 10 }} />}
      columnWrapperStyle={{
        justifyContent: "space-between",
      }}
      numColumns={3}
      keyExtractor={(coin) => coin.symbol}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Detail", {
              id: item.id,
              name: item.name,
              symbol: item.symbol,
            })
          }
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: 20,
            borderRadius: 5,
            alignItems: "center",
            flex: 0.31,
          }}
        >
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginBottom: 10,
            }}
            source={{
              uri: `https://coinicons-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
            }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}
