import { deepClone } from '@/store/storeUtils';
import { SCREEN_ORDER } from './constants';

export const isResponsiveMap = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return SCREEN_ORDER.some((k) =>
    Object.prototype.hasOwnProperty.call(value, k)
  );
};

export const cascadeCopyParentsFromScreen = (
  parents,
  sourceScreen,
  mode = 'cascade'
) => {
  const clone = deepClone(parents);

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;

    Object.keys(node).forEach((key) => {
      const val = node[key];
      if (isResponsiveMap(val)) {
        const srcValue = val[sourceScreen];
        if (mode === 'force') {
          SCREEN_ORDER.forEach((size) => {
            node[key][size] = srcValue;
          });
        } else {
          node[key][sourceScreen] = srcValue;
          const startIdx = SCREEN_ORDER.indexOf(sourceScreen);
          if (startIdx !== 1) {
            for (let i = startIdx + 1; i < SCREEN_ORDER.length; i++) {
              const s = SCREEN_ORDER[i];
              if (node[key][s] !== undefined) {
                delete node[key][s];
              }
            }
          }
        }
      } else if (val && typeof val == 'object' && !Array.isArray(val)) {
        visit(val);
      }
    });
  };

  clone.forEach((parent) => {
    visit(parent);
    if (Array.isArray(parent.rnds)) {
      parent.rnds.forEach((rnd) => {
        visit(rnd);
        if (Array.isArray(rnd.elements)) {
          rnd.elements.forEach((el) => visit(el));
        }
      });
    }
  });
  return clone;
};

export const ensureResponsiveProperty = (value) => {
  if (typeof value === 'object' && value != null) {
    return value;
  }
  const responsiveValue = {};
  const screenSize = SCREEN_ORDER;
  screenSize.forEach((size) => {
    responsiveValue[size] = value;
  });
  return responsiveValue;
};
