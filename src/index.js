import installTreeViewBlock from '@eeacms/volto-tree-view-block/components/Blocks/TreeView';

const applyConfig = (config) => {
  return [installTreeViewBlock].reduce((acc, apply) => apply(acc), config);
};

export default applyConfig;
