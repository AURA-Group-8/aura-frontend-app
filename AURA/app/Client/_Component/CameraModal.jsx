import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import { CameraView, useCameraPermissions } from 'expo-camera'
import * as FileSystem from 'expo-file-system/legacy'
import { useRef, useState, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function CameraModal({ visible, onClose, onPhotoCapture }) {
  const cameraRef = useRef(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)

  // Solicitar permissão de câmera ao montar o componente
  useEffect(() => {
    (async () => {
      if (permission?.granted === false) {
        await requestPermission()
      }
    })()
  }, [permission?.granted])

  // Tirar foto
  const takePhoto = async () => {
    if (!cameraRef.current || isCapturing) return

    try {
      setIsCapturing(true)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      })
      setCapturedPhoto(photo)
    } catch (error) {
      console.error('Erro ao capturar foto:', error)
      Alert.alert('Erro', 'Não foi possível capturar a foto')
    } finally {
      setIsCapturing(false)
    }
  }

  // Salvar foto localmente e fechar modal
  const saveCapturedPhoto = async () => {
    if (!capturedPhoto) return

    try {
      setIsCapturing(true)

      // Define o caminho onde a foto será salva
      const fileName = `profile_photo_${Date.now()}.jpg`
      const destPath = `${FileSystem.documentDirectory}${fileName}`

      // Move o arquivo da câmera para a pasta de documentos
      await FileSystem.moveAsync({
        from: capturedPhoto.uri,
        to: destPath,
      })

      // Passar a foto capturada para o componente pai
      onPhotoCapture({
        uri: destPath,
        timestamp: Date.now(),
      })

      // Limpar estado e fechar modal
      setCapturedPhoto(null)
      onClose()
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      Alert.alert('Erro', 'Não foi possível salvar a foto')
    } finally {
      setIsCapturing(false)
    }
  }

  // Descartar foto capturada
  const discardPhoto = () => {
    setCapturedPhoto(null)
  }

  if (!permission) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <ActivityIndicator size="large" color="#982546" />
            <Text style={styles.permissionText}>Solicitando permissão de câmera...</Text>
          </View>
        </View>
      </Modal>
    )
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.permissionContainer}>
            <Ionicons name="lock-closed" size={48} color="#982546" />
            <Text style={styles.permissionText}>
              Permissão de câmera negada. Verifique as configurações do aplicativo.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {capturedPhoto ? (
          // Tela de visualização da foto capturada
          <View style={styles.previewContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Sua foto</Text>
              <TouchableOpacity onPress={onClose} style={styles.headerClose}>
                <Ionicons name="close" size={28} color="#FFF3DC" />
              </TouchableOpacity>
            </View>

            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
            </View>

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={discardPhoto}
                disabled={isCapturing}
              >
                <MaterialCommunityIcons name="close" size={24} color="#982546" />
                <Text style={styles.cancelButtonText}>Descartar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.confirmButton, isCapturing && styles.disabledButton]}
                onPress={saveCapturedPhoto}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="check" size={24} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : Platform.OS === 'web' ? (
          <View style={styles.webUnavailableContainer}>
            <Ionicons name="camera-outline" size={48} color="#FFF3DC" />
            <Text style={styles.webUnavailableText}>
              Câmera não disponível na versão web
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CameraView style={styles.camera} ref={cameraRef} facing="front">
            <View style={styles.cameraHeader}>
              <Text style={styles.cameraTitle}>Foto de perfil</Text>
              <TouchableOpacity onPress={onClose} style={styles.headerClose}>
                <Ionicons name="close" size={28} color="#FFF3DC" />
              </TouchableOpacity>
            </View>

            <View style={styles.cameraContent}>
              <View style={styles.focusBox} />
            </View>

            <View style={styles.cameraFooter}>
              <TouchableOpacity
                style={[styles.captureButton, isCapturing && styles.disabledCaptureButton]}
                onPress={takePhoto}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator size="large" color="#982546" />
                ) : (
                  <View style={styles.captureCircle} />
                )}
              </TouchableOpacity>
            </View>
          </CameraView>
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // Estilos de câmera
  camera: {
    flex: 1,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cameraTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF3DC',
  },
  headerClose: {
    padding: 8,
  },
  cameraContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusBox: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 243, 220, 0.5)',
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCaptureButton: {
    opacity: 0.6,
  },
  captureCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#982546',
  },

  // Estilos de prévia
  previewContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF3DC',
  },
  imagePreviewWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  previewImage: {
    width: '100%',
    height: '80%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#982546',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#982546',
  },
  confirmButton: {
    backgroundColor: '#982546',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },

  // Estilos de permissão
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
  },
  permissionText: {
    fontSize: 16,
    color: '#FFF3DC',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  closeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#982546',
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  webUnavailableContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  webUnavailableText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF3DC',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
})

