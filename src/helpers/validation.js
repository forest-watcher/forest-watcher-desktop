import { required } from '../constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required });

export { validation };
