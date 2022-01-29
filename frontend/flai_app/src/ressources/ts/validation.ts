import { Ref } from 'vue'

export const profileValidation = (
  result: { status: number; data: any },
  errorMessages: Ref<string[]>,
  validation: { username: boolean; password: boolean; email: boolean },
  successCallback: () => void
) => {
  errorMessages.value = []
  if (result.status === 200) {
    successCallback()
  } else if (result.status === 422) {
    type ValidationKey = keyof typeof validation

    for (const el in validation) {
      validation[el as ValidationKey] = false
    }

    for (const el in result.data) {
      console.log(result.data[el].message)
      errorMessages.value.push(result.data[el].message)
      validation[result.data[el].path[0] as ValidationKey] = true
    }
  } else if (result.status === 400) {
    console.log(result)
    if (result.data.constraint === 'user_unique_email') {
      errorMessages.value.push(
        'Es ist bereits ein Konto mit dieser E-Mail-Adresse registriert.'
      )
      validation.email = true
    }
  } else {
    errorMessages.value.push('Ein Netzwerkfehler ist aufgetreten.')
  }
}
