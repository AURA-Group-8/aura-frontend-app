import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BusinessInsightsModal({ visible, onClose, data }) {
  const defaultInsights = [
    {
      id: 1,
      tag: 'DICA',
      title: 'Aumente seu faturamento',
      description: 'Clientes que fazem Design com Henna costumam voltar a cada 15 dias. Tente oferecer um pacote mensal!',
      icon: 'trending-up-outline',
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

            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={30} color="#5c0f25" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {insights.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon || 'bulb-outline'} size={20} color="#5c0f25" />
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.tagPill}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.75,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#5c0f25',
    marginLeft: 10, 
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#FFFBF2', 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1E3D9'
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
    paddingTop: 4
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1E3D9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardContent: {
    flex: 1,
  },
  tagPill: {
    backgroundColor: '#5c0f25',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3d2b2b',
    marginBottom: 4
  },
  cardDesc: {
    fontSize: 14,
    color: '#6b5b5b',
    lineHeight: 20
  }
});