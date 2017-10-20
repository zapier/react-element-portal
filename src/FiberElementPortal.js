import ReactDOM from 'react-dom';

import propTypes from './utils/propTypes';
import renderToNodes from './utils/renderToNodes';

const FiberElementPortal = (props) => renderToNodes(props, (children, node) => (
  ReactDOM.createPortal(
    children,
    node
  )
));

FiberElementPortal.propTypes = propTypes;

export default FiberElementPortal;
