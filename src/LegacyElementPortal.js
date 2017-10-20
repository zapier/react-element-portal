import ReactDOM from 'react-dom';

import getPropTypes from './utils/getPropTypes';
import renderToNodes from './utils/renderToNodes';

class LegacyElementPortal {
  static propTypes = getPropTypes();

  renderPortals() {
    renderToNodes(this.props, (children, node) => {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        children,
        node
      );
    });
  }

  componentDidMount() {
    this.renderPortals();
  }

  componentDidUpdate() {
    this.renderPortals();
  }

  render() {
    return null;
  }
}

export default LegacyElementPortal;
