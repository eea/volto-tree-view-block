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

function formatLine(key) {
  let fullLabel;
  let id;
  if (key.includes('$')) {
    const tt = key.split('$');
    id = tt[0];
    const tt2 = id.split('_');
    const shortId = tt2[1] || id;
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
        // setTreeStructure(buildTree(["254098 - Chromista (Kingdom)|254100 - Foraminifera (Phylum)|254137 - Polythalamea (Class)|254194 - Buliminida (Order)"]))
        // setTreeStructure(buildTree(["EUNIS2012_A$AA - Marine habitats|test_A1$A1A1 - Littoral rock and other hard substrata|asd_A1.1$A1.1A1.1 - High energy littoral rock|EUNIS2012_A1.11$A1.11 - Mussel and/or barnacle communities"]));
        // setTreeStructure(buildTree(["1 - Inland|2 - Terrestrial|3 - Snow "]))
        // setTreeStructure(buildTree(["EUNIS2012_E$EE - Grasslands and lands dominated by forbs, mosses or lichens|EUNIS2012_E1$E1E1 - Dry grasslands|EUNIS2012_E1.7$E1.7E1.7 - Closed non-Mediterranean dry acid and neutral grassland|EUNIS2012_E1.72$E1.72E1.72 - [Agrostis] - [Festuca] grassland|EUNIS2012_E1.722$E1.722 - Boreo-arctic [Agrostis]-[Festuca] grasslands"]))
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
