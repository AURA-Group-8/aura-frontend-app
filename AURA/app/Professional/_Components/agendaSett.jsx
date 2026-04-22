import React, { useState, useEffect, useCallback } from 'react'
import { 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  Dimensions, 
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native'
import TimeInput from "./TimeInput";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const { width } = Dimensions.get('window');
const scale = (size) => (width / 375) * size; 

const DIAS_MAP = {
  'Segunda': 'SEGUNDA',
  'Terça': 'TERCA',
  'Quarta': 'QUARTA',
  'Quinta': 'QUINTA',
  'Sexta': 'SEXTA',
  'Sábado': 'SABADO',
  'Domingo': 'DOMINGO'
};

export default function AgendaTab() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
  
  const [selectedDays, setSelectedDays] = useState([]);
  const [workStart, setWorkStart] = useState("");
  const [workEnd, setWorkEnd] = useState("");
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchConfiguracoes = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      
      const response = await axios.get(`${API_URL}/api/configuracao-agendamento`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data) {
        const { daysOfWeek, workStart, workEnd, breakStart, breakEnd } = response.data;
        
        setSelectedDays(daysOfWeek || []);
        setWorkStart(workStart?.slice(0, 5) || "08:00");
        setWorkEnd(workEnd?.slice(0, 5) || "18:00");
        setBreakStart(breakStart?.slice(0, 5) || "12:00");
        setBreakEnd(breakEnd?.slice(0, 5) || "13:00");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setWorkStart("08:00");
        setWorkEnd("18:00");
        setBreakStart("12:00");
        setBreakEnd("13:00");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfiguracoes();
  }, [fetchConfiguracoes]);

  async function handleSave() {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem('token');

      const body = {
        daysOfWeek: selectedDays,
        workStart: `${workStart}:00`,
        workEnd: `${workEnd}:00`,
        breakStart: `${breakStart}:00`,
        breakEnd: `${breakEnd}:00`,
      };

      await axios.patch(`${API_URL}/api/configuracao-agendamento`, body, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Alert.alert("Sucesso", "Configurações salvas corretamente!");
    } catch (error) {
      console.log("ERRO DETALHADO DO BACK:", error.response?.data);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  }

  const toggleDay = (diaPt) => {
    const diaEn = DIAS_MAP[diaPt];
    setSelectedDays(prev => 
      prev.includes(diaEn) ? prev.filter(d => d !== diaEn) : [...prev, diaEn]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7a2d2d" />
        <Text style={{ marginTop: 10 }}>Carregando preferências...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      
      <View style={styles.card}>
        <Text style={styles.title}>Dias de Atendimento</Text>
        {Object.keys(DIAS_MAP).map((dia, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.dayText}>{dia}</Text>
            <Switch 
              value={selectedDays.includes(DIAS_MAP[dia])} 
              onValueChange={() => toggleDay(dia)}
              trackColor={{ false: "#767577", true: "#00A884" }}
            />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Horário Comercial</Text>
        <View style={styles.rowInputs}>
          <View style={styles.inputWrapper}>
            <TimeInput label="Início" value={workStart} onChangeText={setWorkStart} />
          </View>
          <View style={styles.inputWrapper}>
            <TimeInput label="Término" value={workEnd} onChangeText={setWorkEnd} />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Intervalo / Pausa</Text>
        <View style={styles.rowInputs}>
          <View style={styles.inputWrapper}>
            <TimeInput label="Início" value={breakStart} onChangeText={setBreakStart} />
          </View>
          <View style={styles.inputWrapper}>
            <TimeInput label="Término" value={breakEnd} onChangeText={setBreakEnd} />
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.saveBtn, saving && { opacity: 0.7 }]} 
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Salvar Configurações</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: scale(16),
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: scale(20),
    borderRadius: scale(16),
    marginBottom: scale(16),
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: scale(16),
    fontWeight: 'bold',
    marginBottom: scale(15),
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
    height: scale(30),
  },
  dayText: {
    fontSize: scale(15),
    color: '#444',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: scale(5),
  },


   scrollContainer: { paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee'
  },
  dayText: { fontSize: 14, color: '#555' },
  rowInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  inputWrapper: { width: '48%' },
  saveBtn: {
    backgroundColor: '#7a2d2d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
})