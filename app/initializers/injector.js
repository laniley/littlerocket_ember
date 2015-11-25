export function initialize( container, application ) {
  application.inject('component', 'store', 'service:store');
}

export default {
  name: 'injector',
  initialize:initialize
};
