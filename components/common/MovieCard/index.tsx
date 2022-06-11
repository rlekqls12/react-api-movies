import { NextPage } from "next";
import TMDBImage from "../TMDBImage";
import styles from "./MovieCard.module.scss";

type Props = {
  movie: Movie;
  onClickCard?: Function;
  onClickGenrePill?: Function;
};

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  score: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres: { id: number; text: string }[];
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
};

const MovieCard: NextPage<Props> = ({
  movie,
  onClickCard = () => {},
  onClickGenrePill = () => {},
}) => {
  return (
    <div
      key={movie.id}
      className={styles.movie__wrap}
      onClick={() => onClickCard(movie)}
    >
      <div className={styles.movie__poster}>
        <TMDBImage
          layout="fill"
          placeholder="blur"
          srcSize="w400"
          blurSize="w200"
          alt={movie.title}
          src={movie.poster_path}
          blurDataURL={movie.poster_path}
        />
      </div>
      <div className={styles.movie__detail}>
        <div className={styles.movie__score}>{movie.score}</div>
        <div className={styles.movie__title}>{movie.title}</div>
        <div className={styles.movie__date}>{movie.release_date}</div>
        <div className={styles.movie__genre}>
          {movie.genres.map((genre) => (
            <span
              key={genre.id}
              className={styles.movie__pill}
              onClick={() => onClickGenrePill(genre.id)}
            >
              {genre.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
