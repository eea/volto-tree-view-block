import listSVG from '@plone/volto/icons/list-arrows.svg';
import FlatListBlockView from './View';
import FlatListBlockEdit from './Edit';
const configFilters = (config) => {
  config.blocks.blocksConfig.flatListBlock = {
    id: 'flatListBlock',
    title: 'Flat List Block',
    icon: listSVG,
    group: 'eprtr_blocks',
    view: FlatListBlockView,
    edit: FlatListBlockEdit,
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
