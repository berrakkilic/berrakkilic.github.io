import "./TreePortrait.css";
import portraitUrl from "./assets/cv-soft.webp";

const leaves = [
  { label: "Portfolio", href: "#portfolio", position: "portfolio" },
  { label: "About", href: "#about", position: "about" },
  { label: "CV", href: "#cv", position: "cv" },
];

export default function TreePortrait({ colour }: { colour: string }) {
  return (
    <div className="tree-portrait" style={{ color: colour }}>
      <svg
        className="tree-portrait__tree"
        viewBox="0 0 680 800"
        preserveAspectRatio="none"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        {/* One flat colour, continuous with the projects section below. */}
        <path d="M 510 800 C 604 799 633 785 627 745 C 615 688 650 638 647 591 C 644 547 664 512 656 467 C 646 413 668 373 651 318 C 638 276 612 242 567 220 C 518 196 468 187 411 189 C 340 192 285 185 235 184 C 207 183 184 180 163 176 L 165 170 C 207 176 232 175 265 174 C 317 172 350 179 411 177 C 474 173 533 184 581 206 C 625 226 648 252 663 277 C 652 229 632 202 596 177 L 602 170 C 646 201 677 244 684 273 L 699 800 Z" />
        <path d="M 287 184 C 251 178 230 162 194 134 L 196 129 C 234 153 259 174 304 178 Z" />
        <path d="M 444 189 C 429 179 414 166 395 155 L 401 149 C 418 163 435 175 456 183 Z" />
        <path d="M 660 461 C 671 448 678 430 680 410 L 688 411 C 685 437 677 459 663 478 Z" />
        <path d="M 650 591 C 639 574 633 554 632 535 L 637 533 C 640 552 646 566 655 576 Z" />
        {/* Small leaves on the trunk; no veins or outlines. */}
        <path d="M 661 280 C 652 249 650 232 677 213 C 686 244 676 264 661 280 Z" />
        <path d="M 654 352 C 630 345 617 335 611 318 C 640 316 655 327 654 352 Z" />
        <path d="M 632 544 C 614 532 606 516 611 496 C 634 507 640 525 632 544 Z" />
        <path d="M 680 427 C 673 405 678 391 697 380 C 701 402 694 416 680 427 Z" />
        <path d="M 169 175 C 153 186 136 185 119 175 C 137 163 155 164 169 175 Z" />
      </svg>

      <nav
        id="tree-navigation"
        className="tree-portrait__navigation"
        aria-label="Portfolio sections"
      >
        {leaves.map((leaf) => (
          <a
            key={leaf.href}
            href={leaf.href}
            className={`tree-leaf tree-leaf--${leaf.position}`}
          >
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <path fill="currentColor" d="M 2 26 C 61 -1 125 -12 158 21 C 177 39 179 58 198 70 C 149 90 108 98 66 78 C 36 63 18 42 2 26 Z" />
            </svg>
            <span>{leaf.label}</span>
          </a>
        ))}
      </nav>

      <div className="portrait-swing">
        <div className="portrait-swing__cords" aria-hidden="true">
          <span />
          <span />
        </div>
        <figure className="portrait-swing__frame">
          <img
            src={portraitUrl}
            alt="Portrait of Berrak Kilic"
            width="1254"
            height="1254"
            decoding="async"
            fetchPriority="high"
          />
        </figure>
      </div>
    </div>
  );
}
