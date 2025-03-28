"use client"

import { useState, useRef, useEffect } from "react"
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Animated } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const ITEM_WIDTH = width - 40
const ITEM_HEIGHT = 220

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const flatListRef = useRef(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const navigation = useNavigation()

  const carouselData = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop",
      title: "Luxury Villas",
      subtitle: "Exclusive properties with premium amenities",
      type: "Villa",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
      title: "Modern Apartments",
      subtitle: "Contemporary living spaces in prime locations",
      type: "Apartment",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
      title: "Beachfront Properties",
      subtitle: "Wake up to stunning ocean views",
      type: "House",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        })
      } else {
        flatListRef.current?.scrollToIndex({
          index: activeIndex + 1,
          animated: true,
        })
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [activeIndex])

  const handleExplore = (type) => {
    navigation.navigate("PropertiesScreen", {
      filter: type,
      searchQuery: "",
      filters: {},
    })
  }

  const renderItem = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    })

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    })

    return (
      <Animated.View style={[styles.itemContainer, { transform: [{ scale }], opacity }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.gradient} />
        <View style={styles.overlay}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleExplore(item.type)}>
            <Text style={styles.buttonText}>Explore</Text>
            <Feather name="arrow-right" size={14} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const handleScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset
    const viewSize = e.nativeEvent.layoutMeasurement
    const pageNum = Math.floor(contentOffset.x / viewSize.width)
    setActiveIndex(pageNum)
  }

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        decelerationRate="fast"
        snapToInterval={width}
      />
      <View style={styles.pagination}>
        {carouselData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const scaleX = scrollX.interpolate({
            inputRange,
            outputRange: [1, 2, 1],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          })

          return <Animated.View key={index} style={[styles.paginationDot, { transform: [{ scaleX }], opacity }]} />
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  itemContainer: {
    width: width,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 20,
  },
  gradient: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 0,
    height: ITEM_HEIGHT,
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: "#0066CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonIcon: {
    marginLeft: 5,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#0066CC",
    marginHorizontal: 4,
  },
})

