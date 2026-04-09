import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';

export default function CardPopUp({ visible, message = 'Atendimento agendado!', type = 'success', onClose }) {
  const isSuccess = type === 'success';
  const icon = isSuccess ? '✓' : '✕';
  const iconColor = isSuccess ? '#17A061' : '#D32F2F';
  const backgroundColor = isSuccess ? '#E8F6EF' : '#FFEBEE';

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  icon: {
    fontSize: 60,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  message: {
    fontSize: 24,
    fontWeight: '700',
    color: '#281111',
    textAlign: 'center',
    marginBottom: 28,
  },

  closeButton: {
    backgroundColor: '#982546',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    minWidth: 120,
  },

  closeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
