import * as yup from 'yup';
import { validateUrl } from '../../utils/urlUtils';

export const organizationSchema = yup.object().shape({
  name: yup.string().required('Required Field'),
  prefix: yup.string().optional(),
  icon: yup
    .string()
    .test({
      message: 'Add valid image URL',
      test: value => validateUrl(value),
    })
    .optional(),
});
