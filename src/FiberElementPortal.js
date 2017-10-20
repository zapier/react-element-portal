import ReactDOM from 'react-dom';

import getPropTypes from './utils/getPropTypes';
import renderToNodes from './utils/renderToNodes';

const ElementPortal = (props) => renderToNodes(props, (children, node) => (
  ReactDOM.createPortal(
    children,
    node
  )
));

ElementPortal.propTypes = getPropTypes();

export default ElementPortal;
