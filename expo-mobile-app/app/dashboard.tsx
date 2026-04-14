import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

const PRICE_PER_KG = 230;

export default function DashboardScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [sales, setSales] = useState([]);
  const [scannedData, setScannedData] = useState('');
  
  // Sale form states
  const [customerName, setCustomerName] = useState('');
  const [customerVillage, setCustomerVillage] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

  const router = useRouter();
  const cameraRef = useRef(null);

  useEffect(() => {
    checkLogin();
    loadSales();
  }, []);

  const checkLogin = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('sai_admin_logged_in');
      if (loggedIn !== 'true') {
        router.replace('/');
      } else {
        setLoggedIn(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify login');
      router.replace('/');
    }
  };

  const loadSales = async () => {
    try {
      const data = await AsyncStorage.getItem('sai_green_house_sales_v2');
      if (data) {
        setSales(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading sales:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('sai_admin_logged_in');
      setLoggedIn(false);
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'Logout failed');
    }
  };

  const handleBarCodeScanned = async ({ data }) => {
    try {
      const parsedData = JSON.parse(data);
      setCustomerName(parsedData.name || '');
      setCustomerVillage(parsedData.village || '');
      setCustomerPhone(parsedData.phone || '');
      setScannedData(data);
      setIsCameraOpen(false);
      Alert.alert('Success', 'Customer data loaded from QR code!');
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format. Use customer QR codes only.');
    }
  };

  const handleSaveSale = async () => {
    if (!customerName.trim() || !customerVillage.trim() || !customerPhone.trim() || !quantityKg.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const newSale = {
        id: Math.random().toString(36).substr(2, 9),
        customerName,
        customerVillage,
        customerPhone,
        quantityKg: parseFloat(quantityKg),
        saleDate,
        rate: PRICE_PER_KG,
        total: parseFloat(quantityKg) * PRICE_PER_KG,
        createdAt: new Date().toISOString(),
      };

      const updatedSales = [...sales, newSale];
      setSales(updatedSales);
      await AsyncStorage.setItem('sai_green_house_sales_v2', JSON.stringify(updatedSales));

      Alert.alert('Success', `Sale added for ${customerName}!`);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save sale');
      console.error('Error saving sale:', error);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerVillage('');
    setCustomerPhone('');
    setQuantityKg('');
    setSaleDate(new Date().toISOString().split('T')[0]);
    setScannedData('');
  };

  if (!loggedIn) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a8dce" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sai Green House Paper</Text>
          <Text style={styles.headerSubtitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Camera Modal */}
      {isCameraOpen && permission?.granted ? (
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            onBarcodeScanned={handleBarCodeScanned}
          />
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => setIsCameraOpen(false)}
          >
            <Text style={styles.closeCameraText}>✕ Close Camera</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Scanner Button */}
      {!isCameraOpen && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={async () => {
            if (permission?.granted) {
              setIsCameraOpen(true);
            } else {
              const result = await requestPermission();
              if (result?.granted) {
                setIsCameraOpen(true);
              } else {
                Alert.alert('Error', 'Camera permission required');
              }
            }
          }}
        >
          <Text style={styles.scanButtonText}>📷 Scan Customer QR Code</Text>
        </TouchableOpacity>
      )}

      {/* Sale Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Add New Sale</Text>

        <Text style={styles.label}>Customer Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer name"
          value={customerName}
          onChangeText={setCustomerName}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Village *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter village"
          value={customerVillage}
          onChangeText={setCustomerVillage}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Quantity (KG) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
          value={quantityKg}
          onChangeText={setQuantityKg}
          keyboardType="decimal-pad"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Sale Date *</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={saleDate}
          onChangeText={setSaleDate}
          placeholderTextColor="#999"
        />

        {quantityKg && (
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
              Rs {(parseFloat(quantityKg) * PRICE_PER_KG).toLocaleString('en-IN')}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSale}>
          <Text style={styles.saveButtonText}>Save Sale</Text>
        </TouchableOpacity>
      </View>

      {/* Sales Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Today's Sales: {sales.length}</Text>
        {sales.length > 0 && (
          <>
            <Text style={styles.summaryText}>
              Total KG: {sales.reduce((sum, s) => sum + s.quantityKg, 0).toFixed(2)}
            </Text>
            <Text style={styles.summaryText}>
              Total Amount: Rs {sales.reduce((sum, s) => sum + s.total, 0).toLocaleString('en-IN')}
            </Text>
          </>
        )}
      </View>

      {scannedData && (
        <View style={styles.scanResultBox}>
          <Text style={styles.scanResultTitle}>Last Scanned Data:</Text>
          <Text style={styles.scanResultText}>{scannedData}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f3fc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f3fc',
  },
  header: {
    backgroundColor: '#1a8dce',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#f04b9a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cameraContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  closeCameraButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  closeCameraText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scanButton: {
    margin: 15,
    backgroundColor: '#1a8dce',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a8dce',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  totalBox: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1a8dce',
  },
  totalLabel: {
    color: '#666',
    fontSize: 14,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a8dce',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#1a8dce',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f04b9a',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  scanResultBox: {
    backgroundColor: '#e8f5e9',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  scanResultTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  scanResultText: {
    color: '#1b5e20',
    fontSize: 12,
  },
});
