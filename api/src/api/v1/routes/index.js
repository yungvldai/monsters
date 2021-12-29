import prefixAll from 'src/utils/prefixAll';

import { API_VERSION } from '../';

import common from './common';
import monsters from './monsters';
import files from './files';

export default prefixAll([common, monsters, files], API_VERSION);
