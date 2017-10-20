import ReactDOM from 'react-dom';
import FiberElementPortal from './FiberElementPortal';
import LegacyElementPortal from './LegacyElementPortal';

const hasNativePortal = 'createPortal' in ReactDOM;
export default hasNativePortal ? FiberElementPortal : LegacyElementPortal;
