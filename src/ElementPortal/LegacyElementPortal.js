import { Component } from 'react';
import ReactDOM from 'react-dom';

import propTypes from './propTypes';
import renderToNodes from './renderToNodes';

/**
 * LegacyElementPortal is compatible with any version of React prior to 16.
 */
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
