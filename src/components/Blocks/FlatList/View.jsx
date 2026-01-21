/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Container, Icon, Segment } from 'semantic-ui-react';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import './flatListView.less';

function getParentHabitatIds(arrayOfPaths, targetHabitatId) {
  const parentIds = [];

  for (const path of arrayOfPaths) {
    const parts = path.split('|');
    let foundTargetIndex = -1;

    for (let i = 0; i < parts.length; i++) {
      const habitatId = parts[i].split('$')[0];
      if (habitatId === targetHabitatId) {
        foundTargetIndex = i;
        break;
      }
    }

    if (foundTargetIndex !== -1) {
      for (let i = 0; i < foundTargetIndex; i++) {
        const parentString = parts[i];
        const parentId = parentString.split('$')[0];
        if (!parentIds.find((item) => item.split('$')[0] === parentId)) {
          parentIds.push(parentString);
        }
      }
      break;
    }
  }

  return parentIds;
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
  const [parentHabitatIds, setParentHabitatIds] = useState([]);
  const { extraPath } = data;
  useEffect(() => {
    if (providers_data[Object.keys(providers_data)[0]]) {
      const providerData = providers_data[Object.keys(providers_data)[0]];
      const arrayOfPaths = providerData['habitat_type_tree'];
      const habitatUniqueId = props.content?.data_query?.[0]?.v[0];

      if (arrayOfPaths && habitatUniqueId) {
        const parents = getParentHabitatIds(arrayOfPaths, habitatUniqueId);
        setParentHabitatIds(parents);
      }
    }
  }, [providers_data]);
  return (
    <div className="block flat-list-view-block">
      {parentHabitatIds.length > 0 ? (
        <Segment className="breadcrumbs" attached vertical>
          <Container>
            <Breadcrumb size="big" as="nav" aria-label={'Habitat Breadcrumbs'}>
              <ol aria-label="Habitat Breadcrumbs navigation">
                {parentHabitatIds.map((item, index) => {
                  const name = item.substring(item.indexOf('-') + 1).trim();
                  const id = item.split('$')[0];
                  const href = extraPath ? `${extraPath}/${id}` : '#';
                  const isLastItem = index === parentHabitatIds.length - 1;

                  return (
                    <li key={index}>
                      {index > 0 && (
                        <Breadcrumb.Divider>
                          <Icon
                            size="large"
                            className="ri-arrow-right-s-line"
                          />
                        </Breadcrumb.Divider>
                      )}
                      {!isLastItem ? (
                        <Link to={href} className="section">
                          {name}
                        </Link>
                      ) : (
                        <Breadcrumb.Section active={isLastItem}>
                          {name}
                        </Breadcrumb.Section>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Breadcrumb>
          </Container>
        </Segment>
      ) : (
        ''
      )}
    </div>
  );
};

export default compose(
  withRouter,
  connectToMultipleProviders((props) => ({
    providers: props.data.providers,
    has_data_query_by_context: true,
  })),
)(View);
