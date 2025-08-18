import installTreeViewBlock from './components/Blocks/TreeView';

const applyConfig = (config) => {
  return [installTreeViewBlock].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
