import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import createReactClass from 'create-react-class';

const { slice } = Array.prototype;

const noop = () => {};

const ElementPortal = createReactClass({
  propTypes: {
    selector: PropTypes.string,
    mapDomNodeToProps: PropTypes.func,
    shouldReset: PropTypes.bool,
    component: PropTypes.func
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
    const mapDomNodeToProps = this.props.mapDomNodeToProps || noop;

    if (this.props.shouldReset) {
      node.className = '';
      node.removeAttribute('style');
    }

    const children = this.props.component
      ? React.createElement(this.props.component, mapDomNodeToProps(node))
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
