import { View, Text, StyleSheet, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function CardJob({ 
  job, 
  onEdit, 
  onDelete 
}) {
  if (!job) {
    return null
  }

  console.log('🎨 CardJob recebido:', { 
    id: job.id, 
    duration: job.duration, 
    minutes: job.minutes,
    name: job.name 
  })

  const formatPrice = (price) => {
    if (!price) return 'R$ 0,00'
    return `R$ ${Number(price).toFixed(2).replace('.', ',')}`
  }

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return '-'
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }

  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {job.name || job.jobName || 'Serviço'}
          </Text>
          
          {job.description && (
            <Text style={styles.description} numberOfLines={1}>
              {job.description}
            </Text>
          )}

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons 
                name="time-outline" 
                size={14} 
                color="#7A5A52"
                style={styles.detailIcon}
              />
              <Text style={styles.detailText}>
                {formatDuration(job.duration || job.minutes)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.priceIcon}>$</Text>
              <Text style={styles.detailText}>
                {formatPrice(job.price || job.value)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Pressable
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit && onEdit(job)}
          >
            <Ionicons 
              name="pencil" 
              size={18} 
              color="#281111"
            />
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete && onDelete(job.id || job.idServico || job.jobId)}
          >
            <Ionicons 
              name="trash" 
              size={18} 
              color="#BE4053"
            />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9E2DD',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#281111',
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: '#7A5A52',
    marginBottom: 10,
  },

  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  detailIcon: {
    marginRight: 2,
  },

  priceIcon: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5A52',
    marginRight: 2,
  },

  detailText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7A5A52',
  },

  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editButton: {
    backgroundColor: '#F5E5D8',
  },

  deleteButton: {
    backgroundColor: '#FFE8EC',
  },
})
