
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function CardSchedule({ schedule }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.name}>{schedule.cliente ?? 'Cliente'}</Text>
          <Text style={styles.servico}>{schedule.servico}</Text>
        </View>
        <View style={[styles.statusBadge, schedule.status === 'Concluído' ? styles.statusConfirmed : styles.statusPending]}>
          <Text style={styles.statusText}>{schedule.status}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.detail}>{schedule.data}</Text>
        </View>
        <View style={styles.priceBox}>
          <Text style={styles.label}>Valor</Text>
          <Text style={styles.price}>{schedule.valor}</Text>
        </View>
      </View>

      <View style={{...styles.detailsRow, justifyContent: 'flex-start', gap: 20}}>
        <Text style={styles.label}>Pago</Text>
        <Text style={styles.detail}>{schedule.pago ? 'Sim' : 'Não'}</Text>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={[styles.actionButton, styles.cancelButton]}>
          <Text style={styles.actionText}>✕</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.confirmButton]}>
          <Text style={styles.actionText}>✓</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E9E2DD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#281111',
    marginBottom: 4,
  },

  servico: {
    fontSize: 14,
    color: '#7A5A52',
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },

  statusConfirmed: {
    backgroundColor: '#E8F6EF',
  },

  statusPending: {
    backgroundColor: '#FCE8E8',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#281111',
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    color: '#7A5A52',
    marginBottom: 4,
  },

  detail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#281111',
  },

  priceBox: {
    alignItems: 'flex-end',
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#281111',
  },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButton: {
    backgroundColor: '#F7E1E0',
  },

  confirmButton: {
    backgroundColor: '#E3F7ED',
  },

  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#281111',
  },
});


