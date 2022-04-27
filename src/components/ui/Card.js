import PropTypes from "prop-types";
import classnames from "classnames";
import Icon from "./Icon";

function Card({ className, children, title, fields, actions }) {
  return (
    <div className={classnames(["c-card", className])}>
      <div className="card-content">
        <h3 className="text -x-small-title">{title}</h3>
        {fields.map(field => (
          <p className="card-field" key={btoa(field)}>
            {field}
          </p>
        ))}
        {children}
      </div>
      <div className="card-actions">
        {actions.map((action, index) => (
          <button key={btoa(index + action.iconName)} className="card-action" onClick={action.callback}>
            <Icon className={classnames(["-small", action.color])} name={action.iconName} />
          </button>
        ))}
      </div>
    </div>
  );
}

Card.defaultProps = {
  fields: [],
  actions: []
};

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      iconName: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
      color: PropTypes.string
    })
  )
};

export default Card;
