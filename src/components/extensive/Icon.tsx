import { useEffect, useState } from "react";
import SVG from "react-inlinesvg";

export type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

const Icon = ({ name, size = 24, className }: IconProps): JSX.Element => {
  const [path, setPath] = useState<string>();

  // Imports the SVG
  useEffect(() => {
    const importIcon = async () => {
      setPath((await import(`../../assets/images/icons/${name}.svg`)).default);
    };
    importIcon();
    // eslint-disable-next-line
  }, [name]);

  return <SVG src={path ?? ""} height={size} width={size} className={className} />;
};

export default Icon;
