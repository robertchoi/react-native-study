import * as React from 'react';
import { Animated, TouchableOpacity, Dimensions } from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BOTTOM = SCREEN_HEIGHT / 2 - 100;
const TOP = -SCREEN_HEIGHT / 2 + 100;
const LEFT = -SCREEN_WIDTH / 2 + 100;
const RIGHT = SCREEN_WIDTH / 2 - 100;

export default function App() {
  const yPosition = React.useRef(new Animated.Value(BOTTOM)).current;
  const xPosition = React.useRef(new Animated.Value(RIGHT)).current;
  const goTop = Animated.timing(yPosition, {
    toValue: TOP,
    useNativeDriver: true,
    duration: 5000,
  });
  const goBottom = Animated.timing(yPosition, {
    toValue: BOTTOM,
    useNativeDriver: true,
    duration: 5000,
  });
  const goLeft = Animated.timing(xPosition, {
    toValue: LEFT,
    useNativeDriver: true,
    duration: 1500,
  });
  const goRight = Animated.timing(xPosition, {
    toValue: RIGHT,
    useNativeDriver: true,
    duration: 1500,
  });
  const onClick = () => {
    Animated.loop(Animated.sequence([goTop, goBottom])).start();
    Animated.loop(
      Animated.sequence([goLeft, goRight, goLeft, goRight])
    ).start();
  };
  const borderRadius = xPosition.interpolate({
    inputRange: [LEFT, RIGHT],
    outputRange: [100, 10],
  });
  return (
    <Container>
      <TouchableOpacity onPress={onClick}>
        <Animated.View
          style={{
            width: 200,
            height: 200,
            transform: [{ translateY: yPosition }, { translateX: xPosition }],
            borderRadius,
            backgroundColor: "tomato",
          }}
        />
      </TouchableOpacity>
    </Container>
  );
}
