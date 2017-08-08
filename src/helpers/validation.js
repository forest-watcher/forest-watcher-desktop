import { required, url, urlTile } from '../constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required, url, urlTile });

export { validation };
