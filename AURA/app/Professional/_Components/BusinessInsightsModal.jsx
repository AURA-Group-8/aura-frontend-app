import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function BusinessInsightsModal({ visible, onClose, data }) {
  // Mock de dados caso não venha nada da IA ainda
  const defaultInsights = [
    {
      id: 1,
      tag: 'SERVIÇO DESTAQUE',
      title: 'Invista em "Design de Sobrancelhas"',
      description: 'Com 12 atendimentos, é seu serviço mais popular. Considere criar pacotes promocionais para aumentar o ticket médio.',
      icon: 'star-outline',
      color: '#E67E22'
    },
    {
      id: 2,
      tag: 'AGENDA',
      title: 'Potencialize Sex e melhore Seg',
      description: 'Sex é seu melhor dia (R$ 1200). Ofereça promoções em Seg (R$ 450) para equilibrar a agenda.',
      icon: 'calendar-outline',
      color: '#9B59B6'
    },
    {
      id: 3,
      tag: 'FIDELIZAÇÃO',
      title: 'Programa de fidelidade',
      description: 'Maria Silva já tem 8 visitas. Crie um programa de fidelidade para recompensar clientes regulares.',
      icon: 'people-outline',
      color: '#3498DB'
    }
  ];

  const insights = data || defaultInsights;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <View style={styles.header}>
            <View style={styles.titleRow}>
               <Ionicons name="bulb" size={24} color="#FFC107" />
               <Text style={styles.headerTitle}>Sugestões de Negócio</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close-circle-outline" size={32} color="#8B4555" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#F7F0E9', // Tom bege do seu print
    borderRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5c0f25',
  },
  scrollContent: {
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#FFF9F2',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8D6C8',
  },
  leftPill: {
    width: 40,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#E8D6C8',
  },
  cardContent: {
    flex: 1,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D4A373',
    backgroundColor: '#FEF3E2',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5c0f25',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: '#8B4555',
    lineHeight: 18,
  }
});