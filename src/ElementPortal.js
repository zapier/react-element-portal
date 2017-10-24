import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';

const { slice } = Array.prototype;

const noop = () => {};

const ElementPortal = createReactClass({
  propTypes: {
    selector: PropTypes.string,
    component: PropTypes.func,
    mapNodeToProps: PropTypes.func,
    resetStyle: PropTypes.bool
  },

  componentDidMount() {
    this.renderToNodes();
  },

  componentDidUpdate() {
    this.renderToNodes();
  },

  renderToNodes() {
    const nodes = this.props.selector
      ? slice.call(document.querySelectorAll(this.props.selector))
      : null;

    if (nodes) {
      nodes.forEach(this.renderNode);
    }
  },

  renderNode(node) {
    const mapNodeToProps = this.props.mapNodeToProps || noop;

    if (this.props.resetStyle) {
      node.removeAttribute('class');
      node.removeAttribute('style');
    }

    const children = this.props.component
      ? React.createElement(this.props.component, mapNodeToProps(node))
      : React.Children.only(this.props.children);

    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      children,
      node
    );
  },

  render() {
    return null;
  }
});

export default ElementPortal;
