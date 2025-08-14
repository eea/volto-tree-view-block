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

function findUnmatchedBrackets(text) {
  const stack = [];
  const unmatched = [];
  for (let i = 0; i < (text || '').length; i++) {
    const ch = text[i];
    if (ch === '[') stack.push(i);
    else if (ch === ']') {
      if (stack.length) stack.pop();
      else unmatched.push(i);
    }
  }
  return unmatched.concat(stack);
}

function cleanupBrackets(name = '') {
  const unmatched = findUnmatchedBrackets(name);
  if (unmatched.length > 0) {
    name = name.replace(']', '$').replace('[', ']').replace('$', '[');
    name = name.replace('- ', '- [');
    name = name.replace(' ]', '] ').replace('[ ', ' [').replace(/  +/g, ' ');
  }
  return name;
}

function formatLine(key) {
  const tt = key.split('$');
  const codeBeforeDollar = tt[0];
  const afterDollar = tt[1] || '';
  const tt2 = codeBeforeDollar.split('_');
  const shortCode = tt2[1] || codeBeforeDollar;

  // Combine code + cleaned label
  const fullLabel = `${shortCode}${cleanupBrackets(afterDollar)}`;

  // Parse into React nodes: text and <i> tags
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
      href={`https://biodiversity.europa.eu/habitats/${codeBeforeDollar}`}
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

      if (!items[nodeId]) {
        items[nodeId] = {
          index: nodeId,
          canMove: true,
          isFolder,
          children: [],
          data: formatLine(part),
          canRename: true,
        };
      }

      if (!items[parentId].children.includes(nodeId)) {
        items[parentId].children.push(nodeId);
      }

      parentId = nodeId;
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
  useEffect(() => {
    if (providers_data[Object.keys(providers_data)[0]]) {
      const data = providers_data[Object.keys(providers_data)[0]];
      const arrayOfPaths = data['habitat_type_tree'];
      if (arrayOfPaths) {
        setTreeStructure(buildTree(arrayOfPaths));
      }
    }
  }, [providers_data]);

  return (
    <div>
      {treeStructure && (
        <UncontrolledTreeEnvironment
          dataProvider={
            new StaticTreeDataProvider(treeStructure, (item, data) => ({
              ...item,
              data,
            }))
          }
          getItemTitle={(item) => item.data}
          viewState={{}}
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
