import { Component } from 'react';
import ReactDOM from 'react-dom';

import propTypes from './utils/propTypes';
import renderToNodes from './utils/renderToNodes';

class LegacyElementPortal extends Component {
  static propTypes = propTypes;

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
