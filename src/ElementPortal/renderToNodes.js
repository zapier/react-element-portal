import React from 'react';

const reDataAttr = /^data\-(.+)$/;

export const getNodeData = (node) => {
  // fallback
  if (!node.dataset) {
    const result = {};
    const attributes = node.attributes;
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i];
      const match = attr.name.match(reDataAttr);
      if (match) {
        const key = match[1];
        result[key] = attr.value;
      }
    }
    return result;
  }

  return Object.keys(node.dataset)
    .reduce((result, key) => {
      result[key] = node.dataset[key];
      return result;
    }, {});
};

const renderToNodes = (props, render) => {
  const nodeById = props.id && document.getElementById(props.id);
  const nodesById = nodeById ? [nodeById] : [];
  const nodesBySelector = (props.selector && [].slice.call(document.querySelectorAll(props.selector))) || [];
  const nodes = nodesById.concat(nodesBySelector);

  return nodes.map(node => {
    if (props.shouldReset) {
      node.className = '';
      node.removeAttribute('style');
    }

    const View = props.view;

    const children = View ?
      <View domNode={node} data={getNodeData(node)}/> :
      React.Children.only(props.children);

    return render(children, node);
  });
};

export default renderToNodes;
