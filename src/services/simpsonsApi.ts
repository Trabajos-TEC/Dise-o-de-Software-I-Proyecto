/*API DE LOS SIMPSONS SOLO EN PRUEBA */
const BASE_URL = 'https://thesimpsonsapi.com/api';

export async function getCharacterById(id: number) {
  const response = await fetch(`${BASE_URL}/characters/${id}`);

  if (!response.ok) {
    throw new Error('Personaje no encontrado');
  }

  return response.json();
}
