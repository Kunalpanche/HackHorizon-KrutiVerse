import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"

export default function PropertyCard({ property, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: property.photo }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{property.name}</Text>
          <Text style={styles.price}>₹{property.price.toLocaleString()}</Text>
        </View>

        <Text style={styles.location}>
          <Feather name="map-pin" size={14} color="#666" /> {property.location}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Feather name="home" size={14} color="#0066CC" />
            <Text style={styles.detailText}>{property.type}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="layers" size={14} color="#0066CC" />
            <Text style={styles.detailText}>{property.bedrooms} beds</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="droplet" size={14} color="#0066CC" />
            <Text style={styles.detailText}>{property.bathrooms} baths</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="phone" size={18} color="#0066CC" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Feather name="message-circle" size={18} color="#0066CC" />
            <Text style={styles.actionText}>Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  details: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  detailText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: "#0066CC",
    fontSize: 14,
  },
})

