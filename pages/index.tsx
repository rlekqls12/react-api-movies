import { useMemo } from "react";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import cx from "classnames";
import styles from "@/styles/Home.module.scss";
import API from "@/utils/api";
import TMDBImage from "@/components/common/TMDBImage";

type Props = {
  serverData: ServerData;
};

type ServerData = {
  genres: Genre[];
  movie: MovieBoard;
};

type Genre = {
  id: number;
  name: string;
};

type MovieBoard = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
};

const Home: NextPage<Props> = ({ serverData }) => {
  const router = useRouter();
  console.log("ServerData :", serverData);
  console.log("Router :", router);

  const GenresElement = useMemo(() => {
    return serverData.genres.map((genre) => (
      <Link key={genre.id} href={"/?genre=" + genre.id}>
        <a
          className={cx({
            [styles.focus]: router.query?.genre === genre.id.toString(),
          })}
        >
          {genre.name}
        </a>
      </Link>
    ));
  }, [router.query?.genre, serverData.genres]);

  const MovieList = useMemo(() => {
    const movies = serverData.movie.results;
    return movies.map((movie) => (
      <div key={movie.id} className={styles.movie__wrap}>
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
          <div className={styles.movie__score}>
            <span>{movie.vote_average}</span>
          </div>
        </div>
        <div className={styles.movie__detail}>
          <div className={styles.movie__title}>{movie.title}</div>
          <div className={styles.movie__date}>{movie.release_date}</div>
        </div>
      </div>
    ));
  }, [serverData.movie]);

  // TODO: MovieList가 표시되면 Nav가 가려짐

  return (
    <>
      <header className={styles.header__wrap}>
        <span className={styles.title}>Movies</span>
      </header>
      <nav className={styles.navigator}>
        <div className={styles.nav__wrap}>{GenresElement}</div>
      </nav>
      <section className={styles.section}>
        <div className={styles.section__wrap}>
          <div className={styles.movie__list}>{MovieList}</div>
        </div>
      </section>
    </>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const query = context.query;
  const serverData: ServerData = {
    genres: [],
    movie: {
      page: 1,
      results: [],
      total_pages: 1,
      total_results: 0,
    },
  };

  try {
    const res = await API.get("/list/genre/item");
    serverData.genres = res.data.genres;
  } catch {}

  try {
    const genre = query.genre || serverData.genres?.[0].id || 28;
    const res = await API.get("/list/genre/movie/" + genre);
    const data: MovieBoard = res.data;
    data.results.forEach((movie: Movie) => {
      movie.release_date = movie.release_date.replace(/-/g, ". ");
    });
    serverData.movie = data;
  } catch {}

  return {
    props: { serverData },
  };
}

export default Home;
