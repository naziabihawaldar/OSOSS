import VueRouter from 'vue-router';


let routes = [
	{
		path: '/',
		name: 'login',
		component: require('./components/Login').default,
		meta: {
			forGuests: true
		}
	},
	{
		path: '/users',
		name: 'users',
		component: require('./components/Users').default,

	},
	{
		path: '/companies',
		name: 'companies',
		component: require('./components/Companies').default,

	}
];

export default new VueRouter({
	mode: 'history',
	routes
});
