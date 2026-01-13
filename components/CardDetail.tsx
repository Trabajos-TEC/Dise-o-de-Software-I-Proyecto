import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

type RouteParams = {
  type: 'personaje' | 'episodio' | 'ubicacion';
  data: any;
};

const CardDetail = () => {
  const route = useRoute();
  const { type, data } = route.params as RouteParams;

  // Función para construir URL de imagen según tipo y id
  const getImageUrl = () => {
    if (!data.id) return null;
    if (type === 'personaje') return `https://cdn.thesimpsonsapi.com/500/character/${data.id}.webp`;
    if (type === 'episodio') return `https://cdn.thesimpsonsapi.com/500/episode/${data.id}.webp`;
    if (type === 'ubicacion') return `https://cdn.thesimpsonsapi.com/500/location/${data.id}.webp`;
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.name}</Text>

      {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}

      {type === 'personaje' && (
        <>
          <Text>Status: {data.status}</Text>
          <Text>Gender: {data.gender}</Text>
          <Text>Birthdate: {data.birthdate || 'Desconocida'}</Text>
          <Text>ID: {data.id}</Text>
          {data.occupation && <Text>Occupation: {data.occupation}</Text>}
        </>
      )}

      {type === 'episodio' && (
        <>
          <Text>Season: {data.season}</Text>
          <Text>Episode number: {data.episode_number}</Text>
          <Text>Airdate: {data.airdate}</Text>
          <Text>Description: {data.description}</Text>
          <Text>ID: {data.id}</Text>
        </>
      )}

      {type === 'ubicacion' && (
        <>
          <Text>ID: {data.id}</Text>
          <Text>Name: {data.name}</Text>
          <Text>Description: {data.description || 'No disponible'}</Text>
          {data.town && <Text>Town: {data.town}</Text>}
          {data.use && <Text>Use: {data.use}</Text>}
          {data.first_appearance_ep_id && (
            <Text>First appearance episode ID: {data.first_appearance_ep_id}</Text>
          )}
          {data.first_appearance_sh_id && (
            <Text>First appearance short ID: {data.first_appearance_sh_id}</Text>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 16,
    borderRadius: 8,
  },
});

export default CardDetail;
