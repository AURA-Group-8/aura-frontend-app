import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert
} from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ETL_URL = process.env.EXPO_PUBLIC_API_ETL_URL || 'http://localhost:8000';

export default function BusinessInsightsModal({
  visible,
  onClose
}) {

  const [insights, setInsights] = useState([]);
  const [focus, setFocus] = useState('');
  const [observations, setObservations] = useState('');
  const [alwaysGenerate, setAlwaysGenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultInsights = [
    {
      id: 1,
      tag: 'DICA',
      title: 'Aumente seu faturamento',
      description:
        'Clientes que fazem Design com Henna costumam voltar a cada 15 dias. Tente oferecer um pacote mensal!',
      icon: 'trending-up-outline'
    }
  ];

  async function getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  function getCategoryTag(category) {
    switch (category) {
      case 'finance': return 'FINANÇAS';
      case 'clients': return 'CLIENTES';
      case 'marketing': return 'MARKETING';
      case 'retention': return 'RETENÇÃO';
      case 'operations': return 'OPERAÇÕES';
      default: return 'GERAL';
    }
  }

  function getIcon(category) {
    switch (category) {
      case 'finance': return 'cash-outline';
      case 'clients': return 'people-outline';
      case 'marketing': return 'megaphone-outline';
      case 'retention': return 'repeat-outline';
      case 'operations': return 'settings-outline';
      default: return 'bulb-outline';
    }
  }

  async function generateInsights() {
    try {
      setLoading(true);

      const authHeaders = await getAuthHeaders();

      console.log('ETL_URL:', ETL_URL);
      console.log('authHeaders:', authHeaders);

      if (alwaysGenerate) {
        await axios.delete(`${ETL_URL}/api/v1/cache`, {
          headers: authHeaders,
          timeout: 30000
        });
      }

      console.log('Fazendo GET...');
      await axios.get(`${ETL_URL}/api/v1/insights`, {
        headers: authHeaders,
        timeout: 120000
      });

      console.log('Fazendo POST...');
      const response = await axios.post(
        `${ETL_URL}/api/v1/insights`,
        {
          focus: focus.trim(),
          observations: observations.trim()
        },
        {
          headers: authHeaders,
          timeout: 120000
        }
      );

      console.log('Resposta POST:', response.data);

      const rawInsights =
        Array.isArray(response.data)
          ? response.data
          : response.data?.items || [];

      const mapped = rawInsights.map((item, index) => ({
        id: index + 1,
        tag: getCategoryTag(item.category),
        title: item.title,
        description: item.text,
        icon: getIcon(item.category)
      }));

      setInsights(mapped.length > 0 ? mapped : defaultInsights);

    } catch (err) {
      console.log('ERRO INSIGHTS:', err.response?.data || err.message || err);
      Alert.alert('Erro', 'Não foi possível gerar os insights.');
    } finally {
      setLoading(false);
    }
  }

  const finalInsights = insights.length > 0 ? insights : defaultInsights;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="bulb" size={24} color="#FFC107" />
              <Text style={styles.headerTitle}>Sugestões de Negócio</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color="#5c0f25" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Foco da IA</Text>
          <TextInput
            placeholder="Ex: retenção de clientes"
            value={focus}
            onChangeText={setFocus}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Observações</Text>
          <TextInput
            placeholder="Ex: clientes elogiam o serviço mas não retornam..."
            value={observations}
            onChangeText={setObservations}
            style={[styles.input, styles.textArea]}
            multiline
            textAlignVertical="top"
            placeholderTextColor="#999"
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Sempre gerar novos insights</Text>
            <Switch
              value={alwaysGenerate}
              onValueChange={setAlwaysGenerate}
              trackColor={{ false: '#CCC', true: '#5c0f25' }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateInsights}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="sparkles-outline" size={18} color="#FFF" />
                <Text style={styles.generateButtonText}>Gerar Insights</Text>
              </>
            )}
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {finalInsights.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon} size={20} color="#5c0f25" />
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
    width: '92%',
    borderRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20
      },
      android: {
        elevation: 10
      }
    })
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
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#5c0f25',
    marginLeft: 10
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5c0f25',
    marginBottom: 8,
    marginTop: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5D6D6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FFF'
  },
  textArea: {
    height: 90,
    marginBottom: 10
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: '#3d2b2b',
    marginRight: 10
  },
  generateButton: {
    backgroundColor: '#5c0f25',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20
  },
  generateButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8
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
    flex: 1
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
