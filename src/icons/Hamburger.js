const Hamburger = ({ onClick }) => (
  <svg
    onClick={onClick}
    width="24"
    height="24"
    viewBox="0 0 24 17"
    fill="black"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.172974"
      width="20"
      height="3"
      rx="1.5"
      fill="var(--color-tone-1)"
    ></rect>
    <rect
      x="0.172974"
      y="7"
      width="20"
      height="3"
      rx="1.5"
      fill="var(--color-tone-1)"
    ></rect>
    <rect
      x="0.172974"
      y="14"
      width="20"
      height="3"
      rx="1.5"
      fill="var(--color-tone-1)"
    ></rect>
  </svg>
);

export default Hamburger;
