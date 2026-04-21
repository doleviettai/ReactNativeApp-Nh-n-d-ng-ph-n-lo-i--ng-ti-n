// app/camera.tsx
// Tối ưu cho iPhone 12 Pro Max — full quality, HDR, autofocus, tap to focus, zoom 1x/2x/3x
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import {
  CameraView,
  CameraType,
  FlashMode,
  useCameraPermissions,
} from 'expo-camera';
import { router } from 'expo-router';
import CameraFrame from '@/components/CameraFrame';
import { Colors } from '@/constants/colors';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('auto'); // auto thay vì off
  const [zoom, setZoom] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Cần quyền truy cập camera</Text>
          <Text style={styles.permissionDesc}>
            App cần dùng camera để chụp ảnh tờ tiền
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Cấp quyền</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Tap to focus — hiện vòng tròn vàng tại điểm chạm
  const handleTapFocus = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setFocusPoint({ x: locationX, y: locationY });
    setTimeout(() => setFocusPoint(null), 1200);
  };

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,            // 1.0 = không nén, max quality
        skipProcessing: false, // false = để iOS xử lý HDR + noise reduction tự nhiên
        exif: false,
        base64: false,
      });

      if (photo?.uri) {
        router.push({ pathname: '/result', params: { imageUri: photo.uri } });
      }
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.');
    } finally {
      setCapturing(false);
    }
  };

  // Xoay vòng 3 chế độ flash: auto → on → off
  const cycleFlash = () => {
    const modes: FlashMode[] = ['auto', 'on', 'off'];
    setFlash(modes[(modes.indexOf(flash) + 1) % modes.length]);
  };

  const flashIcon  = flash === 'on' ? '⚡' : flash === 'auto' ? '🔆' : '🔇';
  const flashLabel = flash === 'on' ? 'Bật'  : flash === 'auto' ? 'Tự động' : 'Tắt';

  return (
    <View style={styles.container}>
      {/* ── Camera view ── */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flash}
        zoom={zoom}
        autofocus="on"          // luôn bật autofocus
        pictureSize="Photo"     // dùng kích thước ảnh lớn nhất thiết bị hỗ trợ
        onTouchEnd={handleTapFocus}
      />

      {/* ── Tap to focus ring ── */}
      {focusPoint && (
        <View
          pointerEvents="none"
          style={[
            styles.focusRing,
            { left: focusPoint.x - 30, top: focusPoint.y - 30 },
          ]}
        />
      )}

      {/* ── Khung ngắm ── */}
      <CameraFrame hint={'Đưa tờ tiền vào giữa khung\nCanh đủ ánh sáng để kết quả chính xác nhất'} />

      {/* ── Top bar: đóng + tiêu đề + flash ── */}
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Text style={styles.iconBtnText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>Chụp tờ tiền</Text>

        <TouchableOpacity style={styles.flashBtn} onPress={cycleFlash}>
          <Text style={styles.iconBtnText}>{flashIcon}</Text>
          <Text style={styles.flashLabel}>{flashLabel}</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Zoom bar: 1x / 2x / 3x ── */}
      <View style={styles.zoomBar} pointerEvents="box-none">
        {[
          { label: '1x', value: 0 },
          { label: '2x', value: 0.5 },
          { label: '3x', value: 1 },
        ].map((z) => (
          <TouchableOpacity
            key={z.label}
            style={[styles.zoomBtn, zoom === z.value && styles.zoomBtnActive]}
            onPress={() => setZoom(z.value)}
          >
            <Text style={[styles.zoomText, zoom === z.value && styles.zoomTextActive]}>
              {z.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Bottom controls: flip / shutter ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
        >
          <Text style={styles.sideBtnText}>🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.shutter, capturing && styles.shutterCapturing]}
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={capturing}
        >
          <View style={[styles.shutterInner, capturing && { backgroundColor: '#ccc' }]} />
        </TouchableOpacity>

        {/* placeholder giữ cân bằng layout */}
        <View style={styles.sideBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  // ── Top bar ──
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  iconBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 16 },
  flashBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    minWidth: 60,
    gap: 2,
  },
  flashLabel: {
    color: Colors.gold,
    fontSize: 9,
    fontWeight: '600',
  },

  // ── Focus ring ──
  focusRing: {
    position: 'absolute',
    width: 60, height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    zIndex: 20,
  },

  // ── Zoom bar ──
  zoomBar: {
    position: 'absolute',
    bottom: 128,
    left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    zIndex: 10,
  },
  zoomBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  zoomBtnActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  zoomText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  zoomTextActive: {
    color: '#1a0a00',
    fontWeight: '700',
  },

  // ── Bottom bar ──
  bottomBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(13,13,26,0.9)',
    paddingTop: 20,
    paddingBottom: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 44,
  },
  sideBtn: {
    width: 46, height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideBtnText: { fontSize: 20 },
  shutter: {
    width: 76, height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  shutterCapturing: {
    opacity: 0.7,
    transform: [{ scale: 0.93 }],
  },
  shutterInner: {
    width: 58, height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },

  // ── Permission screen ──
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 14,
  },
  permissionIcon: { fontSize: 56 },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  permissionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  permissionBtn: {
    marginTop: 8,
    backgroundColor: Colors.gold,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  permissionBtnText: {
    color: '#1a0a00',
    fontWeight: '700',
    fontSize: 15,
  },
});