import PropTypes from 'prop-types';

const propTypes = {
  id: PropTypes.string,
  selector: PropTypes.string,
  // Remove styles and classes from node.
  shouldReset: PropTypes.bool,
  view: PropTypes.func
};

export default propTypes;
