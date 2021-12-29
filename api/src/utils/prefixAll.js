export default (allRoutes, prefix) =>
  allRoutes.map((routes) => {
    routes.prefix('/' + prefix);
    return routes;
  });
