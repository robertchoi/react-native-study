import React, { useRef, useState } from "react";
import {
  View,
  Animated,
  PanResponder,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useAssets } from "expo-asset";
import { getCoins } from "../fetchers";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #1e272e;
`;

const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: #fd79a8;
  width: 300px;
  height: 400px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

export default function Discover() {
  const { data, refetch } = useQuery("coins", getCoins);
  const cleanedList = data
    ?.filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: "clamp",
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -250) {
          goLeft.start(onDismiss);
        } else if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    setIndex((prev) => prev + 1);
    position.setValue(0);
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };
  const [assets] = useAssets(
    cleanedList?.map(
      (item) =>
        `https://coinicons-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`
    )
  );
  if (!assets) {
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
    <Container>
      <CardContainer>
        <Card key={index + 1} style={{ transform: [{ scale: secondScale }] }}>
          <Image
            key={index + 1}
            prefetch
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              marginBottom: 10,
            }}
            source={{
              uri: assets[index + 1].localUri,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 28,
            }}
          >
            {cleanedList[index + 1].name}
          </Text>
        </Card>
        <Card
          key={index}
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Animated.Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
              marginBottom: 10,
            }}
            key={index}
            source={{
              uri: assets[index].localUri,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontWeight: "600",
              fontSize: 28,
            }}
          >
            {cleanedList[index].name}
          </Text>
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <FontAwesome5 name="heart-broken" color="white" size={44} />
        </Btn>
        <Btn onPress={checkPress}>
          <FontAwesome5 name="heart" color="white" size={44} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}
