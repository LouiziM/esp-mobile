import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

const lightColors = {
  red: "red",
  yellow: "yellow",
  green: "green",
};

const TrafficLight = () => {
  const [currentLight, setCurrentLight] = useState(null);
  const [redBackground, setRedBackground] = useState("transparent");
  const [yellowBackground, setYellowBackground] = useState("transparent");
  const [greenBackground, setGreenBackground] = useState("transparent");

  const setColorsBasedOnLight = useCallback((newCurrentLight) => {
    switch (newCurrentLight) {
      case "red":
        setRedBackground(lightColors.red);
        setYellowBackground("transparent");
        setGreenBackground("transparent");
        setCurrentLight("red");
        break;
      case "yellow":
        setYellowBackground(lightColors.yellow);
        setRedBackground("transparent");
        setGreenBackground("transparent");
        setCurrentLight("yellow");
        break;
      case "green":
        setGreenBackground(lightColors.green);
        setRedBackground("transparent");
        setYellowBackground("transparent");
        setCurrentLight("green");
        break;
      default:
        setRedBackground("transparent");
        setYellowBackground("transparent");
        setGreenBackground("transparent");
        setCurrentLight(null);
    }
  }, []);

  const changeSequence = async (lightColor) => {
    try {
      await axios.post(`http://192.168.43.134:5000/api/change-sequence-${lightColor.toLowerCase()}`);
    } catch (error) {
      console.error("Error changing sequence:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.43.134:5000/api/current-light");
      const newCurrentLight = response.data.currentLight;
      if (newCurrentLight !== undefined) {
        setColorsBasedOnLight(newCurrentLight);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching current light data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 500);

    return () => clearInterval(intervalId);
  }, [setColorsBasedOnLight]);

  const handlePress = async (lightColor) => {
    setColorsBasedOnLight(lightColor);
    await changeSequence(lightColor);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.square, { backgroundColor: redBackground }]} onPress={() => handlePress("red")}></TouchableOpacity>
      <TouchableOpacity style={[styles.square, { backgroundColor: yellowBackground }]} onPress={() => handlePress("yellow")}></TouchableOpacity>
      <TouchableOpacity style={[styles.square, { backgroundColor: greenBackground }]} onPress={() => handlePress("green")}></TouchableOpacity>
      {currentLight !== null ? (
        <Text style={styles.lightText}>Current Light: {currentLight}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 100,
    height: 100,
    borderWidth: 3,
    borderColor: "#555",
    borderRadius: 100,
    marginTop: 10,
  },
  lightText: {
    marginTop: 10,
  },
});

export default TrafficLight;
