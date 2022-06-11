import { useCallback, useMemo } from "react";
import type { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";
import styles from "@/styles/Home.module.scss";
import API from "@/utils/api";
import MovieCard from "@/components/common/MovieCard";

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
  genres: { id: number; text: string }[];
  original_language: string;
  original_title: string;
  adult: boolean;
  video: boolean;
};

const Home: NextPage<Props> = ({ serverData }) => {
  const router = useRouter();
  console.log("ServerData :", serverData);
  console.log("Router :", router);

  // Functions

  const onClickGenrePill = useCallback(
    (genreId: number) => {
      router.push({
        query: {
          genre: genreId,
          page: 1,
        },
      });
    },
    [router]
  );

  // Elements

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
      <MovieCard
        key={movie.id}
        movie={movie}
        onClickGenrePill={onClickGenrePill}
      />
    ));
  }, [serverData.movie, onClickGenrePill]);

  // TODO: api configuration 참고해서 블러썸네일 사이즈 최적으로 맞추기
  // TODO: 페이지네이션 / 페이지당 개수
  // TODO: 정렬 및 검색 옵션

  return (
    <>
      <header className={styles.header__wrap}>
        <div className={styles.title}>Movies</div>
        <nav className={styles.navigator}>
          <div className={styles.nav__scroll_wrap}>
            <div className={styles.nav__genre__wrap}>{GenresElement}</div>
          </div>
        </nav>
      </header>
      <section className={styles.section}>
        <div className={styles.movie__list__wrap}>
          <div className={styles.movie__toolbar}>
            <div className={styles.movie__pagination}>
              &lt; 1 2 3 4 Pagination 5 6 7 8 &gt;
            </div>
          </div>
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
    // query에서 페이지 가져오기 (기본 값 1)
    const rawPage = Array.isArray(query.page) ? query.page?.[0] : query.page;
    const page = parseInt(rawPage || "1") || 1;

    const getMovies = async (page: number) => {
      const res = await API.get("/list/genre/movie/" + genre, {
        params: { page },
      });
      const data: MovieBoard = res.data;

      // 장르 id를 장르 문자열로 바꿔주는 오브젝트 생성 (ex 28 -> 액션)
      const genreIdToText: { [key: string]: string } = {};
      const genres = serverData.genres || [];
      genres.forEach((genre) => {
        genreIdToText[genre.id] = genre.name;
      });
      const isExistGenre = Boolean(genres.length);
      // 영화 목록에 추가적인 작업 진행
      // (날짜 형식 변경, 평점을 점수 형식으로 변경, 장르 id 목록을 문자열 목록으로 변경)
      data.results.forEach((movie: Movie) => {
        movie.release_date = movie.release_date.replace(/-/g, ". ");
        movie.score = movie.vote_average * 10;
        if (isExistGenre) {
          movie.genres = movie.genre_ids
            .map((id) => ({
              id: id,
              text: genreIdToText[id],
            }))
            .filter(Boolean);
        } else {
          movie.genres = [];
        }
      });

      return data;
    };

    const movie = await getMovies(page);
    // TODO: Multiple Page
    // const nextPageMovie = await getMovies(page + 1);
    // movie.results.push(...nextPageMovie.results);

    serverData.movie = movie;
  } catch {}

  return {
    props: { serverData },
  };
}

export default Home;
