/* template: https://gitlab.multimedia.hs-augsburg.de/kowa/wk_account_express_01 */

import { Validator } from 'express-json-validator-middleware'

const { validate } = new Validator({ format: 'full' })

export default validate
