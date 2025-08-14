import worldSVG from '@plone/volto/icons/world.svg';
import TreeViewBlockView from './View';
import TreeViewBlockEdit from './Edit';
const configFilters = (config) => {
  config.blocks.blocksConfig.treeViewBlock = {
    id: 'treeViewBlock',
    title: 'Tree View Block',
    icon: worldSVG,
    group: 'eprtr_blocks',
    view: TreeViewBlockView,
    edit: TreeViewBlockEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};

export default configFilters;
