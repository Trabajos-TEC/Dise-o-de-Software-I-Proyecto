// navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Personajes: undefined;
  Ubicaciones: undefined;
  Episodios: undefined;
  CardDetail: {
    type: 'personaje' | 'episodio' | 'ubicacion';
    data: any;
  };
};