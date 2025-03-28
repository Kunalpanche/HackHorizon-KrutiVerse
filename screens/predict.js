"use client"

import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"

// Function to format markdown text for React Native display
const formatMarkdownText = (text) => {
  if (!text) return ""

  // Replace markdown bold/headers with styled text
  const formattedText = text
    // Replace **text** with plain text (we'll style it separately)
    .replace(/\*\*(.*?)\*\*/g, "$1")
    // Replace markdown headers (# Header) with plain text
    .replace(/^#+ (.*?)$/gm, "$1")
    // Replace markdown lists
    .replace(/^\s*[-*] /gm, "• ")
    // Replace double newlines with single newlines to reduce spacing
    .replace(/\n\s*\n/g, "\n\n")

  return formattedText
}

const ExploreScreen = () => {
  // Form state
  const [formData, setFormData] = useState({
    location: "",
    carpet_area: "",
    bhk: "2BHK", // Default value
    property_age: "",
    infrastructure_proximity: "",
    parking_amenities: "",
    rental_yield: "",
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)

  // Handle input changes
  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Validate form inputs
  const validateForm = () => {
    const requiredFields = [
      "location",
      "carpet_area",
      "bhk",
      "property_age",
      "infrastructure_proximity",
      "parking_amenities",
      "rental_yield",
    ]

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        Alert.alert("Missing Information", `Please provide ${field.replace("_", " ")}`)
        return false
      }
    }

    // Validate numeric fields
    if (isNaN(Number(formData.carpet_area)) || Number(formData.carpet_area) <= 0) {
      Alert.alert("Invalid Input", "Carpet area must be a positive number")
      return false
    }

    if (isNaN(Number(formData.property_age)) || Number(formData.property_age) < 0) {
      Alert.alert("Invalid Input", "Property age must be a non-negative number")
      return false
    }

    if (
      isNaN(Number(formData.rental_yield)) ||
      Number(formData.rental_yield) < 0 ||
      Number(formData.rental_yield) > 100
    ) {
      Alert.alert("Invalid Input", "Rental yield must be between 0 and 100")
      return false
    }

    return true
  }

  // Submit form to Gemini API
  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setPrediction(null)

    try {
      // Replace with your actual API key
      const apiKey = "AIzaSyBFNfXt0VV1QFSRgeenmawMwZknnP72z7E" // In production, use environment variables

      // Create prompt for Gemini
      const prompt = `
You are an advanced real estate price prediction model trained on India-specific real estate market data. Your task is to predict the approximate price of a residential property based on the given parameters.

Consider factors like locality trends, infrastructure development, real estate demand, and market fluctuations while making predictions. Provide a reasonable price estimate based on historical trends, similar property comparisons, and demand-supply patterns.

### Input Parameters:
- Property Location: ${formData.location} (City, Locality, or Pincode)
- Usable Area (sq. ft.): ${formData.carpet_area}
- BHK Type (Bedrooms, Hall, Kitchen): ${formData.bhk}
- Property Age (Years Since Construction): ${formData.property_age}
- Nearby Transport & Key Facilities: ${formData.infrastructure_proximity}
- Parking & Society Amenities: ${formData.parking_amenities}
- Market Demand & Rental Yield (%): ${formData.rental_yield}

### Instructions for Response:
1. Predict the estimated property price in INR.
2. Provide a brief explanation of how factors like location, market trends, and property attributes influenced the price.
3. If possible, include a price range instead of a single fixed value to reflect market variations.
`

      // Call Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + apiKey,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // Extract the prediction text from the response
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        const rawText = data.candidates[0].content.parts[0].text
        setPrediction(formatMarkdownText(rawText))
      } else {
        throw new Error("Unexpected API response format")
      }
    } catch (error) {
      console.error("Error predicting home price:", error)
      Alert.alert("Prediction Error", "Failed to get prediction. Please check your inputs and try again.")
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const handleReset = () => {
    setFormData({
      location: "",
      carpet_area: "",
      bhk: "2BHK",
      property_age: "",
      infrastructure_proximity: "",
      parking_amenities: "",
      rental_yield: "",
    })
    setPrediction(null)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>India Real Estate Price Predictor</Text>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Location</Text>
              <TextInput
                style={styles.input}
                placeholder="City, Locality, or Pincode"
                value={formData.location}
                onChangeText={(text) => handleChange("location", text)}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usable Area (sq. ft.)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1000"
                value={formData.carpet_area}
                onChangeText={(text) => handleChange("carpet_area", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BHK Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.bhk}
                  onValueChange={(value) => handleChange("bhk", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="1 BHK" value="1BHK" />
                  <Picker.Item label="2 BHK" value="2BHK" />
                  <Picker.Item label="3 BHK" value="3BHK" />
                  <Picker.Item label="4 BHK" value="4BHK" />
                  <Picker.Item label="5 BHK" value="5BHK" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Age (Years)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 5"
                value={formData.property_age}
                onChangeText={(text) => handleChange("property_age", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nearby Transport & Key Facilities</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., 1.5km to Metro, 3km to Business Hub"
                value={formData.infrastructure_proximity}
                onChangeText={(text) => handleChange("infrastructure_proximity", text)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Parking & Society Amenities</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g., Covered Parking, Gated Society, Swimming Pool"
                value={formData.parking_amenities}
                onChangeText={(text) => handleChange("parking_amenities", text)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Market Demand & Rental Yield (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 4.2"
                value={formData.rental_yield}
                onChangeText={(text) => handleChange("rental_yield", text)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? "Predicting..." : "Get Price Prediction"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset} disabled={loading}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={styles.loadingText}>Analyzing property data...</Text>
            </View>
          )}

          {/* Prediction Results */}
          {prediction && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Prediction Result</Text>
              <View style={styles.resultSection}>
                {prediction.split("\n\n").map((paragraph, index) => {
                  // Check if this paragraph looks like a header/title
                  const isTitle =
                    paragraph.length < 50 &&
                    (paragraph.includes("Estimated Price") ||
                      paragraph.includes("Price Range") ||
                      paragraph.includes("Reasoning") ||
                      paragraph.includes("Analysis"))

                  return (
                    <View key={index} style={index > 0 ? { marginTop: 12 } : {}}>
                      <Text style={isTitle ? styles.resultSectionTitle : styles.resultSectionContent}>{paragraph}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#111827",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
    flex: 3,
    marginRight: 8,
  },
  resetButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    flex: 1,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButtonText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4B5563",
  },
  resultContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#111827",
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
  resultSection: {
    marginBottom: 12,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#111827",
  },
  resultSectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
  },
})

export default ExploreScreen

