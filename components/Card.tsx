import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title: string;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
});

export default Card;
