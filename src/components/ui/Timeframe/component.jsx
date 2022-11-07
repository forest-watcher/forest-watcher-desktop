/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import ChevronIcon from "assets/images/icons/ChevronRightSmall.svg";
import { useIntl } from "react-intl";
import get from "lodash.get";

import useTimeline from "./hook";

const DOT_SIZE = 24;

const TimeSlider = ({
  dotSize = DOT_SIZE,
  selected,
  periods = [],
  onChange,
  labelGetter = "label",
  yearGetter = "year"
}) => {
  const ref = useRef();
  const tileRefs = useRef([]);
  const [initialized, setInitialized] = useState(false);
  const [previousOffset, setPreviousOffset] = useState(null);
  const [timeline, offset, labels, setSelected, moveTimeline] = useTimeline(
    ref,
    tileRefs,
    periods,
    selected,
    dotSize,
    onChange
  );
  const intl = useIntl();

  const [styles, setAnim] = useSpring(() => ({
    from: { transform: `translateX(0px)` }
  }));

  useEffect(() => {
    if (offset !== null) {
      setAnim({
        transform: `translateX(${-Math.abs(offset)}px)`,
        immediate: !initialized || previousOffset === 0
      });
      setInitialized(true);
      setPreviousOffset(offset);
    }
  }, [offset, initialized, setAnim, previousOffset]);

  console.log({ selected });

  return (
    <>
      <section className="c-timeframe">
        <span className="c-timeframe__year-label c-timeframe__year-label--start">
          {get(periods[labels[0]], yearGetter)}
        </span>
        <span className="c-timeframe__year-label c-timeframe__year-label--end">
          {get(periods[labels[1]], yearGetter)}
        </span>
        <button
          className="c-timeframe__button c-timeframe__button--prev"
          style={{ width: `${timeline.buttonWidth}px` }}
          onClick={e => {
            e.preventDefault();
            moveTimeline("prev");
          }}
          aria-label={intl.formatMessage({ id: "common.previous" })}
        >
          <img src={ChevronIcon} alt="" role="presentation" />
        </button>
        <div ref={ref} className="c-timeframe__timeframe">
          <animated.ol
            style={{
              width: `${timeline.dataWidth}px`,
              height: "100%",
              position: "relative",
              zIndex: 2,
              ...styles
            }}
          >
            {periods.map((d, i) => (
              <li
                key={i}
                ref={el => {
                  tileRefs.current[i] = el;
                }}
                data-index={i}
                className="tile"
                style={{
                  width: `${timeline.tileWidth}px`
                }}
              >
                <span
                  label={d.label}
                  role="button"
                  tabIndex={0}
                  area-label="Select timeframe"
                  className={`c-timeframe__timeline-position ${
                    selected === i ? "c-timeframe__timeline-position--active" : ""
                  }`}
                  onClick={() => {
                    setSelected(i);
                  }}
                  style={{
                    width: `${dotSize}px`,
                    height: `${dotSize}px`
                  }}
                >
                  <span
                    className={`c-timeframe__label
                      ${i === 0 ? "c-timeframe__label--x-start" : ""}
                      ${i === periods.length - 1 ? "c-timeframe__label--x-end" : ""}`}
                  >
                    {get(d, labelGetter)}
                  </span>
                </span>
              </li>
            ))}
          </animated.ol>
          <span className="c-timeframe__line" />
        </div>
        <button
          className="c-timeframe__button c-timeframe__button--next"
          style={{ width: `${timeline.buttonWidth}px` }}
          onClick={e => {
            e.preventDefault();
            moveTimeline("next");
          }}
          aria-label={intl.formatMessage({ id: "common.next" })}
        >
          <img src={ChevronIcon} alt="" role="presentation" />
        </button>
      </section>
    </>
  );
};

TimeSlider.propTypes = {
  dotSize: PropTypes.number,
  selected: PropTypes.number,
  periods: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired
};

export default TimeSlider;
