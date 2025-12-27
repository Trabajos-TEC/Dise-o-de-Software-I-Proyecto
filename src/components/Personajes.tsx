import { useState } from 'react';
import { getCharacterById } from '../services/simpsonsApi';

type Character = {
  id: number;
  name: string;
  gender: string;
  species: string;
  status: string;
};

function Personajes() {
  const [id, setId] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState('');

  const buscarPersonaje = async () => {
    setError('');
    setCharacter(null);

    try {
      const data = await getCharacterById(Number(id));
      setCharacter(data);
    } catch {
      setError('No se encontro el personaje');
    }
  };

  return (
    <div>
      <h2>Buscar personaje por ID</h2>

      <input
        type="number"
        placeholder="ID del personaje"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={buscarPersonaje}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {character && (
        <div>
          <img
            src={`https://cdn.thesimpsonsapi.com/500/character/${character.id}.webp`}
            alt={`Imagen de ${character.name}`}
            loading="lazy"
            width={250}
          />

          <h3>{character.name}</h3>
          <p>Genero: {character.gender}</p>
          <p>Especie: {character.species}</p>
          <p>Estado: {character.status}</p>
        </div>
      )}
    </div>
  );
}

export default Personajes;
