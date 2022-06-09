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
  score: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genre_texts: string[];
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
        </div>
        <div className={styles.movie__detail}>
          <div className={styles.movie__score}>{movie.score}</div>
          <div className={styles.movie__title}>{movie.title}</div>
          <div className={styles.movie__date}>{movie.release_date}</div>
          <div className={styles.movie__genre}>
            {movie.genre_texts.map((text) => (
              <span key={text} className={styles.movie__pill}>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [serverData.movie]);

  // TODO: MovieList가 표시되면 Nav가 가려짐 (한 줄에 영화가 4개 이하가 되면 사라짐)
  // TODO: genre에서 id로 랜덤 색상 추출해서 pill에 배경색 넣기 (lux 조절해서 색감 너무 어둡거나 안 쨍하게 하기) (글자 색상도 배경에 맞춰서 블랙이나 화이트로 조절하기)

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
    /* 장르 목록 조회 */
    const res = await API.get("/list/genre/item");
    serverData.genres = res.data.genres;
  } catch {}

  try {
    /* 영화 목록 조회 */
    // query에서 장르 타입 가져오기 (기본 값 액션)
    const genre = query.genre || serverData.genres?.[0].id || 28;
    const res = await API.get("/list/genre/movie/" + genre);
    const data: MovieBoard = res.data;

    // 장르 id를 장르 문자열로 바꿔주는 오브젝트 생성 (ex 28 -> 액션)
    const idToGenre: { [key: string]: string } = {};
    const genres = serverData.genres || [];
    genres.forEach((genre) => {
      idToGenre[genre.id] = genre.name;
    });
    const isExistGenre = Boolean(genres.length);
    // 영화 목록에 추가적인 작업 진행
    // (날짜 형식 변경, 평점을 점수 형식으로 변경, 장르 id 목록을 문자열 목록으로 변경)
    data.results.forEach((movie: Movie) => {
      movie.release_date = movie.release_date.replace(/-/g, ". ");
      movie.score = movie.vote_average * 10;
      movie.genre_texts = [];
      if (isExistGenre) {
        movie.genre_texts = movie.genre_ids
          .map((id) => idToGenre[id])
          .filter(Boolean);
      }
    });
    serverData.movie = data;
  } catch {}

  return {
    props: { serverData },
  };
}

export default Home;
