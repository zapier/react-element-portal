import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const noop = () => {};

const getNodes = (props) => {
  const nodeById = props.id && document.getElementById(props.id);
  const nodesById = nodeById ? [nodeById] : [];
  const nodesBySelector = (props.selector && [].slice.call(document.querySelectorAll(props.selector))) || [];

  return nodesById.concat(nodesBySelector);
};


class ElementPortal extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    selector: PropTypes.string,
    mapDomNodeToProps: PropTypes.func,
    // Remove styles and classes from node.
    shouldReset: PropTypes.bool,
    view: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
    };
    this.originalNodes = [];
  }

  componentDidMount() {
    getNodes(this.props).forEach(node => {
      const clone = node.cloneNode(false);
      this.originalNodes.push(node);

      node.parentNode.replaceChild(clone, node);
    });

    this.setState({
      mounted: true,
    });
  }

  componentWillUnmount() {
    getNodes(this.props).forEach(node => {
      const el = this.originalNodes.pop();

      node.parentNode.replaceChild(el, node);
    });
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }

    const nodes = getNodes(this.props);
    const mapDomNodeToProps = this.props.mapDomNodeToProps || noop;

    return nodes.map((node, i) => {
      if (this.props.shouldReset) {
        node.className = '';
        node.removeAttribute('style');
      }

      const View = this.props.view;

      const children = View ?
        <View {...mapDomNodeToProps(this.originalNodes[i])} /> :
        React.Children.only(this.props.children);

      return ReactDOM.createPortal(
        children,
        node
      );
    });
  }
}

export default ElementPortal;
