const providerSchema = {
  title: 'Provider',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['name', 'url'],
    },
  ],
  properties: {
    name: {
      title: 'Provider name',
    },
    url: {
      title: 'Provider url',
      widget: 'object_by_path',
    },
  },
  required: [],
};
const schema = {
  title: 'Tree View Block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['providers', 'extraPath'],
    },
  ],
  properties: {
    extraPath: {
      title: 'Path of items in the tree',
      description: 'The path to the items in the tree structure',
    },
    providers: {
      title: 'Providers',
      schema: providerSchema,
      widget: 'object_list',
    },
  },
  required: [],
};

export default schema;
