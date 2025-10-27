// store/slices/templateSlice.js
import { deepClone, generateUniqueIds } from '../storeUtils';
import { getTemplateById } from '../../templates';
import { ensureResponsiveProperty } from '@/utils/responsiveUtils';
import toast from 'react-hot-toast';
import { initialLayout } from '@/utils/constants';

let nextParentId = 1;
let nextBoxId = 1;
let nextElementId = 1;

export const createTemplateSlice = (set, get) => ({
  templateName: '',
  setTemplateName: (templateName) => set({ templateName }),
  loadTemplate: (templateId) => {
    const decodedTemplateId = decodeURIComponent(templateId);
    let template = getTemplateById(decodedTemplateId);
    if (!template) {
      const savedTemplates = JSON.parse(
        localStorage.getItem('savedTemplates') || '{}'
      );
      if (savedTemplates[decodedTemplateId]) {
        template = savedTemplates[decodedTemplateId];
      } else {
        console.error('Template not found:', decodedTemplateId);
        toast.error('Template not found!');
        return;
      }
    }
    const { layouts } = get();
    const newLayouts = {};
    let maxParentId = 0;
    let maxBoxId = 0;
    let maxElementId = 0;
    let layoutsToProcess;
    if (template.layouts) {
      layoutsToProcess = template.layouts;
    } else {
      layoutsToProcess = {};
      const screenSizes = Object.keys(get().layouts);
      screenSizes.forEach((screen) => {
        layoutsToProcess[screen] = { parents: deepClone(template.parents) };
      });
    }
    Object.keys(layoutsToProcess).forEach((screen) => {
      const templateCopy = deepClone(layoutsToProcess[screen]);
      const { parents: processedParents, nextIds } = generateUniqueIds(
        templateCopy,
        {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId,
        }
      );
      newLayouts[screen] = { parents: processedParents };
      processedParents.forEach((parent) => {
        maxParentId = Math.max(maxParentId, parent.id);
        if (parent.size) {
          if (parent.size.background) {
            parent.size.background = ensureResponsiveProperty(
              parent.size.background
            );
          }
          if (parent.size.height) {
            parent.size.height = ensureResponsiveProperty(parent.size.height);
          }
        }
        parent.rnds.forEach((rnd) => {
          maxBoxId = Math.max(maxBoxId, rnd.id);
          rnd.elements.forEach((element) => {
            maxElementId = Math.max(maxElementId, element.id);
          });
        });
      });
      nextParentId = nextIds.parentId;
      nextBoxId = nextIds.boxId;
      nextElementId = nextIds.elementId;
    });
    set({
      layouts: newLayouts,
      parents: newLayouts[get().screenSize].parents,
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
    });
    toast.success(`Template '${templateId}' loaded successfully!`);
  },
  createNewTemplate: () => {
    nextParentId = 1;
    nextBoxId = 1;
    nextElementId = 1;
    const newParentId = nextParentId++;
    const newTemplate = {
      parents: [
        {
          id: newParentId,
          size: { height: 400, background: '#ffffff' },
          rnds: [],
        },
      ],
    };
    const newLayouts = {};
    Object.keys(get().layouts).forEach((screen) => {
      newLayouts[screen] = deepClone(newTemplate);
    });
    set({
      layouts: newLayouts,
      parents: newTemplate.parents,
      selectedParentId: newParentId,
      selectedBoxId: null,
      selectedElementId: null,
    });
    toast.success('New empty template created!');
  },
  resetToDefault: () => {
    nextParentId = 1;
    nextBoxId = 1;
    nextElementId = 1;
    const newLayouts = {};
    Object.keys(get().layouts).forEach((screen) => {
      newLayouts[screen] = deepClone(initialLayout);
    });
    set({
      layouts: newLayouts,
      parents: initialLayout.parents,
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
    });
    toast.success('Canvas has been reset to default!');
  },
  exportData: () => {
    const { layouts } = get();
    const data = {
      layouts,
      version: '1.0.0',
      exportDate: new Date().toISOString(),
    };
    toast.success('Data exported successfully!');
    return data;
  },
  importData: (data) => {
    if (!data || !data.layouts) {
      console.error('Invalid import data');
      toast.error('Invalid import data!');
      return;
    }
    const newLayouts = {};
    let maxParentId = 0;
    let maxBoxId = 0;
    let maxElementId = 0;
    Object.keys(data.layouts).forEach((screen) => {
      const { parents: processedParents, nextIds } = generateUniqueIds(
        data.layouts[screen],
        {
          parentId: nextParentId,
          boxId: nextBoxId,
          elementId: nextElementId,
        }
      );
      newLayouts[screen] = { parents: processedParents };
      processedParents.forEach((parent) => {
        maxParentId = Math.max(maxParentId, parent.id);
        parent.rnds.forEach((rnd) => {
          maxBoxId = Math.max(maxBoxId, rnd.id);
          rnd.elements.forEach((element) => {
            maxElementId = Math.max(maxElementId, element.id);
          });
        });
      });
      nextParentId = nextIds.parentId;
      nextBoxId = nextIds.boxId;
      nextElementId = nextIds.elementId;
    });
    set({
      layouts: newLayouts,
      parents: newLayouts[get().screenSize].parents,
      selectedParentId: null,
      selectedBoxId: null,
      selectedElementId: null,
    });
    toast.success('Data imported successfully!');
  },
});
