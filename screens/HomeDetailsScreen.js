"use client"

import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { Feather } from "@expo/vector-icons"
import * as Speech from "expo-speech"
import { getPlantInformation } from "../utils/geminiApi"
import ChatModal from "../components/ChatModal"
import ModelViewerModal from "../components/ModelViewerModal"
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons"

export default function PlantDetailsScreen({ route }) {
  const { plant } = route.params
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const [enhancedDescription, setEnhancedDescription] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [error, setError] = useState(null)
  const [showModelViewer, setShowModelViewer] = useState(false)
  const [modelLoadError, setModelLoadError] = useState(false)

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "mr", name: "मराठी" },
  ]

  const modelUrls = [
    {
      name: "Gorakhmundi",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/gorakhmundi.glb",
    },
    {
      name: "Turmeric",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/turmeric.glb",
    },
    {
      name: "Ginger",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/ginger.glb",
    },
    {
      name: "Mandrake",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/mandrake.glb",
    },
    {
      name: "Kalmegh",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/kalmegh.glb",
    },
    {
      name: "Kalmegh",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/kalmegh.glb",
    },
    {
      name: "Aloe Vera",
      url: "https://cdn.jsdelivr.net/gh/Kunalpanche/3dmodels@main/aelovera.glb",
    },
  ]

  useEffect(() => {
    fetchEnhancedDescription()
  }, [selectedLanguage])

  const fetchEnhancedDescription = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await getPlantInformation(plant.name, selectedLanguage)

      if (response.success && response.data) {
        setEnhancedDescription(response.data)
      } else {
        setError("Failed to fetch plant information")
        setEnhancedDescription(plant.description)
      }
    } catch (error) {
      console.error("Error fetching plant information:", error)
      setError("An error occurred while fetching plant information")
      setEnhancedDescription(plant.description)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSpeech = async () => {
    if (isSpeaking) {
      Speech.stop()
      setIsSpeaking(false)
    } else {
      setIsSpeaking(true)
      try {
        await Speech.speak(enhancedDescription || plant.description, {
          language: selectedLanguage,
          onDone: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        })
      } catch (error) {
        console.error("Speech error:", error)
        setIsSpeaking(false)
      }
    }
  }

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  )

  const formatDescription = (text) => {
    if (!text) return []

    // First, try to parse structured data with ** markers
    if (text.includes("**")) {
      const sections = text.split("**").filter(Boolean)
      const formattedSections = []

      for (let i = 0; i < sections.length; i += 2) {
        if (sections[i] && sections[i + 1]) {
          const title = sections[i].replace(/[\d.\s]/g, "").trim()
          const content = sections[i + 1].trim()

          // Add spaces between words if they're missing
          const formattedContent = content
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([a-zA-Z])(\d)/g, "$1 $2")
            .replace(/(\d)([a-zA-Z])/g, "$1 $2")

          formattedSections.push({ title, content: formattedContent })
        }
      }

      return formattedSections
    }
    // If no ** markers, try to identify sections by numbers or headings
    else {
      // Try to split by common section patterns like "1. Description:" or numbered lists
      const sectionRegex = /(\d+\.\s*[A-Z][a-zA-Z\s]+:)/g
      let sections = []

      if (sectionRegex.test(text)) {
        sections = text.split(sectionRegex).filter(Boolean)
        const formattedSections = []

        for (let i = 0; i < sections.length; i += 2) {
          if (sections[i] && sections[i + 1]) {
            const title = sections[i].trim()

            // Format the content by adding spaces between words
            let content = sections[i + 1].trim()
            content = content
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .replace(/([a-zA-Z])(\d)/g, "$1 $2")
              .replace(/(\d)([a-zA-Z])/g, "$1 $2")

            formattedSections.push({ title, content })
          }
        }

        return formattedSections
      }

      // If no sections found, try to format the entire text
      const formattedText = text
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([a-zA-Z])(\d)/g, "$1 $2")
        .replace(/(\d)([a-zA-Z])/g, "$1 $2")

      // Try to extract a title from the beginning
      const titleMatch = formattedText.match(/^(.*?)(?=\s[A-Z])/)
      const title = titleMatch ? titleMatch[0].trim() : "Description"
      const content = titleMatch ? formattedText.substring(titleMatch[0].length).trim() : formattedText

      return [{ title, content }]
    }
  }

  const getModelUrl = () => {
    const model = modelUrls.find((m) => m.name.toLowerCase() === plant.name.toLowerCase())
    return model ? model.url : null
  }

  const handleModelViewerOpen = () => {
    setModelLoadError(false)
    setShowModelViewer(true)
  }

  const handleModelLoadError = () => {
    setModelLoadError(true)
    setShowModelViewer(false)
  }

  const renderDescription = () => {
    const formattedSections = formatDescription(enhancedDescription)

    if (formattedSections.length === 0 && enhancedDescription) {
      // If no sections were parsed but we have text, format the entire text
      const formattedText = enhancedDescription
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([a-zA-Z])(\d)/g, "$1 $2")
        .replace(/(\d)([a-zA-Z])/g, "$1 $2")

      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {plant.name}</Text>
          <Text style={styles.sectionContent}>{formattedText}</Text>
        </View>
      )
    }

    return formattedSections.map((section, index) => (
      <View key={index} style={styles.section}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Text style={styles.sectionContent}>{section.content}</Text>
      </View>
    ))
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: plant.image }} style={styles.image} />

      <View style={styles.languageContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[styles.languageButton, selectedLanguage === lang.code && styles.selectedLanguage]}
            onPress={() => setSelectedLanguage(lang.code)}
          >
            <Text style={[styles.languageText, selectedLanguage === lang.code && styles.selectedLanguageText]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.category}>{plant.category}</Text>
          <Text style={styles.name}>{plant.name}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={toggleSpeech} style={styles.controlButton}>
            <Feather name={isSpeaking ? "pause-circle" : "play-circle"} size={24} color="#4CAF50" />
            <Text style={styles.controlText}>{isSpeaking ? "Stop" : "Play"}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowChat(true)} style={styles.controlButton}>
            <Feather name="message-circle" size={24} color="#4CAF50" />
            <Text style={styles.controlText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleModelViewerOpen} style={styles.controlButton} disabled={!getModelUrl()}>
            <MaterialCommunityIcons name="video-3d" size={28} color="#4CAF50" />
            <Text style={[styles.controlText, !getModelUrl() && styles.disabledText]}>View 3D</Text>
          </TouchableOpacity>
        </View>
        {modelLoadError && <Text style={styles.errorText}>Failed to load 3D model. Please try again later.</Text>}
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.descriptionContainer}>{renderDescription()}</View>
        )}
      </View>

      <ChatModal
        visible={showChat}
        onClose={() => setShowChat(false)}
        plantName={plant.name}
        language={selectedLanguage}
      />
      <ModelViewerModal
        visible={showModelViewer}
        onClose={() => setShowModelViewer(false)}
        modelUrl={getModelUrl()}
        onError={handleModelLoadError}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedLanguage: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  languageText: {
    color: "#666",
  },
  selectedLanguageText: {
    color: "#fff",
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  category: {
    fontSize: 16,
    color: "#4CAF50",
    marginBottom: 8,
    fontWeight: "500",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },
  controlButton: {
    alignItems: "center",
    padding: 10,
  },
  controlText: {
    marginTop: 5,
    color: "#666",
    fontSize: 14,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#4CAF50",
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    textAlign: "justify",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
    textAlign: "center",
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
  disabledText: {
    color: "#ccc",
  },
})

