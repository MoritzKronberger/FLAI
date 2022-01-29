import { Ref } from 'vue'

export const baseValidation = (
  result: { status: number; data: any },
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
  result: { status: number; data: any },
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
    errorMessages.value = []
    for (const el in result.data) {
      errorMessages.value.push(result.data[el].message)
      validation[result.data[el].path[0] as ValidationKey] = true
    }
  } else if (result.status === 400) {
    errorMessages.value = []
    if (result.data.constraint === 'user_unique_email') {
      errorMessages.value.push(
        'Es ist bereits ein Konto mit dieser E-Mail-Adresse registriert.'
      )
      validation.email = true
    } else {
      errorMessages.value.push('Ungültige Eingabe')
    }
  }
}
