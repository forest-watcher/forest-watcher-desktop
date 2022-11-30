import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import { HTMLAttributes, FC } from "react";
import DownIcon from "assets/images/icons/ChevronDown.svg";

interface IProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  text?: string;
  shouldCollapse?: boolean;
  icon?: string;
  iconName?: string;
}

const COLLAPSE_CHAR_LIMIT = 50;
const DetailCard: FC<IProps> = ({ title, text, shouldCollapse = false, className, icon, iconName }) => {
  const collapsable = shouldCollapse && text && text.length >= COLLAPSE_CHAR_LIMIT;

  return (
    <div
      className={classNames(className, "px-6 bg-neutral-400/40 border-2 border-neutral-400 border-solid rounded-md")}
    >
      <Disclosure>
        {({ open }) => (
          <div
            className={classNames(
              "flex gap-3 ",
              collapsable ? "items-start py-4" : "items-center py-7",
              !open && "max-h-[101px]"
            )}
          >
            <img
              src={icon}
              alt=""
              role="presentation"
              className={classNames("min-w-[48px]", collapsable && "relative top-[11px]")}
            />
            <div>
              <p className="uppercase font-medium text-sm font-fira text-neutral-700 leading-[14px] mb-3">{title}</p>
              <Disclosure.Panel
                static
                className={classNames(
                  "text-base leading-snug break-words first-letter:uppercase",
                  collapsable && !open && "line-clamp-2"
                )}
              >
                {text}
              </Disclosure.Panel>
            </div>
            {collapsable && (
              <Disclosure.Button className="min-w-[16px]">
                <img
                  src={DownIcon}
                  role="presentation"
                  alt=""
                  className="w-full"
                  style={{ transform: open ? "rotate(180deg)" : "" }}
                />
              </Disclosure.Button>
            )}
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default DetailCard;
