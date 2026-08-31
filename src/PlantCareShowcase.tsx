import { useRef, useState } from "react";
import storyboard from "./assets/plant-care/storyboard.png";
import myGarden from "./assets/plant-care/my-garden.png";
import careTasks from "./assets/plant-care/care-tasks.png";
import identification from "./assets/plant-care/identification.png";
import identificationFeedback from "./assets/plant-care/identification-feedback.png";
import encyclopedia from "./assets/plant-care/encyclopedia.png";

export { default as plantCareCover } from "./assets/plant-care/leafy-cover.png";

const screens = [
  {
    id: "garden",
    label: "My Garden",
    title: "A personal garden, connected to practical care information",
    description:
      "The garden overview leads into individual plant profiles. These bring together watering, light, humidity, temperature and health information, with space for personal notes.",
    image: myGarden,
    alt: "Three app screens showing My Garden and a Monstera profile with care guidance and a notes area.",
  },
  {
    id: "tasks",
    label: "Care tasks",
    title: "Turning care guidance into daily actions",
    description:
      "My Tasks groups plant-care activities by day. Colour-coded cards, task icons and completion controls distinguish watering, cleaning leaves, fertilising and repotting; the garden screen also signals pending tasks.",
    image: careTasks,
    alt: "My Garden with a task notification, followed by two My Tasks screens with daily care activities and completion checkmarks.",
  },
  {
    id: "identification",
    label: "Identification",
    title: "Guidance before taking the photo",
    description:
      "The plant-identification interface uses a framing guide and a short instruction to help users position a plant. A changing frame colour provides visual feedback during capture.",
    image: identification,
    alt: "Two plant-identification camera screens showing a framing guide around a plant, first in a light colour and then in green.",
  },
  {
    id: "feedback",
    label: "Feedback",
    title: "Clear next steps, including when identification fails",
    description:
      "The flow includes scanning, success and failure states. If a plant cannot be recognised, users can try again or add it manually. After a successful identification, they can add the plant or explore its encyclopedia entry.",
    image: identificationFeedback,
    alt: "Three camera screens showing scanning in progress, an identification failure with retry and manual-entry options, and success with add and encyclopedia options.",
  },
  {
    id: "encyclopedia",
    label: "Encyclopedia",
    title: "Discover plants and keep useful finds close",
    description:
      "Explore offers plant-type, season and indoor/outdoor filters alongside search. A separate Favourites view keeps saved plants together, so users can return to information that interests them.",
    image: encyclopedia,
    alt: "Explore with plant-type, season and indoor/outdoor filters, beside a Favourites screen listing saved plants.",
  },
] as const;

export default function PlantCareShowcase() {
  const [activeScreen, setActiveScreen] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTab = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % screens.length; break;
      case "ArrowLeft": next = (index - 1 + screens.length) % screens.length; break;
      case "Home": next = 0; break;
      case "End": next = screens.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setActiveScreen(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="plant-case-study">
      <section aria-labelledby="plant-storyboard-heading">
        <p className="plant-case-study__eyebrow">From structure to screens</p>
        <h3 id="plant-storyboard-heading">Storyboard &amp; navigation</h3>
        <p className="plant-case-study__intro">
          The early storyboard maps how the garden connects to plant profiles,
          care reminders, identification and the encyclopedia. It also sketches
          the social, profile and settings areas beyond the screens selected below.
        </p>
        <figure className="plant-figure">
          <a
            className="plant-figure__image-link"
            href={storyboard}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the storyboard at full size in a new tab"
          >
            <img
              src={storyboard}
              alt="Hand-drawn storyboard connecting nine views: plant information, plant profile, home, task reminders, encyclopedia, plant identification, social feed, user profile and settings."
              width="1104"
              height="829"
              loading="lazy"
              decoding="async"
            />
          </a>
          <figcaption>
            <p>Early sketches showing the relationships between the app's main areas.</p>
            <a href={storyboard} target="_blank" rel="noopener noreferrer">
              Open full-size storyboard <span aria-hidden="true">↗</span>
              <span className="portfolio-sr-only"> (opens in a new tab)</span>
            </a>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="plant-screens-heading">
        <p className="plant-case-study__eyebrow">A closer look</p>
        <h3 id="plant-screens-heading">Selected app screens</h3>
        <p className="plant-case-study__intro">
          A selection from the project presentation, covering everyday care,
          plant identification and discovery. Open any image at full size to inspect the details.
        </p>

        <div className="plant-screen-tabs" role="tablist" aria-label="Plant care app screens">
          {screens.map((screen, index) => (
            <button
              key={screen.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`plant-tab-${screen.id}`}
              role="tab"
              aria-selected={activeScreen === index}
              aria-controls={`plant-panel-${screen.id}`}
              tabIndex={activeScreen === index ? 0 : -1}
              onClick={() => setActiveScreen(index)}
              onKeyDown={(event) => moveTab(event, index)}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {screens.map((screen, index) => (
          <div
            key={screen.id}
            className="plant-screen-panel"
            id={`plant-panel-${screen.id}`}
            role="tabpanel"
            aria-labelledby={`plant-tab-${screen.id}`}
            tabIndex={0}
            hidden={activeScreen !== index}
          >
            <figure className="plant-figure">
              <a
                className="plant-figure__image-link"
                href={screen.image}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${screen.label} at full size in a new tab`}
              >
                <img
                  src={screen.image}
                  alt={screen.alt}
                  width="1920"
                  height="1080"
                  loading="lazy"
                  decoding="async"
                />
              </a>
              <figcaption>
                <h4>{screen.title}</h4>
                <p>{screen.description}</p>
                <a href={screen.image} target="_blank" rel="noopener noreferrer">
                  Open full-size image <span aria-hidden="true">↗</span>
                  <span className="portfolio-sr-only"> (opens in a new tab)</span>
                </a>
              </figcaption>
            </figure>
          </div>
        ))}
      </section>

      <aside className="plant-figma-note" aria-label="Full Figma files">
        <h3>Want to explore more?</h3>
        <p>
          This is a selection of the application's screens, not an exhaustive
          overview. Please reach out to me if you want to see the full Figma files.
        </p>
      </aside>
    </div>
  );
}
