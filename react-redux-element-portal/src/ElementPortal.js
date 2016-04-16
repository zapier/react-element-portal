import { createElementPortal } from 'react-element-portal';
import { Provider } from 'react-redux';

const ElementPortal = createElementPortal(Provider, 'store');

export default ElementPortal;
