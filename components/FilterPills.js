import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"

export default function FilterPills({ filters, selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {filters?.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.pill, selected === filter && styles.selectedPill]}
          onPress={() => onSelect(filter)}
        >
          <Text style={[styles.pillText, selected === filter && styles.selectedPillText]}>{filter}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  selectedPill: {
    backgroundColor: "#0066CC",
  },
  pillText: {
    fontSize: 14,
    color: "#666",
  },
  selectedPillText: {
    color: "#fff",
  },
})

