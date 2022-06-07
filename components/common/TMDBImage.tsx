import { useMemo } from "react";
import { NextPage } from "next";
import Image, { ImageProps } from "next/image";

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/";

type Props = ImageProps & TMDBImageProps;

type TMDBImageProps = {
  srcSize?: string;
  blurSize?: string;
};

const TMDBImage: NextPage<Props> = (props) => {
  const srcSize = useMemo(() => {
    return props.srcSize || "/original/";
  }, [props.srcSize]);

  const blurSize = useMemo(() => {
    return props.blurSize || "/original/";
  }, [props.blurSize]);

  const blurDataURL = useMemo(() => {
    const url = props.blurDataURL;

    if (url) {
      const preUrl = (url.startsWith("http") ? "" : BASE_IMAGE_URL) + blurSize;
      return preUrl + url;
    }

    return undefined;
  }, [props.blurDataURL, blurSize]);

  const imageProps = useMemo(() => {
    const copiedProps = { ...props };
    delete copiedProps.srcSize;
    delete copiedProps.blurSize;
    return copiedProps;
  }, [props]);

  return (
    <Image
      alt="image"
      placeholder="blur"
      {...imageProps}
      src={BASE_IMAGE_URL + srcSize + props.src}
      blurDataURL={blurDataURL}
    />
  );
};

export default TMDBImage;
