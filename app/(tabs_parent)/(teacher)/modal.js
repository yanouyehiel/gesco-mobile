import { View } from 'react-native';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
export default function Modal() {
  const isPresented = router.canGoBack();
  const { param } = useLocalSearchParams()

  useEffect(() => {
    console.log(param.length)
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <StatusBar style="dark" />
    </View>
  );
}
