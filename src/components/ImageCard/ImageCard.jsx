import css from "./ImageCard.module.css";

export default function ImageCard({ urls, description, onOpen }) {
  return (
    <div className={css.card}>
      <img
        className={css.image}
        onClick={() => onOpen(urls.regular)}
        src={urls.small}
        alt={description}
      />
    </div>
  );
}