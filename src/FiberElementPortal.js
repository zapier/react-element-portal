import ReactDOM from 'react-dom';

import getPropTypes from './utils/getPropTypes';
import renderToNodes from './utils/renderToNodes';

const FiberElementPortal = (props) => renderToNodes(props, (children, node) => (
  ReactDOM.createPortal(
    children,
    node
  )
));

FiberElementPortal.propTypes = getPropTypes();

export default FiberElementPortal;
