"use client";

import { useEffect, useMemo, useState } from "react";

type GameKey = "truth" | "mime" | "bottle" | "who" | "flash" | "dark";

const games: Array<{
  id: GameKey;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  tone: string;
  premium?: boolean;
}> = [
  { id: "truth", number: "01", title: "VÉRITÉ\nOU GAGE", subtitle: "Dis la vérité. Ou assume.", icon: "✦", tone: "coral" },
  { id: "mime", number: "02", title: "MIME\nÇA !", subtitle: "Pas un mot. Que du talent.", icon: "☝", tone: "yellow" },
  { id: "bottle", number: "03", title: "LA\nBOUTEILLE", subtitle: "Le hasard choisit pour toi.", icon: "↗", tone: "blue" },
  { id: "who", number: "04", title: "QUI DE\nNOUS ?", subtitle: "Votez. Réglez vos comptes.", icon: "☻", tone: "lime" },
  { id: "flash", number: "05", title: "DÉFI\nÉCLAIR", subtitle: "30 secondes. Zéro excuse.", icon: "ϟ", tone: "pink" },
  { id: "dark", number: "06", title: "AFTER\nDARK", subtitle: "Questions coquines. Réservé aux adultes.", icon: "♥", tone: "dark", premium: true },
];

const truthPrompts = [
  "Quel est ton plus gros mensonge de cette année ?",
  "Quelle personne ici survivrait le moins longtemps sur une île déserte ?",
  "Qui dans le groupe embrasserais-tu si tu devais choisir ?",
  "Quel message regrettes-tu le plus d’avoir envoyé ?",
  "Quelle est ta peur la plus ridicule ?",
];

const darePrompts = [
  "Envoie « tu me manques » à la 5e personne de tes messages.",
  "Imite ton rire le plus gênant pendant 15 secondes.",
  "Danse sans musique jusqu’à ce que le groupe applaudisse.",
  "Laisse le groupe choisir ta prochaine photo de profil.",
  "Fais une déclaration d’amour dramatique à l’objet le plus proche.",
];

const bottleChallenges = [
  "Fais rire le groupe en moins de 20 secondes.",
  "Imite une personne du groupe jusqu’à ce qu’on la reconnaisse.",
  "Raconte ton dernier moment vraiment gênant.",
  "Danse pendant 15 secondes sans aucune musique.",
  "Laisse le groupe choisir un mot que tu dois placer dans chaque phrase jusqu’au prochain tour.",
  "Fais un compliment sincère à chaque personne du groupe.",
  "Parle comme dans un film dramatique jusqu’au prochain lancer.",
  "Montre la dernière photo de ta galerie — sans tricher.",
];

const content: Record<Exclude<GameKey, "truth" | "bottle">, string[]> = {
  mime: [
    "Un pingouin qui découvre TikTok",
    "Quelqu’un qui marche sur des Lego",
    "Un influenceur qui perd le Wi-Fi",
    "Un chat qui essaie d’ouvrir une porte",
    "Ton ami le plus en retard du groupe",
  ],
  who: [
    "Qui de nous partirait vivre à l’étranger sur un coup de tête ?",
    "Qui de nous répond le moins vite aux messages ?",
    "Qui de nous deviendra millionnaire en premier ?",
    "Qui de nous serait le pire colocataire ?",
    "Qui de nous a le meilleur poker face ?",
  ],
  flash: [
    "Fais rire tout le groupe en 30 secondes.",
    "Trouve 5 chansons avec un prénom dans le titre.",
    "Fais 10 squats en racontant une histoire romantique.",
    "Parle avec un accent inventé jusqu’à ton prochain tour.",
    "Cite 8 marques en 15 secondes. Le groupe compte !",
  ],
  dark: [
    "Quelle qualité te fait immédiatement craquer chez quelqu’un ?",
    "Raconte ton rendez-vous le plus gênant — sans changer les détails.",
    "Fais ton regard de séduction le plus exagéré pendant 10 secondes.",
    "Qui dans le groupe aurait le plus de succès dans une émission de dating ?",
    "Décris ton rendez-vous parfait en seulement trois mots.",
    "Choisis une personne consentante et murmure-lui ton meilleur compliment.",
    "Quelle chanson mettrait instantanément une ambiance romantique ?",
    "Laisse le groupe inventer ta bio d’application de rencontre.",
  ],
};

const defaultPlayers = ["Lina", "Yanis", "Chloé", "Sam"];

export default function Home() {
  const [players, setPlayers] = useState(defaultPlayers);
  const [newPlayer, setNewPlayer] = useState("");
  const [activeGame, setActiveGame] = useState<GameKey | null>(null);
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(18);
  const [bottleTarget, setBottleTarget] = useState<string | null>(null);
  const [bottleChallenge, setBottleChallenge] = useState("");
  const [showPremium, setShowPremium] = useState(false);
  const [truthChoice, setTruthChoice] = useState<"truth" | "dare" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("after-players");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("after-players", JSON.stringify(players));
  }, [players]);

  const currentPlayer = players[round % players.length] || "Joueur";
  const prompt = useMemo(() => {
    if (!activeGame || activeGame === "bottle") return "";
    if (activeGame === "truth") {
      if (!truthChoice) return "";
      const selected = truthChoice === "truth" ? truthPrompts : darePrompts;
      return selected[round % selected.length];
    }
    return content[activeGame][round % content[activeGame].length];
  }, [activeGame, round, truthChoice]);

  function addPlayer() {
    const clean = newPlayer.trim();
    if (!clean || players.length >= 12) return;
    setPlayers([...players, clean]);
    setNewPlayer("");
  }

  function openGame(id: GameKey) {
    if (id === "truth") setTruthChoice(null);
    if (id === "bottle") {
      setBottleTarget(null);
      setBottleChallenge("");
    }
    setRound(Math.floor(Math.random() * 5));
    setActiveGame(id);
  }

  function nextPrompt() {
    setRound((value) => value + 1);
    if (activeGame === "truth") setTruthChoice(null);
  }

  function spinBottle() {
    if (spinning) return;
    setBottleTarget(null);
    setSpinning(true);
    setRotation((value) => value + 1260 + Math.floor(Math.random() * 720));
    window.setTimeout(() => {
      const target = players[Math.floor(Math.random() * players.length)] || "Joueur";
      const challenge = bottleChallenges[Math.floor(Math.random() * bottleChallenges.length)];
      setBottleTarget(target);
      setBottleChallenge(challenge);
      setSpinning(false);
      setRound((value) => value + 1);
    }, 2200);
  }

  return (
    <main className="app-shell">
      <div className="noise" />
      <header className="topbar">
        <button className="brand" onClick={() => setActiveGame(null)} aria-label="Retour à l'accueil">
          <span>AFTER</span><i>!</i>
        </button>
        <div className="top-actions">
          <button className="test-pill" onClick={() => setShowPremium(true)}>
            <span className="live-dot" /> MODE TEST · 6 JEUX DÉBLOQUÉS
          </button>
          <button className="avatar-stack" onClick={() => setStarted(false)} aria-label="Modifier les joueurs">
            {players.slice(0, 3).map((player, index) => (
              <span key={player} style={{ zIndex: 3 - index }}>{player[0].toUpperCase()}</span>
            ))}
            <b>{players.length}</b>
          </button>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow"><span /> LA SOIRÉE COMMENCE ICI</p>
        <h1>POSE TON<br /><em>TÉLÉPHONE.</em><br />JOUE POUR DE VRAI.</h1>
        <div className="hero-side">
          <p>6 jeux. Zéro préparation.<br />Des souvenirs que votre groupe<br />ne pourra pas effacer.</p>
          <button className="primary-cta" onClick={() => setStarted(false)}>
            <span>PRÉPARER LA PARTIE</span><b>→</b>
          </button>
        </div>
        <div className="scribble">ce soir<br />ça part !</div>
      </section>

      <section className="games-section" id="games">
        <div className="section-heading">
          <h2>CHOISIS TON CHAOS</h2>
          <p>UNE SEULE RÈGLE : NE PAS SE DÉFILER.</p>
        </div>
        <div className="game-grid">
          {games.map((game) => (
            <button key={game.id} className={`game-card ${game.tone} ${game.premium ? "premium-game" : ""}`} onClick={() => openGame(game.id)}>
              <span className="game-number">{game.number}</span>
              {game.premium && <span className="premium-badge">PREMIUM · 18+</span>}
              <span className="game-icon">{game.icon}</span>
              <strong>{game.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</strong>
              <small>{game.subtitle}</small>
              <i>{game.premium ? "TESTER" : "JOUER"} <b>→</b></i>
            </button>
          ))}
        </div>
      </section>

      <section className="trial-banner">
        <div>
          <span className="trial-kicker">TA PREMIÈRE SOIRÉE</span>
          <strong>EST POUR NOUS.</strong>
        </div>
        <p>Teste les 6 jeux sans limite. Ensuite, débloque<br />AFTER! pour toutes vos prochaines soirées.</p>
        <button onClick={() => setShowPremium(true)}>VOIR L’ACCÈS PREMIUM <span>↗</span></button>
      </section>

      <footer>
        <span>AFTER! © 2026</span>
        <p>FAIT POUR LES AMIS, PAS POUR LES ALGORITHMES.</p>
        <span>FR · 18+</span>
      </footer>

      {!started && (
        <div className="overlay onboarding">
          <div className="setup-card">
            <button className="close" onClick={() => setStarted(true)} aria-label="Fermer">×</button>
            <span className="step">AVANT DE METTRE LE FEU</span>
            <h2>QUI JOUE<br />CE SOIR ?</h2>
            <p>Ajoute de 2 à 12 joueurs. On s’occupe du reste.</p>
            <div className="player-list">
              {players.map((player, index) => (
                <button key={`${player}-${index}`} onClick={() => setPlayers(players.filter((_, i) => i !== index))}>
                  <span>{player[0].toUpperCase()}</span>{player}<b>×</b>
                </button>
              ))}
            </div>
            <div className="add-player">
              <input
                value={newPlayer}
                onChange={(event) => setNewPlayer(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addPlayer()}
                placeholder="Prénom du joueur"
                maxLength={14}
              />
              <button onClick={addPlayer}>+</button>
            </div>
            <button className="launch" disabled={players.length < 2} onClick={() => setStarted(true)}>
              C’EST PARTI <span>→</span>
            </button>
            <small>MODE TEST · AUCUN PAIEMENT NE SERA DEMANDÉ</small>
          </div>
        </div>
      )}

      {activeGame && (
        <div className="overlay game-overlay">
          <div className={`play-card ${games.find((game) => game.id === activeGame)?.tone}`}>
            <button className="close" onClick={() => setActiveGame(null)} aria-label="Fermer">×</button>
            <div className="round-meta">
              <span>{games.find((game) => game.id === activeGame)?.title.replace("\n", " ")}</span>
              <b>TOUR {round + 1}</b>
            </div>
            {activeGame === "bottle" ? (
              <div className="bottle-game">
                <p>POSE LE TÉLÉPHONE AU CENTRE</p>
                <div className="bottle-zone">
                  <div className="bottle" style={{ transform: `rotate(${rotation}deg)` }}>➜</div>
                </div>
                {bottleTarget ? (
                  <div className="bottle-result">
                    <small>LA BOUTEILLE A CHOISI</small>
                    <h3>{bottleTarget.toUpperCase()} !</h3>
                    <p>{bottleChallenge}</p>
                    <button className="game-action" onClick={() => setBottleTarget(null)}>DÉFI FAIT · RELANCER <span>→</span></button>
                  </div>
                ) : (
                  <>
                    <h3>{spinning ? "ÇA TOURNE..." : "QUI SERA LA PROCHAINE VICTIME ?"}</h3>
                    <button className="game-action" onClick={spinBottle} disabled={spinning}>
                      {spinning ? "ATTENDS..." : "TOURNER LA BOUTEILLE"} <span>↻</span>
                    </button>
                  </>
                )}
              </div>
            ) : activeGame === "truth" && !truthChoice ? (
              <div className="truth-choice">
                <p>C’EST À <strong>{currentPlayer.toUpperCase()}</strong></p>
                <h3>ALORS,<br />TU CHOISIS QUOI ?</h3>
                <div>
                  <button className="truth-button" onClick={() => setTruthChoice("truth")}>
                    <span>✦</span><strong>VÉRITÉ</strong><small>ON VEUT TOUT SAVOIR.</small>
                  </button>
                  <button className="dare-button" onClick={() => setTruthChoice("dare")}>
                    <span>ϟ</span><strong>GAGE</strong><small>PROUVE QUE TU ASSUMES.</small>
                  </button>
                </div>
              </div>
            ) : (
              <div className="prompt-game">
                <p>
                  C’EST À <strong>{currentPlayer.toUpperCase()}</strong>
                  {activeGame === "truth" && <i className="choice-label">{truthChoice === "truth" ? "VÉRITÉ" : "GAGE"}</i>}
                </p>
                <div className="prompt">{prompt}</div>
                <div className="prompt-actions">
                  <button className="skip" onClick={nextPrompt}>PASSER</button>
                  <button className="game-action" onClick={nextPrompt}>FAIT ! <span>→</span></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showPremium && (
        <div className="overlay premium-overlay">
          <div className="premium-card">
            <button className="close" onClick={() => setShowPremium(false)} aria-label="Fermer">×</button>
            <span className="step">APRÈS LA SOIRÉE OFFERTE</span>
            <h2>GARDE LE<br /><em>CHAOS.</em></h2>
            <p>Les six jeux, y compris After Dark, sont exceptionnellement ouverts pendant toute la phase de test.</p>
            <div className="price-options">
              <button><small>POUR CE SOIR</small><strong>PASS SOIRÉE</strong><b>3,99 €</b></button>
              <button className="popular"><i>LE PLUS RENTABLE</i><small>POUR TOUJOURS</small><strong>AFTER! À VIE</strong><b>14,99 €</b></button>
            </div>
            <button className="launch" onClick={() => setShowPremium(false)}>CONTINUER AVEC LES 6 JEUX <span>→</span></button>
            <small>AFTER DARK EST OUVERT · AUCUN PAIEMENT ACTIF DANS CETTE VERSION</small>
          </div>
        </div>
      )}
    </main>
  );
}
