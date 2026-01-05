import { useState } from 'react';
import { getCharacterById } from '../services/simpsonsApi';

type Location = {
  id: number;
  name: string;
  town: string;
  use: string;
};

function Personajes() {
  const [id, setId] = useState('');
  const [character, setCharacter] = useState<Location | null>(null);
  const [error, setError] = useState('');

  const buscarUbicacion = async () => {
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
      <h2>Buscar ciudad por ID</h2>

      <input
        type="number"
        placeholder="ID del personaje"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={buscarUbicacion}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {character && (
        <div>
          <img
            src={`https://cdn.thesimpsonsapi.com/500/locations/${character.id}.webp`}
            alt={`Imagen de ${character.name}`}
            loading="lazy"
            width={250}
          />

          <h3>{character.name}</h3>
          <p>Ciudad: {character.town}</p>
          <p>Uso: {character.use}</p>
        </div>
      )}
    </div>
  );
}

export default Personajes;
