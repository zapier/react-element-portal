import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';

const { push, slice } = Array.prototype;

const noop = () => {};

const toNodesArray = (x) => (
  x instanceof NodeList
    ? slice.call(x)
    : Array.isArray(x)
      ? x
      : x != null
        ? [x]
        : null
);

const ElementPortal = createReactClass({
  propTypes: {
    selector: PropTypes.string,
    nodes: PropTypes.oneOfType([
      PropTypes.instanceOf(HTMLElement),
      PropTypes.instanceOf(NodeList),
      PropTypes.arrayOf(PropTypes.instanceOf(HTMLElement))
    ]),
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
    const { nodes, selector } = this.props;
    const collectedNodes = [];

    push.apply(collectedNodes, toNodesArray(document.querySelectorAll(selector)));
    push.apply(collectedNodes, toNodesArray(nodes));

    if (collectedNodes.length) {
      collectedNodes.forEach(this.renderNode);
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
