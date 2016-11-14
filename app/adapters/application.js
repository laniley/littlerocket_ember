import DS from 'ember-data';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend(DataAdapterMixin, {
    host: ENV.backend_url,
    namespace: ENV.backend_namespace,
    authorizer: 'authorizer:token',
});
