import * as yup from 'yup'
import { TYPE_INPUT } from 'client/constants'
import { getValidationFromFields } from 'client/utils/helpers'

import { TAB_ID as ELASTICITY_ID, ELASTICITY_TAB_SCHEMA } from './elasticity'
import { TAB_ID as SCHEDULED_ID, SCHEDULED_TAB_SCHEMA } from './scheduled'

import { COOLDOWN } from './fields'

const MIN_VMS = {
  name: 'min_vms',
  label: 'Min. vms',
  type: TYPE_INPUT.TEXT,
  htmlType: 'number',
  tooltip: 'Minimum number of VMs for elasticity adjustments',
  validation: yup
    .number()
    .when(ELASTICITY_ID, (value, schema) => value?.length > 0
      ? schema.required('Minimum field is required')
      : schema.notRequired().nullable()
    )
    .transform(value => !isNaN(value) ? value : null)
    .default(undefined),
  grid: { sm: 4, md: 4 }
}

const MAX_VMS = {
  name: 'max_vms',
  label: 'Max. vms',
  type: TYPE_INPUT.TEXT,
  htmlType: 'number',
  tooltip: 'Maximum number of VMs for elasticity adjustments',
  validation: yup
    .number()
    .moreThan(yup.ref(MIN_VMS.name), 'Max. vms field must be greater than min vms')
    .when(ELASTICITY_ID, (value, schema) => value?.length > 0
      ? schema.required('Maximum field is required')
      : schema.notRequired().nullable()
    )
    .transform(value => !isNaN(value) ? value : null)
    .default(undefined),
  grid: { sm: 4, md: 4 }
}

export const POLICIES_FORM_FIELDS = [
  MIN_VMS,
  MAX_VMS,
  {
    ...COOLDOWN,
    tooltip: `
      Cooldown period duration after a scale operation, in seconds.
      If it is not set, the default set in oneflow-server.conf will be used
    `,
    grid: { sm: 4, md: 4 }
  }
]

export const POLICIES_SCHEMA = yup.object({
  ...getValidationFromFields(POLICIES_FORM_FIELDS),
  [ELASTICITY_ID]: ELASTICITY_TAB_SCHEMA,
  [SCHEDULED_ID]: SCHEDULED_TAB_SCHEMA
})
