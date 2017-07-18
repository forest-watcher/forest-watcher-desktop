import { required, url } from '../constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required, url });

export { validation };
