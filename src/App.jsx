
import { useEffect, useState } from "react";
import "./App.css";

function PokemonCard({ pokemon }) {
    return (
        <article className="pokemon-card">
            <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
            <h3>{pokemon.name}</h3>
            <p>Pokédex #{String(pokemon.id).padStart(3, "0")}</p>
        </article>
    );
}

function App() {
    const [pokemon, setPokemon] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        let ignore = false;

        async function fetchPokemon() {
            try {
                const response = await fetch(
                    "https://pokeapi.co/api/v2/pokemon?limit=151"
                );

                if (!response.ok) {
                    throw new Error("Could not load Pokémon.");
                }

                const data = await response.json();

                if (!ignore) {
                    const pokemonList = data.results.map((item, index) => ({
                        id: index + 1,
                        name: item.name,
                        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${index + 1}.png`,
                    }));

                    setPokemon(pokemonList);
                    setError("");
                }
            } catch {
                if (!ignore) {
                    setError("Pokémon could not load. Check your internet connection.");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        fetchPokemon();

        return () => {
            ignore = true;
        };
    }, [reload]);

    const filteredPokemon = pokemon.filter((item) =>
        item.name.includes(search.toLowerCase().trim())
    );

    function retryLoading() {
        setLoading(true);
        setReload((previous) => previous + 1);
    }

    return (
        <div className="app">
            <header className="hero">
                <p className="eyebrow">Kanto Region · Generation One</p>
                <h1>My Pokémon Pokédex</h1>
                <p>
                    Explore the original 151 Pokémon in this React-powered Pokédex.
                </p>
            </header>

            <main className="content">
                <section className="welcome">
                    <div className="welcome-text">
                        <h2>Welcome, Trainer!</h2>
                        <p>
                            Search Pokémon, explore sprites, and keep track of your
                            discoveries.
                        </p>
                    </div>

                    <div className="counter">
                        <p>Trainer button clicks</p>
                        <strong>{count}</strong>
                        <button onClick={() => setCount((previous) => previous + 1)}>
                            Record a discovery
                        </button>
                    </div>
                </section>

                <section className="dex">
                    <div className="section-heading">
                        <div>
                            <h2>Pokémon Collection</h2>
                            <p>{filteredPokemon.length} Pokémon found</p>
                        </div>

                        <input
                            type="search"
                            placeholder="Search Pokémon..."
                            aria-label="Search Pokémon by name"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    {loading && <p role="status">Loading Pokémon...</p>}

                    {error && (
                        <div className="error" role="alert">
                            <p>{error}</p>
                            <button onClick={retryLoading}>Try again</button>
                        </div>
                    )}

                    {!loading && !error && filteredPokemon.length === 0 && (
                        <p>No Pokémon match that search. Try another name.</p>
                    )}

                    <div className="pokemon-grid">
                        {filteredPokemon.map((item) => (
                            <PokemonCard key={item.id} pokemon={item} />
                        ))}
                    </div>
                </section>
            </main>

            <footer>
                <p>Built with React, JavaScript, CSS, and the PokéAPI.</p>
            </footer>
        </div>
    );
}

export default App;
