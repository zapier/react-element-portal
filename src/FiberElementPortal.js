import ReactDOM from 'react-dom';

import propTypes from './utils/propTypes';
import renderToNodes from './utils/renderToNodes';

/**
 * FiberElementPortal is compatible with React >= 16.
 */
const FiberElementPortal = (props) => renderToNodes(props, (children, node) => (
  ReactDOM.createPortal(
    children,
    node
  )
));

FiberElementPortal.propTypes = propTypes;

export default FiberElementPortal;
