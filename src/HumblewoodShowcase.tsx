export { default as humblewoodCover } from "./assets/humblewood-cover.svg";

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

export default function HumblewoodShowcase() {
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
