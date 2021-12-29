import path from 'path';
import { Feature } from '../renderer';
import { getFolderContents, getRandom } from '../utils';
import { CENTER } from '../scene';

const locationsPath = 'assets/locations';

const getLocations = async () => {
  const locations = await getFolderContents(locationsPath);
  return locations.map((location) => path.resolve(locationsPath, location));
};

const createLocation = async () => {
  const locations = await getLocations();
  const location = getRandom(locations);
  const feature = new Feature(location);
  await feature.init();
  feature.setPosition(CENTER);

  return [feature];
};

export default createLocation;
