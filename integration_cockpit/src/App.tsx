import { Admin, Resource, ListGuesser } from 'react-admin';
import MessageList from "./components/MessageList";
import Dashboard from "./components/Dashboard/Dashboard";
import { theme } from "./theme";
import drfProvider from 'ra-data-django-rest-framework';
import httpClient from './common/httpClient';
import { GenericCreateForm, GenericEditForm } from './forms/GenericForm';
import { CableSharp, ConnectWithoutContact, DoorFrontRounded, People, Route, TypeSpecimen } from '@mui/icons-material';


const authProvider = {
  login: ({ username, password }: any) => {
    const token = btoa(`${username}:${password}`);
    localStorage.setItem('token', token);
    return Promise.resolve();
  },
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () => localStorage.getItem('token') ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.resolve(),
};


const dataProvider = drfProvider("http://localhost:8000/api", httpClient);

const App = () => (
  <Admin dataProvider={dataProvider}
    authProvider={authProvider}
    dashboard={Dashboard}
    title="Cockpit"
    theme={theme}
  >
    <Resource name="messages" list={MessageList} />

    <Resource
      name="transaction_types"
      icon={TypeSpecimen}
      list={ListGuesser}
      create={(props) => (
        <GenericCreateForm {...props} fields={[
          { name: 'code' },
          { name: 'description' }
        ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props} fields={[
          { name: 'code' },
          { name: 'description' }
        ]}
        />
      )} />

    <Resource
      name="partners"
      icon={People}
      list={ListGuesser}
      create={(props) => (
        <GenericCreateForm {...props} fields={[
          { name: 'name' }
        ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props} fields={[
          { name: 'name' }
        ]}
        />
      )} />

    <Resource
      name="routes"
      list={ListGuesser}
      icon={Route}
      create={(props) => (
        <GenericCreateForm {...props} fields={[
          { name: 'code' },
          { name: 'settings', type: "json" }
        ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props} fields={[
          { name: 'code' },
          { name: 'settings', type: "json" }
        ]}
        />
      )} />

    <Resource
      name="integrations"
      list={ListGuesser}
      icon={CableSharp}
      create={(props) => (
        <GenericCreateForm {...props}
          fields={[
            { name: 'name' },
          ]}
          referencedFields={[
            {
              name: 'source',
              reference: 'partners',
              referenceFieldToRender: 'name',
            },
            {
              name: 'target',
              reference: 'partners',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props}
          fields={[
            { name: 'name' },
          ]}
          referencedFields={[
            {
              name: 'source',
              reference: 'partners',
              referenceFieldToRender: 'name',
            },
            {
              name: 'target',
              reference: 'partners',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )} />

    <Resource
      name="connections"
      list={ListGuesser}
      icon={ConnectWithoutContact}
      create={(props) => (
        <GenericCreateForm {...props}
          fields={[
            { name: 'name' },
            { name: 'settings', type: "json" },
            { name: 'protocol' },
          ]}
          referencedFields={[
            {
              name: 'owner',
              reference: 'partners',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props}
          fields={[
            { name: 'name' },
            { name: 'settings', type: "json" },
            { name: 'protocol' },
          ]}
          referencedFields={[
            {
              name: 'owner',
              reference: 'partners',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )} />

    <Resource
      name="gateways"
      list={ListGuesser}
      icon={DoorFrontRounded}
      create={(props) => (
        <GenericCreateForm {...props}
          fields={[
            { name: 'name' },
            { name: 'settings', type: "json" },
            { name: 'protocol' },
          ]}
          referencedFields={[
            {
              name: 'connection',
              reference: 'connections',
              referenceFieldToRender: 'name',
            },
            {
              name: 'gateway_integration',
              reference: 'integrations',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )}
      edit={(props) => (
        <GenericEditForm {...props}
          fields={[
            { name: 'name' },
            { name: 'settings', type: "json" },
            { name: 'protocol' },
          ]}
          referencedFields={[
            {
              name: 'connection',
              reference: 'connections',
              referenceFieldToRender: 'name',
            },
            {
              name: 'gateway_integration',
              reference: 'integrations',
              referenceFieldToRender: 'name',
            }
          ]}
        />
      )} />

  </Admin>
);

export default App;