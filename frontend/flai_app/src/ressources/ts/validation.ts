import { Ref } from 'vue'
import { ExpressData, JoiData, PostgresData } from './interfaces'

export const baseValidation = (
  result: ExpressData,
  errorMessages: Ref<string[]>,
  successCallback: () => void
) => {
  errorMessages.value = []
  if (result.status === 200) {
    successCallback()
  } else {
    errorMessages.value.push('Ein Netzwerkfehler ist aufgetreten.')
  }
}

export const profileValidation = (
  result: ExpressData,
  errorMessages: Ref<string[]>,
  validation: { username: boolean; password: boolean; email: boolean },
  successCallback: () => void
) => {
  type ValidationKey = keyof typeof validation
  for (const el in validation) {
    validation[el as ValidationKey] = false
  }
  baseValidation(result, errorMessages, successCallback)
  if (result.status === 422) {
    const data = result.data as JoiData
    errorMessages.value = []
    for (const el in data) {
      errorMessages.value.push(data[el].message)
      validation[data[el].path[0] as ValidationKey] = true
    }
  } else if (result.status === 400) {
    const data = result.data as PostgresData
    if (data.constraint === 'user_unique_email') {
      errorMessages.value = [
        'Es ist bereits ein Konto mit dieser E-Mail-Adresse registriert.',
      ]
      validation.email = true
    } else {
      errorMessages.value = ['Ungültige Eingabe']
    }
  }
}

export const loginValidation = (
  result: ExpressData,
  errorMessages: Ref<string[]>,
  successCallback: () => void
) => {
  baseValidation(result, errorMessages, successCallback)
  if (result.status === 401 || result.status === 400) {
    errorMessages.value = [(result.data as PostgresData).message ?? '']
  }
}
