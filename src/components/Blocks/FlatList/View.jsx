/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Container, Icon, Segment } from 'semantic-ui-react';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import './flatListView.less';

function getParentHabitatIds(arrayOfPaths) {
  const parents = [];
  const path = arrayOfPaths[0];
  const parts = path.split('|');
  parts.forEach((parentString) => {
    const [uniqueId, name] = parentString.split('-');
    parents.push(`${uniqueId}-${name}`);
  });

  return parents;
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
  const [parentHabitats, setParentHabitats] = useState([]);
  const { extraPath } = data;
  useEffect(() => {
    if (providers_data[Object.keys(providers_data)[0]]) {
      const providerData = providers_data[Object.keys(providers_data)[0]];
      const arrayOfPaths = providerData['habitat_type_tree'];

      if (Array.isArray(arrayOfPaths) && arrayOfPaths.length > 0) {
        const parents = getParentHabitatIds(arrayOfPaths);
        setParentHabitats(parents);
      }
    }
  }, [providers_data]);
  return (
    <div className="block flat-list-view-block">
      {parentHabitats.length > 0 ? (
        <Segment className="breadcrumbs" attached vertical>
          <Container>
            <Breadcrumb
              size="large"
              as="nav"
              aria-label={'Habitat Breadcrumbs'}
            >
              <ol aria-label="Habitat Breadcrumbs navigation">
                {parentHabitats.map((item, index) => {
                  const [id, itemName] = item.split('$');
                  const name = itemName?.trim();
                  const href = extraPath ? `${extraPath}/${id}` : '#';
                  const isLastItem = index === parentHabitats.length - 1;
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
