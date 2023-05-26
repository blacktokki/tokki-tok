import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useLangContext from '../hooks/useLangContext';

export default function NotFoundScreen({
  navigation,
}: StackScreenProps<any, 'NotFound'>) {
  const { lang } = useLangContext()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lang("This screen doesn't exist.")}</Text>
      <TouchableOpacity onPress={() => navigation.replace('HomeScreen')} style={styles.link}>
        <Text style={styles.linkText}>{lang("Go to home screen!")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
