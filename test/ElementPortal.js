import test from 'ava';
import React from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';

import 'babel-core/register';

import uniqueId from './helpers/uniqueId';
import ElementPortal from '../src/ElementPortal';
// This is copied from 'react-redux-element-portal', via npm pretest script.
import ReduxElementPortal from './helpers/ReduxElementPortal';

test('can render to ElementPortal using element id', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal id={headerId}>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
});

test('can render to ElementPortal using selector', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting"></li>
      <li class="greeting"></li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting">
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  elements.forEach(liNode => {
    t.is(liNode.textContent, 'Hello');
  });
});

test('can render to ElementPortal using selector with custom component', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const appId = uniqueId();
  node.innerHTML = `
    <ul>
      <li class="greeting">Joe</li>
      <li class="greeting">Mary</li>
    </ul>
    <div id="${appId}">
    </div>
  `;
  const Greeting = ({domNode}) => (<div>Hello {domNode.textContent}</div>);
  render(
    <div>
      <ElementPortal selector="li.greeting" view={Greeting}/>
    </div>,
    document.getElementById(appId)
  );
  const elements = [].slice.call(node.querySelectorAll('li.greeting'));
  t.is(elements[0].textContent, 'Hello Joe');
  t.is(elements[1].textContent, 'Hello Mary');
});

test('erases classes and styles', t => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}" class="foo" style="color:red">
    </div>
    <div id="${appId}">
    </div>
  `;
  t.is(document.getElementById(headerId).classList.length, 1);
  t.is(document.getElementById(headerId).getAttribute('style'), 'color:red');
  const Greeting = () => (<div>Hello</div>);
  render(
    <div>
      <ElementPortal id={headerId} shouldReset>
        <Greeting/>
      </ElementPortal>
    </div>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, 'Hello');
  t.is(document.getElementById(headerId).classList.length, 0);
  t.is(document.getElementById(headerId).getAttribute('style'), null);
});

// react-redux-element-portal
test('use react-redux-element-portal', t => {
  const store = createStore((state = 0, action) => {
    if (action && action.type === 'INC') {
      return state + 1;
    }
    return state;
  });
  const node = document.createElement('div');
  document.body.appendChild(node);
  const headerId = uniqueId();
  const appId = uniqueId();
  node.innerHTML = `
    <div id="${headerId}">
    </div>
    <div id="${appId}">
    </div>
  `;
  const Count = ({state}) => (<div>{state}</div>);
  const CountContainer = connect(
    state => ({state})
  )(Count);
  render(
    <Provider store={store}>
      <div>
        <ReduxElementPortal id={headerId}>
          <CountContainer/>
        </ReduxElementPortal>
      </div>
    </Provider>,
    document.getElementById(appId)
  );
  t.is(document.getElementById(headerId).textContent, '0');
  store.dispatch({type: 'INC'});
  t.is(document.getElementById(headerId).textContent, '1');
});
