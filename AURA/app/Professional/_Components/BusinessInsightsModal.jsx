import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BusinessInsightsModal({ visible, onClose, data }) {
  const defaultInsights = [
    {
      id: 1,
      tag: 'EXEMPLO',
      title: 'Insight padrão',
      description: 'Sem dados da API ainda',
      icon: 'bulb-outline',
      color: '#E67E22'
    }
  ];

  const insights = data?.length ? data : defaultInsights;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="bulb" size={24} color="#FFC107" />
              <Text style={styles.headerTitle}>Sugestões de Negócio</Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle-outline" size={32} color="#8B4555" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {insights.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.leftPill}>
                  <Ionicons name={item.icon} size={20} color="#8B4555" />
                </View>

                <View style={styles.cardContent}>
                  <Text style={styles.tagText}>{item.tag}</Text>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    maxHeight: SCREEN_HEIGHT * 0.8,
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  card: {
    flexDirection: 'row',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12
  },
  leftPill: {
    marginRight: 10,
    justifyContent: 'center'
  },
  cardContent: {
    flex: 1
  },
  tagText: {
    fontSize: 12,
    color: '#999'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  cardDesc: {
    fontSize: 14,
    color: '#555'
  }
});