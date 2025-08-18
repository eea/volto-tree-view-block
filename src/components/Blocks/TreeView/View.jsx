/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { connectToMultipleProvidersUnfiltered } from '@eeacms/volto-datablocks/hocs';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import {
  UncontrolledTreeEnvironment,
  Tree,
  StaticTreeDataProvider,
} from 'react-complex-tree';
import './treeView.less';
import 'react-complex-tree/lib/style-modern.css';

function getParentIds(items, targetId) {
  const parents = [];
  let currentId = targetId;

  while (true) {
    const scopeCurrentId = currentId;
    const parentEntry = Object.entries(items).find(([_, item]) =>
      item?.children?.some(
        (child) => child.toLowerCase() === scopeCurrentId.toLowerCase(),
      ),
    );
    if (!parentEntry) break;
    const parentId = parentEntry[0];
    parents.push(parentId);
    currentId = parentId;
  }

  return parents;
}
function getShortId(id) {
  const tt2 = id.split('_');
  const shortId = tt2[1] || id;
  return shortId;
}

function formatLine(key) {
  let fullLabel;
  let id;
  if (key.includes('$')) {
    const tt = key.split('$');
    id = tt[0];
    const shortId = getShortId(id);
    const name = key.substring(key.indexOf('-') + 1);
    fullLabel = `${shortId} - ${name}`;
  } else {
    id = key.split('-')[0];
    const name = key.substring(key.indexOf('-') + 1);
    fullLabel = name;
  }

  const parts = [];
  let buffer = '';
  let inItalics = false;

  for (const char of fullLabel) {
    if (char === '[') {
      if (buffer) {
        parts.push(inItalics ? <i key={parts.length}>{buffer}</i> : buffer);
        buffer = '';
      }
      inItalics = true;
    } else if (char === ']') {
      if (buffer) {
        parts.push(<i key={parts.length}>{buffer}</i>);
        buffer = '';
      }
      inItalics = false;
    } else {
      buffer += char;
    }
  }
  if (buffer) {
    parts.push(inItalics ? <i key={parts.length}>{buffer}</i> : buffer);
  }

  return (
    <a
      href={`https://biodiversity.europa.eu/habitats/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {parts}
    </a>
  );
}

function buildTree(array) {
  const items = {
    root: {
      index: 'root',
      canMove: false,
      isFolder: true,
      children: [],
      data: '',
      canRename: false,
    },
  };

  array.forEach((path) => {
    const parts = path.split('|');
    let parentId = 'root';

    parts.forEach((part, idx) => {
      const codeBeforeDollar = part.split('$')[0];
      const nodeId = codeBeforeDollar;
      const isFolder = idx < parts.length - 1;
      if (!items[getShortId(nodeId)]) {
        items[getShortId(nodeId)] = {
          index: getShortId(nodeId),
          canMove: true,
          isFolder,
          children: [],
          data: formatLine(part),
          canRename: true,
        };
      }

      if (!items[parentId].children.includes(getShortId(nodeId))) {
        items[parentId].children.push(getShortId(nodeId));
      }

      parentId = getShortId(nodeId);
    });
  });

  return items;
}

const View = ({
  data,
  providers_data,
  query,
  dispatch,
  location,
  history,
  ...props
}) => {
  const [treeStructure, setTreeStructure] = useState();
  const searchParams = new URLSearchParams(location.search);
  useEffect(() => {
    if (providers_data[Object.keys(providers_data)[0]]) {
      const data = providers_data[Object.keys(providers_data)[0]];
      const arrayOfPaths = data['habitat_type_tree'];
      if (arrayOfPaths) {
        const builtTree = buildTree(arrayOfPaths);
        const expandedParam = searchParams.get('expanded');
        const targetIds = expandedParam
          ? expandedParam.split(',').filter(Boolean) // removes empty strings from ",,"
          : [];
        const parents = targetIds.flatMap((id) => getParentIds(builtTree, id));
        setTreeStructure({
          builtTree,
          expandedItems: new Set(parents),
        });
      }
    }
  }, [providers_data]);
  return (
    <div>
      {treeStructure && (
        <UncontrolledTreeEnvironment
          dataProvider={
            new StaticTreeDataProvider(
              treeStructure.builtTree,
              (item, data) => ({
                ...item,
                data,
              }),
            )
          }
          getItemTitle={(item) => item.data}
          viewState={{
            'tree-1': {
              expandedItems: Array.from(treeStructure.expandedItems),
            },
          }}
        >
          <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example" />
        </UncontrolledTreeEnvironment>
      )}
    </div>
  );
};

export default compose(
  withRouter,
  connectToMultipleProvidersUnfiltered((props) => ({
    providers: props.data.providers,
  })),
)(View);
