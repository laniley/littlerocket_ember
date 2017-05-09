
export function initialize( application ) {

	application.inject('component', 'store', 'service:store');
	application.inject('component', 'router', 'router:main');

	application.inject('service:game-scenes-service', 'gameState', 'service:game-state-service');
	application.inject('service:game-loop-service', 'gameState', 'service:game-state-service');
}

export default {
	name: 'injector',
	initialize:initialize
};
