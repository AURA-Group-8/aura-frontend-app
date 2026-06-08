import React, { useEffect, useState, useRef } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Location from 'expo-location'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import Navbar from './_Component/Navbar'

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [routeInfo, setRouteInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const webViewRef = useRef(null)
  const router = useRouter()
  const routeCacheRef = useRef({})

  const clinicLocation = {
    latitude: -23.555975,
    longitude: -46.657821,
  }

   const getUserLocation = async () => {
    try {
      console.log('📍 Iniciando busca de localização do dispositivo...')
      
      const isLocationEnabled =
        await Location.hasServicesEnabledAsync()
      if (!isLocationEnabled) {
        console.log('❌ Serviços de localização desativados no dispositivo')
        alert('Por favor, ative os serviços de localização')
        setIsLoading(false)
        return
      }

      const { status } =
        await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        console.log('❌ Permissão de localização negada pelo usuário')
        alert('Permissão de localização é necessária para usar este recurso')
        setIsLoading(false)
        return
      }

      console.log('✅ Permissão de localização concedida')
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
        maximumAge: 5000,
      })

      console.log('🎯 LOCALIZAÇÃO DO DISPOSITIVO OBTIDA:')

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }

      console.log('✓ Latitude:', userCoords.latitude)
      console.log('✓ Longitude:', userCoords.longitude)
      console.log('✓ Precisão:', location.coords.accuracy, 'metros')
      
      setUserLocation(userCoords)
      getRoute(userCoords)
    } catch (error) {
      console.log('❌ Erro ao obter localização:', error.message)
      alert('Erro ao obter sua localização. Tente novamente.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  useEffect(() => {
    if (webViewRef.current && userLocation) {
      const mapData = {
        type: 'UPDATE_LOCATION',
        userLocation: userLocation,
        clinicLocation: clinicLocation,
        route: routeCoordinates,
      }
      webViewRef.current.postMessage(JSON.stringify(mapData))
    }
  }, [userLocation, routeCoordinates])

  const handleRefresh = () => {
    console.log('🔄 Recarregando localização...')
    setIsLoading(true)
    setRouteInfo(null)
    setRouteCoordinates([])
    getUserLocation()
  }

 

  const getRoute = async (userCoords) => {
    try {
      console.log('Obtendo rota de:', userCoords, 'para:', clinicLocation)
      
      // Calcula distância aproximada entre os pontos (em metros) usando Haversine
      const R = 6371000; // Raio da Terra em metros
      const lat1 = (userCoords.latitude * Math.PI) / 180
      const lat2 = (clinicLocation.latitude * Math.PI) / 180
      const deltaLat = ((clinicLocation.latitude - userCoords.latitude) * Math.PI) / 180
      const deltaLon = ((clinicLocation.longitude - userCoords.longitude) * Math.PI) / 180
      
      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distanceMeters = R * c
      
      console.log('📍 Distância aproximada:', (distanceMeters / 1000).toFixed(1), 'km')
      
      // Se a distância for maior que 6000 km, não tenta usar a API
      if (distanceMeters > 6000000) {
        console.log('⚠️ Distância muito grande para calcular rota (máximo 6000 km)')
        // Mostra informações estimadas
        const estimatedHours = Math.ceil(distanceMeters / 1000 / 80)
        const routeInfoData = {
          distance: (distanceMeters / 1000).toFixed(1) + ' km',
          duration: estimatedHours > 24 ? Math.ceil(estimatedHours / 24) + 'd' : estimatedHours + 'h',
        }
        setRouteInfo(routeInfoData)
        setIsLoading(false)
        return
      }
      
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/geojson?api_key=5b3ce3597851110001cf6248be6268394fb74574a244f60737fd4276',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [userCoords.longitude, userCoords.latitude],
              [clinicLocation.longitude, clinicLocation.latitude],
            ],
          }),
        }
      )

      const data = await response.json()
      console.log('✓ Status da resposta:', response.status)
      console.log('✓ Resposta completa:', data)
      console.log('✓ Features encontradas:', data.features?.length || 0)

      if (data.features && data.features.length > 0) {
        const coordinates =
          data.features[0].geometry.coordinates.map(
            ([longitude, latitude]) => ({
              latitude,
              longitude,
            })
          )

        console.log('✓ Rota com', coordinates.length, 'pontos')

        const properties = data.features[0].properties
        let routeInfoData = null

        if (properties && properties.summary) {
          const distanceKm = (properties.summary.distance / 1000).toFixed(1)
          const totalMinutes = Math.ceil(properties.summary.duration / 60)

          const hours = Math.floor(totalMinutes / 60)
          const minutes = totalMinutes % 60

          let formattedDuration = ''

          if (hours > 0) {
            formattedDuration = `${hours}h`

            if (minutes > 0) {
              formattedDuration += ` ${minutes}m`
            }
          } else {
            formattedDuration = `${minutes} min`
          }

          routeInfoData = {
            distance: `${distanceKm} km`,
            duration: formattedDuration,
          }
          console.log(`✓✓✓ Distância: ${distanceKm}km, Tempo: ${formattedDuration}`)
        }

        setRouteCoordinates(coordinates)
        setRouteInfo(routeInfoData)
      }
    } catch (error) {
      console.error('Erro ao obter rota:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data)
    if (data.type === 'MAP_READY') {
      console.log('Mapa Leaflet carregado com sucesso')
    }
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aura Maps</title>

        <!-- Leaflet CSS -->
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
        />

        <style>
          body,
          html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
              'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
              'Helvetica Neue', sans-serif;
          }

          #map {
            width: 100%;
            height: 100%;
          }

          .custom-popup {
            font-size: 14px;
          }

          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
            }
          }

          .user-marker-pulse {
            animation: pulse 2s infinite;
          }
        </style>
      </head>

      <body>
        <div id="map"></div>

        <!-- Leaflet JS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"><\/script>

        <script>
          // Inicializa o mapa
          const map = L.map('map').setView([-23.555975, -46.657821], 13);

          // Adiciona tiles do OpenStreetMap
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
            maxZoom: 19,
          }).addTo(map);

          // Marcadores
          let userMarker = null;
          let clinicMarker = null;
          let routePolyline = null;

          // Ícone customizado para usuário
          const userIcon = L.divIcon({
            html: '<div class="user-marker-pulse" style="background-color: #4285F4; border-radius: 50%; width: 30px; height: 30px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><\/div>',
            iconSize: [30, 30],
            className: 'user-marker',
          });

          // Ícone customizado para clínica
          const clinicIcon = L.divIcon({
            html: '<div style="background-color: #EA4335; border-radius: 50%; width: 30px; height: 30px; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; font-size: 16px;">+<\/div>',
            iconSize: [30, 30],
            className: 'clinic-marker',
          });

          // Recebe dados do React Native
          document.addEventListener('message', function (e) {
            const data = JSON.parse(e.data);

            if (data.type === 'UPDATE_LOCATION') {
              const { userLocation, clinicLocation, route } = data;
              const bounds = L.latLngBounds();

              // Atualiza marcador do usuário
              if (userLocation) {
                if (userMarker) {
                  map.removeLayer(userMarker);
                }
                userMarker = L.marker(
                  [userLocation.latitude, userLocation.longitude],
                  { icon: userIcon, zIndexOffset: 1000 }
                )
                  .addTo(map)
                  .bindPopup('Você está aqui');
                bounds.extend([userLocation.latitude, userLocation.longitude]);
              }

              // Atualiza marcador da clínica
              if (clinicLocation) {
                if (clinicMarker) {
                  map.removeLayer(clinicMarker);
                }
                clinicMarker = L.marker(
                  [clinicLocation.latitude, clinicLocation.longitude],
                  { icon: clinicIcon, zIndexOffset: 1000 }
                )
                  .addTo(map)
                  .bindPopup('Clínica Aura');
                bounds.extend([clinicLocation.latitude, clinicLocation.longitude]);
              }

              // Atualiza rota
              if (route && route.length > 0) {
                if (routePolyline) {
                  map.removeLayer(routePolyline);
                }
                // Converte array de objetos para array de [lat, lng]
                const routeLatLng = route.map(point => [point.latitude, point.longitude]);
                
                routePolyline = L.polyline(routeLatLng, {
                  color: '#4285F4',
                  weight: 6,
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round',
                  dashArray: 'none'
                }).addTo(map);
                
                // Adiciona todos os pontos da rota aos bounds
                routeLatLng.forEach(point => bounds.extend(point));
              }

              // Ajusta o mapa para mostrar toda a rota/marcadores
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
              } else if (clinicLocation) {
                // Fallback: centraliza na clínica
                map.setView([clinicLocation.latitude, clinicLocation.longitude], 13);
              }
            }
          });

          // Notifica o React Native que o mapa está pronto
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'MAP_READY' })
            );
          }
        <\/script>
      <\/body>
    <\/html>
  `

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/Client/schedules')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Localização</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
          disabled={isLoading}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleWebViewMessage}
        scrollEnabled={false}
        zoomEnabled={false}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="location" size={48} color="#8a1c3a" />
            <Text style={styles.loadingText}>Carregando localização...</Text>
          </View>
        </View>
      )}

      {routeInfo && (
        <View style={styles.routeInfoContainer}>
          <Text style={styles.routeDestination}>Como chegar na clínica</Text>
          <View style={styles.routeAddressContainer}>
            <Ionicons name="location" size={20} color="#EA4335" style={styles.addressIcon} />
            <Text style={styles.routeAddressText}>Rua Augusta, 1389 - Consolação, SP</Text>
          </View>
          <View style={styles.routeDetailsRow}>
            <View style={styles.routeDetailItem}>
              <Ionicons name="time-outline" size={24} color="#666" />
              <Text style={styles.routeDetailText}>{routeInfo.duration}</Text>
            </View>
            <View style={styles.routeDivider} />
            <View style={styles.routeDetailItem}>
              <Ionicons name="location-outline" size={24} color="#EA4335" />
              <Text style={styles.routeDetailText}>{routeInfo.distance}</Text>
            </View>
          </View>
        </View>
      )}
      <Navbar active="Localização" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8a1c3a',
    paddingTop: 25,
    paddingBottom: 12,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingSpinner: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginTop: 16,
  },
  routeInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  routeDestination: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  routeAddressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  addressIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  routeAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  routeDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  routeDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
  },
  routeDetailItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDetailIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  routeDetailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginTop: 4,
  },
})