import React from 'react';
import FiberElementPortal from './FiberElementPortal';
import LegacyElementPortal from './LegacyElementPortal';

const hasNativePortal = 'createPortal' in React;
export default hasNativePortal ? FiberElementPortal : LegacyElementPortal;
