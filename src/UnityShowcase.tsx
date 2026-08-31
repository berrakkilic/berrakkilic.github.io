import { useRef, useState } from "react";
import exploration from "./assets/unity/map.gif";
import characterInteraction from "./assets/unity/potion.gif";
import wayfinding from "./assets/unity/breadcrumb.gif";
import combat from "./assets/unity/fight.gif";

export const unityCover = exploration;

type HighlightId = "exploration" | "character-interaction" | "wayfinding" | "combat";

// The supplied .gif attachments contain single-frame PNG data.
// Keep these real stills until the original animated files are available.
// To enable a GIF: import it from ./assets/unity/ and assign that import below.
// The gallery then shows Play / Stop controls automatically. Nothing autoplays.
const animations: Record<HighlightId, string | undefined> = {
  exploration: undefined,
  "character-interaction": undefined,
  wayfinding: undefined,
  combat: undefined,
};

const highlights = [
  {
    id: "exploration",
    label: "Exploration",
    title: "Exploring the village in first person",
    description:
      "Streets, buildings and an open gazebo make up the space players move through. Interaction, back and hint prompts stay visible while the player explores the environment.",
    image: exploration,
    alt: "First-person view down a village street, with a pavilion on the left, buildings on the right and mountains in the distance.",
    width: 1149,
    height: 557,
  },
  {
    id: "character-interaction",
    label: "Character interaction",
    title: "Bringing characters and objects into the interaction flow",
    description:
      "An NPC encounter takes place at the market table full of potions, illustrating the project's selection and manipulation mechanisms. On-screen prompts expose the available interaction options.",
    image: characterInteraction,
    alt: "A red-haired character stands beside a table with coloured potions and wooden barrels; interaction prompts appear in the upper-left corner.",
    width: 1152,
    height: 648,
  },
  {
    id: "wayfinding",
    label: "Wayfinding",
    title: "Making the route part of the world",
    description:
      "Musical-note markers create a breadcrumb trail through the village. The cue connects navigation with the game's musical theme.",
    image: wayfinding,
    alt: "Musical-note markers form a visible trail along the village ground, viewed from the player's first-person perspective.",
    width: 1116,
    height: 612,
  },
  {
    id: "combat",
    label: "Combat feedback",
    title: "Pairing aiming with visible health feedback",
    description:
      "A crossbow encounter combines a central aiming reticle with heart-shaped health indicators above the turtle-like enemy. Shooting and health feedback were among the areas discussed during playtesting.",
    image: combat,
    alt: "A crossbow points towards a spiked turtle-like enemy, with an aiming reticle and five heart-shaped health indicators above it.",
    width: 1116,
    height: 618,
  },
] as const;

type Highlight = (typeof highlights)[number];

function HighlightMedia({ highlight }: { highlight: Highlight }) {
  const [playing, setPlaying] = useState(false);
  const [animationFailed, setAnimationFailed] = useState(false);
  const animation = animations[highlight.id];
  const showingAnimation = playing && !!animation && !animationFailed;

  return (
    <figure className="unity-highlight">
      <div className="unity-highlight__media">
        <img
          key={showingAnimation ? "animation" : "still"}
          src={showingAnimation ? animation : highlight.image}
          alt={highlight.alt}
          width={highlight.width}
          height={highlight.height}
          loading="lazy"
          decoding="async"
          onError={showingAnimation ? () => { setPlaying(false); setAnimationFailed(true); } : undefined}
        />
      </div>
      <figcaption>
        <div className="unity-highlight__actions">
          <span className="unity-highlight__label">{showingAnimation ? "Animated highlight" : "Project highlight"}</span>
          {animation && !animationFailed && (
            <button
              type="button"
              className="unity-playback-button"
              aria-pressed={playing}
              aria-label={`${playing ? "Stop" : "Play"} ${highlight.label.toLowerCase()} animation`}
              onClick={() => setPlaying(!playing)}
            >
              <span aria-hidden="true">{playing ? "■" : "▶"}</span>
              {playing ? "Stop animation" : "Play animation"}
            </button>
          )}
        </div>
        {animationFailed && <p role="status">The animation could not load. The project still is shown instead.</p>}
        <h4>{highlight.title}</h4>
        <p>{highlight.description}</p>
        <a href={highlight.image} target="_blank" rel="noopener noreferrer">
          Open full-size still <span aria-hidden="true">↗</span>
          <span className="portfolio-sr-only"> (opens in a new tab)</span>
        </a>
      </figcaption>
    </figure>
  );
}

export default function UnityShowcase() {
  const [activeHighlight, setActiveHighlight] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTab = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % highlights.length; break;
      case "ArrowLeft": next = (index - 1 + highlights.length) % highlights.length; break;
      case "Home": next = 0; break;
      case "End": next = highlights.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActiveHighlight(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="unity-case-study" aria-labelledby="unity-highlights-heading">
      <p className="unity-case-study__eyebrow">Inside The Bard’s Flute</p>
      <h3 id="unity-highlights-heading">Selected project highlights</h3>
      <p className="unity-case-study__intro">
        These are selected highlights of our group project, not an exhaustive
        overview of all its functions. They offer a closer look at exploration,
        character interaction, wayfinding and combat feedback.
      </p>

      <div className="unity-screen-tabs" role="tablist" aria-label="The Bard’s Flute project highlights">
        {highlights.map((highlight, index) => (
          <button
            key={highlight.id}
            type="button"
            ref={(element) => { tabRefs.current[index] = element; }}
            id={`unity-tab-${highlight.id}`}
            role="tab"
            aria-selected={activeHighlight === index}
            aria-controls={`unity-panel-${highlight.id}`}
            tabIndex={activeHighlight === index ? 0 : -1}
            onClick={() => setActiveHighlight(index)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            {highlight.label}
          </button>
        ))}
      </div>

      {highlights.map((highlight, index) => (
        <div
          key={highlight.id}
          className="unity-highlight-panel"
          id={`unity-panel-${highlight.id}`}
          role="tabpanel"
          aria-labelledby={`unity-tab-${highlight.id}`}
          tabIndex={0}
          hidden={activeHighlight !== index}
        >
          {/* Unmount inactive media, so changing tabs stops any playing GIF. */}
          {activeHighlight === index && <HighlightMedia key={highlight.id} highlight={highlight} />}
        </div>
      ))}
    </section>
  );
}
