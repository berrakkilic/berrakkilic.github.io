import { useRef, useState } from "react";
import mapAndInitiative from "./assets/humblewood/map-and-initiative.webp";
import characterAwareDice from "./assets/humblewood/character-aware-dice.webp";
import campaignAlmanac from "./assets/humblewood/campaign-almanac.webp";

export { default as humblewoodCover } from "./assets/humblewood-cover-v4.webp";

const featureGroups = [
  {
    eyebrow: "Shared table",
    title: "Tools for running a live session",
    description:
      "The main tabletop brings battle maps, movable tokens, fog, measurements, initiative and synced audio into one session view.",
    features: ["Map and token controls", "Initiative and round tracking", "Shared jukebox playback"],
  },
  {
    eyebrow: "Character play",
    title: "Actions grounded in each character",
    description:
      "Character sheets connect stats, inventory and notes to checks, saves, attacks and spell rolls, with modifiers and advantage handled in the same flow.",
    features: ["5e-style character sheets", "Character-aware dice rolls", "Long-rest and level-up helpers"],
  },
  {
    eyebrow: "Campaign structure",
    title: "Knowledge, access and persistence",
    description:
      "A campaign almanac keeps reference material organised, while separate player and Dungeon Master access protects private controls and character ownership.",
    features: ["Searchable campaign almanac", "Role-aware permissions", "SQLite and Docker deployment"],
  },
] as const;

const interfaceViews = [
  {
    id: "live-session",
    label: "Live session",
    title: "Running the shared table from one workspace",
    description:
      "The Dungeon Master view keeps the battle map central while map controls, fog tools, tokens and turn order remain visible around it. Players can be added to initiative directly or roll from their own character data.",
    image: mapAndInitiative,
    alt: "Dungeon Master view of The Humblewood Table showing a gridded battle map with character tokens, map controls, fog-of-war tools and a turn-order panel.",
    width: 2048,
    height: 1098,
    creditNote: true,
  },
  {
    id: "dice",
    label: "Character dice",
    title: "Turning character data into ready-to-use actions",
    description:
      "Selecting a character exposes the relevant initiative, attacks, ability checks, saving throws and skills. The correct modifiers are attached automatically, reducing lookup work during play.",
    image: characterAwareDice,
    alt: "Dice interface showing a selected character and buttons for initiative, attacks, ability checks, saving throws and skills with automatic modifiers.",
    width: 2048,
    height: 1090,
    creditNote: false,
  },
  {
    id: "almanac",
    label: "Almanac",
    title: "Making campaign knowledge easy to browse",
    description:
      "The searchable Almanac organises places, people, traditions, species and magic into expandable groups. It gives players a calm reference space without crowding the live tabletop.",
    image: campaignAlmanac,
    alt: "The Humble Almanac interface with a search field and expandable categories for places, traditions, people and other campaign information.",
    width: 2048,
    height: 1097,
    creditNote: false,
  },
] as const;

export default function HumblewoodShowcase() {
  const [activeView, setActiveView] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTab = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % interfaceViews.length; break;
      case "ArrowLeft": next = (index - 1 + interfaceViews.length) % interfaceViews.length; break;
      case "Home": next = 0; break;
      case "End": next = interfaceViews.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActiveView(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="humblewood-case-study" aria-labelledby="humblewood-highlights-heading">
      <p className="humblewood-case-study__eyebrow">Inside The Humblewood Table</p>
      <h3 id="humblewood-highlights-heading">A tabletop designed around the whole session</h3>
      <p className="humblewood-case-study__intro">
        These are selected highlights rather than an exhaustive list of the
        platform&apos;s functions. Together, they show how session play, character
        management and campaign reference material connect in one product.
      </p>

      <div className="humblewood-feature-grid">
        {featureGroups.map((group, index) => (
          <article key={group.title} className="humblewood-feature-card">
            <div className="humblewood-feature-card__number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </div>
            <p className="humblewood-feature-card__eyebrow">{group.eyebrow}</p>
            <h4>{group.title}</h4>
            <p>{group.description}</p>
            <ul>
              {group.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <section className="humblewood-interface" aria-labelledby="humblewood-interface-heading">
        <p className="humblewood-case-study__eyebrow">Selected interface views</p>
        <h3 id="humblewood-interface-heading">From live play to campaign reference</h3>
        <p className="humblewood-case-study__intro">
          Three views show how the interface supports the session itself, automates
          character actions and keeps campaign knowledge accessible between turns.
        </p>

        <div className="humblewood-screen-tabs" role="tablist" aria-label="Humblewood Table interface views">
          {interfaceViews.map((view, index) => (
            <button
              key={view.id}
              type="button"
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`humblewood-tab-${view.id}`}
              role="tab"
              aria-selected={activeView === index}
              aria-controls={`humblewood-panel-${view.id}`}
              tabIndex={activeView === index ? 0 : -1}
              onClick={() => setActiveView(index)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              {view.label}
            </button>
          ))}
        </div>

        {interfaceViews.map((view, index) => (
          <div
            key={view.id}
            className="humblewood-screen-panel"
            id={`humblewood-panel-${view.id}`}
            role="tabpanel"
            aria-labelledby={`humblewood-tab-${view.id}`}
            tabIndex={0}
            hidden={activeView !== index}
          >
            {activeView === index && (
              <figure className="humblewood-interface-figure">
                <a href={view.image} target="_blank" rel="noopener noreferrer" className="humblewood-interface-figure__image-link">
                  <img
                    src={view.image}
                    alt={view.alt}
                    width={view.width}
                    height={view.height}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                <figcaption>
                  <p className="humblewood-feature-card__eyebrow">Project highlight</p>
                  <h4>{view.title}</h4>
                  <p>{view.description}</p>
                  {view.creditNote && (
                    <p className="humblewood-asset-note">
                      Interface and interaction design shown here are my work; the
                      battle-map and token artwork are third-party campaign assets.
                    </p>
                  )}
                  <a href={view.image} target="_blank" rel="noopener noreferrer">
                    Open full-size view <span aria-hidden="true">↗</span>
                    <span className="portfolio-sr-only"> (opens in a new tab)</span>
                  </a>
                </figcaption>
              </figure>
            )}
          </div>
        ))}
      </section>

      <aside className="humblewood-more-note" aria-labelledby="humblewood-more-heading">
        <h3 id="humblewood-more-heading">Want to see more?</h3>
        <p>
          This overview focuses on the project&apos;s main systems, not every function.
          Please reach out if you&apos;d like a closer look at the interface or a guided
          walkthrough of The Humblewood Table.
        </p>
      </aside>
    </section>
  );
}
