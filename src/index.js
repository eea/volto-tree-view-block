import installTreeViewBlock from './components/Blocks/TreeView';
import installFlatListBlock from './components/Blocks/FlatList';
const applyConfig = (config) => {
  return [installTreeViewBlock, installFlatListBlock].reduce(
    (acc, apply) => apply(acc),
    config,
  );
};

export default applyConfig;
