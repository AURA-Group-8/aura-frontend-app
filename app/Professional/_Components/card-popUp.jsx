import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';

export default function CardPopUp({ visible, type = 'success', message, onClose, duration = 3000 }) {
  const isSuccess = type === 'success';

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.container} onPress={onClose}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, isSuccess ? styles.successIcon : styles.errorIcon]}>
            <Text style={styles.icon}>{isSuccess ? '✓' : '✕'}</Text>
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 24,
    width: '80%',
    maxWidth: 350,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    backgroundColor: '#259838',
  },
  errorIcon: {
    backgroundColor: '#DC4C4C',
  },
  icon: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    color: '#281111',
    textAlign: 'center',
  },
});
