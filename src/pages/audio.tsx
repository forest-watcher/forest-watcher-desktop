import { useParams } from "react-router-dom";

export type TParams = {
  audioUrl: string;
};

const PlayAudioPage = () => {
  const { audioUrl } = useParams<TParams>();

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio />
    </div>
  );
};
